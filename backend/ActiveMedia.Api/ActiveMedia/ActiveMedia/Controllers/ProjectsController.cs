using ActiveMedia.Api.Data;
using ActiveMedia.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ActiveMedia.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProjectsController(ApplicationDbContext context)
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
    public async Task<ActionResult<IEnumerable<Project>>> GetProjects()
    {
        var projects = await _context.Projects
            .Include(p => p.Clients)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        return Ok(projects);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Project>> GetProject(Guid id)
    {
        var project = await _context.Projects
            .Include(p => p.Clients)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (project == null)
        {
            return NotFound(new { message = "Project not found" });
        }

        return Ok(project);
    }

    [HttpGet("count")]
    public async Task<ActionResult<int>> GetProjectsCount()
    {
        var count = await _context.Projects.CountAsync();
        return Ok(count);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<Project>> CreateProject([FromBody] Project project)
    {
        if (!await HasPermissionAsync("projects_edit"))
        {
            return StatusCode(403, new { error = "You do not have permission to add projects." });
        }

        project.Id = Guid.NewGuid();
        project.CreatedAt = DateTime.UtcNow;

        _context.Projects.Add(project);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateProject(Guid id, [FromBody] Project updatedProject)
    {
        if (!await HasPermissionAsync("projects_edit"))
        {
            return StatusCode(403, new { error = "You do not have permission to edit projects." });
        }

        var existingProject = await _context.Projects.FindAsync(id);
        if (existingProject == null)
        {
            return NotFound(new { message = "Project not found" });
        }

        existingProject.Title = updatedProject.Title;
        existingProject.Category = updatedProject.Category;
        existingProject.ClientId = updatedProject.ClientId;
        existingProject.Description = updatedProject.Description;
        existingProject.Year = updatedProject.Year;
        existingProject.Tags = updatedProject.Tags;
        existingProject.VimeoId = updatedProject.VimeoId;
        existingProject.ImageUrls = updatedProject.ImageUrls;

        await _context.SaveChangesAsync();
        return Ok(existingProject);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteProject(Guid id)
    {
        if (!await HasPermissionAsync("projects_delete"))
        {
            return StatusCode(403, new { error = "You do not have permission to delete projects." });
        }

        var project = await _context.Projects.FindAsync(id);
        if (project == null)
        {
            return NotFound(new { message = "Project not found" });
        }

        _context.Projects.Remove(project);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
