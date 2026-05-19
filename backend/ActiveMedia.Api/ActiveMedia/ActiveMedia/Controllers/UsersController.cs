using System.Security.Claims;
using System.Text.Json.Serialization;
using ActiveMedia.Api.Data;
using ActiveMedia.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ActiveMedia.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public UsersController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<UserDto>>> GetUsers()
    {
        var users = await _context.Users.ToListAsync();
        var roles = await _context.RolePermissions.ToDictionaryAsync(r => r.RoleName);

        var result = users.Select(u => {
            var perms = roles.GetValueOrDefault(u.Role ?? "Editor")?.Permissions ?? new List<string>();
            if (u.Role == "SuperAdmin" && !perms.Contains("all")) perms.Add("all");
            return new UserDto(u.Id, u.Email, u.Role ?? "Editor", perms);
        }).ToList();

        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<UserDto>> CreateUser([FromBody] CreateUserRequest request)
    {
        var requesterEmail = User.FindFirst(ClaimTypes.Email)?.Value;
        var requester = await _context.Users.FirstOrDefaultAsync(u => u.Email == requesterEmail);

        if (requester?.Role != "SuperAdmin")
        {
            return StatusCode(403, new { error = "Only SuperAdmins can create new admin accounts." });
        }

        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
        {
            return BadRequest(new { error = "Email already exists." });
        }

        var targetRole = string.IsNullOrEmpty(request.Role) ? "Editor" : request.Role;
        var rolePerm = await _context.RolePermissions.FirstOrDefaultAsync(r => r.RoleName == targetRole);

        var newUser = new Models.User
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
            PasswordHash = ApplicationDbContext.HashPassword(request.Password),
            Role = targetRole,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();

        var perms = rolePerm?.Permissions ?? new List<string>();
        if (targetRole == "SuperAdmin" && !perms.Contains("all")) perms.Add("all");

        return CreatedAtAction(nameof(GetUsers), new { id = newUser.Id }, new UserDto(newUser.Id, newUser.Email, newUser.Role, perms));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        var requesterEmail = User.FindFirst(ClaimTypes.Email)?.Value;
        var requester = await _context.Users.FirstOrDefaultAsync(u => u.Email == requesterEmail);

        if (requester?.Role != "SuperAdmin")
        {
            return StatusCode(403, new { error = "Only SuperAdmins can delete admin accounts." });
        }

        var targetUser = await _context.Users.FindAsync(id);
        if (targetUser == null) return NotFound();

        if (targetUser.Role == "SuperAdmin" && await _context.Users.CountAsync(u => u.Role == "SuperAdmin") <= 1)
        {
            return BadRequest(new { error = "Cannot delete the last SuperAdmin." });
        }

        _context.Users.Remove(targetUser);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // --- Role Management Endpoints ---

    [HttpGet("roles")]
    public async Task<ActionResult<List<RolePermission>>> GetRoles()
    {
        var roles = await _context.RolePermissions.OrderBy(r => r.CreatedAt).ToListAsync();
        return Ok(roles);
    }

    [HttpPost("roles")]
    public async Task<ActionResult<RolePermission>> CreateRole([FromBody] CreateRoleRequest request)
    {
        var requesterEmail = User.FindFirst(ClaimTypes.Email)?.Value;
        var requester = await _context.Users.FirstOrDefaultAsync(u => u.Email == requesterEmail);
        if (requester?.Role != "SuperAdmin") return StatusCode(403, new { error = "Only SuperAdmins can manage roles." });

        if (string.IsNullOrWhiteSpace(request.RoleName)) return BadRequest(new { error = "Role name is required." });
        if (await _context.RolePermissions.AnyAsync(r => r.RoleName.ToLower() == request.RoleName.ToLower()))
        {
            return BadRequest(new { error = "Role name already exists." });
        }

        var newRole = new RolePermission
        {
            Id = Guid.NewGuid(),
            RoleName = request.RoleName,
            Description = request.Description ?? "",
            Permissions = request.Permissions ?? new List<string>(),
            IsSystem = false,
            CreatedAt = DateTime.UtcNow
        };

        _context.RolePermissions.Add(newRole);
        await _context.SaveChangesAsync();
        return Ok(newRole);
    }

    [HttpPut("roles/{id}")]
    public async Task<ActionResult<RolePermission>> UpdateRole(Guid id, [FromBody] CreateRoleRequest request)
    {
        var requesterEmail = User.FindFirst(ClaimTypes.Email)?.Value;
        var requester = await _context.Users.FirstOrDefaultAsync(u => u.Email == requesterEmail);
        if (requester?.Role != "SuperAdmin") return StatusCode(403, new { error = "Only SuperAdmins can manage roles." });

        var role = await _context.RolePermissions.FindAsync(id);
        if (role == null) return NotFound();

        if (role.IsSystem && role.RoleName == "SuperAdmin") return BadRequest(new { error = "Cannot modify SuperAdmin system role." });

        if (role.RoleName != request.RoleName && !role.IsSystem)
        {
            if (await _context.RolePermissions.AnyAsync(r => r.RoleName.ToLower() == request.RoleName.ToLower() && r.Id != id))
            {
                return BadRequest(new { error = "Role name already exists." });
            }
            var usersWithRole = await _context.Users.Where(u => u.Role == role.RoleName).ToListAsync();
            foreach (var u in usersWithRole) u.Role = request.RoleName;
            role.RoleName = request.RoleName;
        }

        role.Description = request.Description ?? role.Description;
        role.Permissions = request.Permissions ?? new List<string>();

        await _context.SaveChangesAsync();
        return Ok(role);
    }

    [HttpDelete("roles/{id}")]
    public async Task<IActionResult> DeleteRole(Guid id)
    {
        var requesterEmail = User.FindFirst(ClaimTypes.Email)?.Value;
        var requester = await _context.Users.FirstOrDefaultAsync(u => u.Email == requesterEmail);
        if (requester?.Role != "SuperAdmin") return StatusCode(403, new { error = "Only SuperAdmins can manage roles." });

        var role = await _context.RolePermissions.FindAsync(id);
        if (role == null) return NotFound();

        if (role.IsSystem) return BadRequest(new { error = "Cannot delete a system role." });

        if (await _context.Users.AnyAsync(u => u.Role == role.RoleName))
        {
            return BadRequest(new { error = "Cannot delete role because there are users assigned to it. Please reassign those users first." });
        }

        _context.RolePermissions.Remove(role);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

public record CreateUserRequest(
    [property: JsonPropertyName("email")] string Email, 
    [property: JsonPropertyName("password")] string Password, 
    [property: JsonPropertyName("role")] string Role
);

public record CreateRoleRequest(
    [property: JsonPropertyName("role_name")] string RoleName, 
    [property: JsonPropertyName("description")] string Description, 
    [property: JsonPropertyName("permissions")] List<string> Permissions
);
