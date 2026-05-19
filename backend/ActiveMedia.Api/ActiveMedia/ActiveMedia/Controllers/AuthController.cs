using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ActiveMedia.Api.Data;
using ActiveMedia.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace ActiveMedia.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _config;

    public AuthController(ApplicationDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        var passwordHash = ApplicationDbContext.HashPassword(request.Password);

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email && u.PasswordHash == passwordHash);

        if (user == null)
        {
            return BadRequest(new AuthResponse(null, "Invalid email or password"));
        }

        var rolePerms = await _context.RolePermissions.FirstOrDefaultAsync(r => r.RoleName == (user.Role ?? "Editor"));
        var permissions = rolePerms?.Permissions ?? new List<string>();
        if (user.Role == "SuperAdmin" && !permissions.Contains("all"))
        {
            permissions.Add("all");
        }

        var token = GenerateJwtToken(user);
        var session = new AuthSession(token, new UserDto(user.Id, user.Email, user.Role ?? "Editor", permissions));

        return Ok(new AuthResponse(session, null));
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        return Ok(new { message = "Logged out successfully" });
    }

    [HttpGet("session")]
    [Authorize]
    public async Task<ActionResult<AuthResponse>> GetSession()
    {
        var emailClaim = User.FindFirst(ClaimTypes.Email)?.Value;
        if (string.IsNullOrEmpty(emailClaim))
        {
            return Unauthorized(new AuthResponse(null, "No active session"));
        }

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == emailClaim);
        if (user == null)
        {
            return Unauthorized(new AuthResponse(null, "User not found"));
        }

        var rolePerms = await _context.RolePermissions.FirstOrDefaultAsync(r => r.RoleName == (user.Role ?? "Editor"));
        var permissions = rolePerms?.Permissions ?? new List<string>();
        if (user.Role == "SuperAdmin" && !permissions.Contains("all"))
        {
            permissions.Add("all");
        }

        var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
        var session = new AuthSession(token, new UserDto(user.Id, user.Email, user.Role ?? "Editor", permissions));

        return Ok(new AuthResponse(session, null));
    }

    private string GenerateJwtToken(User user)
    {
        var secretKey = _config["Jwt:Secret"] ?? "ActiveMediaSuperSecretKey1234567890!@#$%^&*()_+";
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role ?? "Editor"),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
