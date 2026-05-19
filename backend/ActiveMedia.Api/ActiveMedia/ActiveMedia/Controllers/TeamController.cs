using ActiveMedia.Api.Data;
using ActiveMedia.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ActiveMedia.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeamController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TeamController(ApplicationDbContext context)
    {
        _context = context;
    }

    private async Task<bool> HasPermissionAsync(string permission)
    {
        var email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
        if (string.IsNullOrEmpty(email)) return false;

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user == null) return false;

        if (user.Role == "SuperAdmin") return true;

        var rolePerms = await _context.RolePermissions.FirstOrDefaultAsync(r => r.RoleName == user.Role);
        if (rolePerms == null) return false;

        return rolePerms.Permissions.Contains("all") || rolePerms.Permissions.Contains(permission);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TeamMember>>> GetTeamMembers()
    {
        var members = await _context.TeamMembers
            .OrderBy(t => t.OrderIndex)
            .ToListAsync();

        return Ok(members);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TeamMember>> GetTeamMember(Guid id)
    {
        var member = await _context.TeamMembers.FindAsync(id);
        if (member == null)
        {
            return NotFound(new { message = "Team member not found" });
        }

        return Ok(member);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<TeamMember>> CreateTeamMember([FromBody] TeamMember member)
    {
        if (!await HasPermissionAsync("team_edit"))
        {
            return StatusCode(403, new { error = "You do not have permission to manage the team." });
        }

        member.Id = Guid.NewGuid();
        member.CreatedAt = DateTime.UtcNow;

        _context.TeamMembers.Add(member);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTeamMember), new { id = member.Id }, member);
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateTeamMember(Guid id, [FromBody] TeamMember updatedMember)
    {
        if (!await HasPermissionAsync("team_edit"))
        {
            return StatusCode(403, new { error = "You do not have permission to manage the team." });
        }

        var existingMember = await _context.TeamMembers.FindAsync(id);
        if (existingMember == null)
        {
            return NotFound(new { message = "Team member not found" });
        }

        existingMember.Name = updatedMember.Name;
        existingMember.Role = updatedMember.Role;
        existingMember.Category = updatedMember.Category;
        existingMember.ImageUrl = updatedMember.ImageUrl;
        existingMember.OrderIndex = updatedMember.OrderIndex;

        await _context.SaveChangesAsync();
        return Ok(existingMember);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteTeamMember(Guid id)
    {
        if (!await HasPermissionAsync("team_edit"))
        {
            return StatusCode(403, new { error = "You do not have permission to manage the team." });
        }

        var member = await _context.TeamMembers.FindAsync(id);
        if (member == null)
        {
            return NotFound(new { message = "Team member not found" });
        }

        _context.TeamMembers.Remove(member);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
