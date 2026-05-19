using ActiveMedia.Api.Data;
using ActiveMedia.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ActiveMedia.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClientsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ClientsController(ApplicationDbContext context)
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
    public async Task<ActionResult<IEnumerable<Client>>> GetClients()
    {
        var clients = await _context.Clients
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

        return Ok(clients);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Client>> GetClient(Guid id)
    {
        var client = await _context.Clients.FindAsync(id);
        if (client == null)
        {
            return NotFound(new { message = "Client not found" });
        }

        return Ok(client);
    }

    [HttpGet("count")]
    public async Task<ActionResult<int>> GetClientsCount()
    {
        var count = await _context.Clients.CountAsync();
        return Ok(count);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<Client>> CreateClient([FromBody] Client client)
    {
        if (!await HasPermissionAsync("clients_edit"))
        {
            return StatusCode(403, new { error = "You do not have permission to add clients." });
        }

        client.Id = Guid.NewGuid();
        client.CreatedAt = DateTime.UtcNow;

        _context.Clients.Add(client);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetClient), new { id = client.Id }, client);
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateClient(Guid id, [FromBody] Client updatedClient)
    {
        if (!await HasPermissionAsync("clients_edit"))
        {
            return StatusCode(403, new { error = "You do not have permission to edit clients." });
        }

        var existingClient = await _context.Clients.FindAsync(id);
        if (existingClient == null)
        {
            return NotFound(new { message = "Client not found" });
        }

        existingClient.Name = updatedClient.Name;
        existingClient.LogoUrl = updatedClient.LogoUrl;
        existingClient.ManagerName = updatedClient.ManagerName;
        existingClient.TestimonialText = updatedClient.TestimonialText;
        existingClient.TestimonialRole = updatedClient.TestimonialRole;

        await _context.SaveChangesAsync();
        return Ok(existingClient);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteClient(Guid id)
    {
        if (!await HasPermissionAsync("clients_delete"))
        {
            return StatusCode(403, new { error = "You do not have permission to delete clients." });
        }

        var client = await _context.Clients.FindAsync(id);
        if (client == null)
        {
            return NotFound(new { message = "Client not found" });
        }

        _context.Clients.Remove(client);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
