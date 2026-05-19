using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using ActiveMedia.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace ActiveMedia.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Client> Clients => Set<Client>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<SiteSetting> SiteSettings => Set<SiteSetting>();
    public DbSet<TeamMember> TeamMembers => Set<TeamMember>();
    public DbSet<Message> Messages => Set<Message>();
    public DbSet<User> Users => Set<User>();
    public DbSet<RolePermission> RolePermissions => Set<RolePermission>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure Project -> Client relationship
        modelBuilder.Entity<Project>()
            .HasOne(p => p.Clients)
            .WithMany()
            .HasForeignKey(p => p.ClientId)
            .OnDelete(DeleteBehavior.SetNull);

        // Configure List<string> conversions and comparers for SQL Server compatibility
        var stringListComparer = new ValueComparer<List<string>>(
            (c1, c2) => (c1 ?? new List<string>()).SequenceEqual(c2 ?? new List<string>()),
            c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v == null ? 0 : v.GetHashCode())),
            c => c.ToList()
        );

        modelBuilder.Entity<Project>()
            .Property(p => p.Tags)
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>()
            )
            .Metadata.SetValueComparer(stringListComparer);

        modelBuilder.Entity<Project>()
            .Property(p => p.ImageUrls)
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>()
            )
            .Metadata.SetValueComparer(stringListComparer);

        modelBuilder.Entity<RolePermission>()
            .Property(rp => rp.Permissions)
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>()
            )
            .Metadata.SetValueComparer(stringListComparer);

        // Seed default roles
        modelBuilder.Entity<RolePermission>().HasData(
            new RolePermission
            {
                Id = Guid.Parse("55555555-5555-5555-5555-555555555551"),
                RoleName = "SuperAdmin",
                Description = "صلاحيات المشرف العام الكاملة (إدارة شاملة للنظام)",
                Permissions = new List<string> { "all" },
                IsSystem = true,
                CreatedAt = DateTime.UtcNow
            },
            new RolePermission
            {
                Id = Guid.Parse("55555555-5555-5555-5555-555555555552"),
                RoleName = "Editor",
                Description = "إدارة المحتوى والمشاريع والعملاء والرسائل فقط",
                Permissions = new List<string> { "projects_view", "projects_edit", "projects_delete", "clients_view", "clients_edit", "clients_delete", "team_view", "team_edit", "messages_view", "messages_delete" },
                IsSystem = true,
                CreatedAt = DateTime.UtcNow
            }
        );

        // Seed default Admin User
        var adminId = Guid.Parse("11111111-1111-1111-1111-111111111111");
        modelBuilder.Entity<User>().HasData(new User
        {
            Id = adminId,
            Email = "admin@activemedia.com",
            PasswordHash = HashPassword("admin123"),
            Role = "SuperAdmin",
            CreatedAt = DateTime.UtcNow
        });

        // Seed default Site Settings
        modelBuilder.Entity<SiteSetting>().HasData(new SiteSetting
        {
            Id = "global",
            ShowreelVimeoId = "https://vimeo.com/824804225",
            ManualClientsCount = 50,
            UpdatedAt = DateTime.UtcNow
        });

        // Seed sample clients
        var client1Id = Guid.Parse("22222222-2222-2222-2222-222222222221");
        var client2Id = Guid.Parse("22222222-2222-2222-2222-222222222222");
        modelBuilder.Entity<Client>().HasData(
            new Client
            {
                Id = client1Id,
                Name = "Emaar Properties",
                LogoUrl = "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=300",
                ManagerName = "Ahmed Alabbar",
                TestimonialText = "Active Media delivered outstanding visual storytelling that transformed our marketing campaigns.",
                TestimonialRole = "Marketing Director",
                CreatedAt = DateTime.UtcNow
            },
            new Client
            {
                Id = client2Id,
                Name = "Saudi Aramco",
                LogoUrl = "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=300",
                ManagerName = "Khalid Al-Falih",
                TestimonialText = "Professionalism and premium quality at every step of production. Highly recommended.",
                TestimonialRole = "VP Communications",
                CreatedAt = DateTime.UtcNow
            }
        );

        // Seed sample projects
        modelBuilder.Entity<Project>().HasData(
            new Project
            {
                Id = Guid.Parse("33333333-3333-3333-3333-333333333331"),
                Category = "video",
                Title = "The Future of Urban Living",
                ClientId = client1Id,
                Description = "A cinematic documentary exploring groundbreaking architectural marvels and sustainable smart cities.",
                Year = "2025",
                Tags = new List<string> { "4K Video", "Drone", "Cinematography", "Architectural" },
                VimeoId = "824804225",
                ImageUrls = new List<string> { 
                    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600",
                    "https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&q=80&w=1600",
                    "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=80&w=1600"
                },
                CreatedAt = DateTime.UtcNow
            },
            new Project
            {
                Id = Guid.Parse("33333333-3333-3333-3333-333333333332"),
                Category = "branding",
                Title = "Next-Gen Energy Vision",
                ClientId = client2Id,
                Description = "Comprehensive brand identity overhaul and corporate reveal video highlighting clean energy transitions.",
                Year = "2026",
                Tags = new List<string> { "Branding", "Motion Graphics", "Corporate" },
                VimeoId = "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                ImageUrls = new List<string> { 
                    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1600",
                    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1600"
                },
                CreatedAt = DateTime.UtcNow
            }
        );

        // Seed sample team members
        modelBuilder.Entity<TeamMember>().HasData(
            new TeamMember
            {
                Id = Guid.Parse("44444444-4444-4444-4444-444444444441"),
                Name = "Omar Al-Sayed",
                Role = "Founder & Executive Producer",
                Category = "Co-founder",
                ImageUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
                OrderIndex = 1,
                CreatedAt = DateTime.UtcNow
            },
            new TeamMember
            {
                Id = Guid.Parse("44444444-4444-4444-4444-444444444442"),
                Name = "Sarah Mansour",
                Role = "Creative Director",
                Category = "Leadership",
                ImageUrl = "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800",
                OrderIndex = 2,
                CreatedAt = DateTime.UtcNow
            }
        );
    }

    public static string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashedBytes);
    }
}
