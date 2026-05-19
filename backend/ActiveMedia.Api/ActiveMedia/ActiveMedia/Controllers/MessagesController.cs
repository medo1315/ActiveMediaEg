using ActiveMedia.Api.Data;
using ActiveMedia.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ActiveMedia.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MessagesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public MessagesController(ApplicationDbContext context)
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
    [Authorize]
    public async Task<ActionResult<IEnumerable<Message>>> GetMessages()
    {
        if (!await HasPermissionAsync("messages_view"))
        {
            return StatusCode(403, new { error = "You do not have permission to view messages." });
        }

        var messages = await _context.Messages
            .OrderByDescending(m => m.CreatedAt)
            .ToListAsync();

        return Ok(messages);
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<ActionResult<Message>> GetMessage(Guid id)
    {
        if (!await HasPermissionAsync("messages_view"))
        {
            return StatusCode(403, new { error = "You do not have permission to view messages." });
        }

        var message = await _context.Messages.FindAsync(id);
        if (message == null)
        {
            return NotFound(new { message = "Message not found" });
        }

        return Ok(message);
    }

    [HttpPost]
    public async Task<ActionResult<Message>> CreateMessage([FromBody] Message message)
    {
        message.Id = Guid.NewGuid();
        message.CreatedAt = DateTime.UtcNow;

        _context.Messages.Add(message);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMessage), new { id = message.Id }, message);
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateMessage(Guid id, [FromBody] Message updatedMessage)
    {
        if (!await HasPermissionAsync("messages_view"))
        {
            return StatusCode(403, new { error = "You do not have permission to modify message status." });
        }

        var existingMessage = await _context.Messages.FindAsync(id);
        if (existingMessage == null)
        {
            return NotFound(new { message = "Message not found" });
        }

        existingMessage.IsRead = updatedMessage.IsRead;

        await _context.SaveChangesAsync();
        return Ok(existingMessage);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteMessage(Guid id)
    {
        if (!await HasPermissionAsync("messages_delete"))
        {
            return StatusCode(403, new { error = "You do not have permission to delete messages." });
        }

        var message = await _context.Messages.FindAsync(id);
        if (message == null)
        {
            return NotFound(new { message = "Message not found" });
        }

        _context.Messages.Remove(message);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
