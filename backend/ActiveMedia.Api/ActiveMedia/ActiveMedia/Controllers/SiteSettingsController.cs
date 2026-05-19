using ActiveMedia.Api.Data;
using ActiveMedia.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ActiveMedia.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SiteSettingsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public SiteSettingsController(ApplicationDbContext context)
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

    [HttpGet("global")]
    public async Task<ActionResult<SiteSetting>> GetGlobalSettings()
    {
        var settings = await _context.SiteSettings.FirstOrDefaultAsync(s => s.Id == "global");
        if (settings == null)
        {
            settings = new SiteSetting
            {
                Id = "global",
                ManualClientsCount = 50,
                ShowreelVimeoId = "https://vimeo.com/824804225",
                UpdatedAt = DateTime.UtcNow
            };
            _context.SiteSettings.Add(settings);
            await _context.SaveChangesAsync();
        }

        return Ok(settings);
    }

    [HttpPut("global")]
    [Authorize]
    public async Task<IActionResult> UpdateGlobalSettings([FromBody] SiteSetting updatedSettings)
    {
        if (!await HasPermissionAsync("settings_manage"))
        {
            return StatusCode(403, new { error = "You do not have permission to manage site settings." });
        }

        var settings = await _context.SiteSettings.FirstOrDefaultAsync(s => s.Id == "global");
        if (settings == null)
        {
            settings = new SiteSetting { Id = "global" };
            _context.SiteSettings.Add(settings);
        }

        settings.ShowreelVimeoId = updatedSettings.ShowreelVimeoId;
        settings.ManualClientsCount = updatedSettings.ManualClientsCount;
        settings.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(settings);
    }
}
