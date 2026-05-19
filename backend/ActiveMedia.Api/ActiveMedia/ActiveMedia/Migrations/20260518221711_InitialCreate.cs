using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ActiveMedia.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Clients",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LogoUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ManagerName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TestimonialText = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TestimonialRole = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clients", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Messages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Interest = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Company = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProjectDetails = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsRead = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Messages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SiteSettings",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ShowreelVimeoId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ManualClientsCount = table.Column<int>(type: "int", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SiteSettings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TeamMembers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OrderIndex = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeamMembers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ClientId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Year = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Tags = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VimeoId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ImageUrls = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Projects_Clients_ClientId",
                        column: x => x.ClientId,
                        principalTable: "Clients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.InsertData(
                table: "Clients",
                columns: new[] { "Id", "CreatedAt", "LogoUrl", "ManagerName", "Name", "TestimonialRole", "TestimonialText" },
                values: new object[,]
                {
                    { new Guid("22222222-2222-2222-2222-222222222221"), new DateTime(2026, 5, 18, 22, 17, 9, 830, DateTimeKind.Utc).AddTicks(6004), "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=300", "Ahmed Alabbar", "Emaar Properties", "Marketing Director", "Active Media delivered outstanding visual storytelling that transformed our marketing campaigns." },
                    { new Guid("22222222-2222-2222-2222-222222222222"), new DateTime(2026, 5, 18, 22, 17, 9, 830, DateTimeKind.Utc).AddTicks(6085), "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=300", "Khalid Al-Falih", "Saudi Aramco", "VP Communications", "Professionalism and premium quality at every step of production. Highly recommended." }
                });

            migrationBuilder.InsertData(
                table: "SiteSettings",
                columns: new[] { "Id", "ManualClientsCount", "ShowreelVimeoId", "UpdatedAt" },
                values: new object[] { "global", 50, "https://vimeo.com/824804225", new DateTime(2026, 5, 18, 22, 17, 9, 830, DateTimeKind.Utc).AddTicks(4930) });

            migrationBuilder.InsertData(
                table: "TeamMembers",
                columns: new[] { "Id", "Category", "CreatedAt", "ImageUrl", "Name", "OrderIndex", "Role" },
                values: new object[,]
                {
                    { new Guid("44444444-4444-4444-4444-444444444441"), "Co-founder", new DateTime(2026, 5, 18, 22, 17, 9, 830, DateTimeKind.Utc).AddTicks(8428), "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800", "Omar Al-Sayed", 1, "Founder & Executive Producer" },
                    { new Guid("44444444-4444-4444-4444-444444444442"), "Leadership", new DateTime(2026, 5, 18, 22, 17, 9, 830, DateTimeKind.Utc).AddTicks(8506), "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800", "Sarah Mansour", 2, "Creative Director" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "PasswordHash" },
                values: new object[] { new Guid("11111111-1111-1111-1111-111111111111"), new DateTime(2026, 5, 18, 22, 17, 9, 829, DateTimeKind.Utc).AddTicks(8443), "admin@activemedia.com", "JAvlGPq9JyTdtvBO6x2llnRI1+gxwIyPqCKAn3THIKk=" });

            migrationBuilder.InsertData(
                table: "Projects",
                columns: new[] { "Id", "Category", "ClientId", "CreatedAt", "Description", "ImageUrls", "Tags", "Title", "VimeoId", "Year" },
                values: new object[,]
                {
                    { new Guid("33333333-3333-3333-3333-333333333331"), "video", new Guid("22222222-2222-2222-2222-222222222221"), new DateTime(2026, 5, 18, 22, 17, 9, 830, DateTimeKind.Utc).AddTicks(7558), "A cinematic documentary exploring groundbreaking architectural marvels and sustainable smart cities.", "[\"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format\\u0026fit=crop\\u0026q=80\\u0026w=1600\",\"https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format\\u0026fit=crop\\u0026q=80\\u0026w=1600\",\"https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format\\u0026fit=crop\\u0026q=80\\u0026w=1600\"]", "[\"4K Video\",\"Drone\",\"Cinematography\",\"Architectural\"]", "The Future of Urban Living", "824804225", "2025" },
                    { new Guid("33333333-3333-3333-3333-333333333332"), "branding", new Guid("22222222-2222-2222-2222-222222222222"), new DateTime(2026, 5, 18, 22, 17, 9, 830, DateTimeKind.Utc).AddTicks(7644), "Comprehensive brand identity overhaul and corporate reveal video highlighting clean energy transitions.", "[\"https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format\\u0026fit=crop\\u0026q=80\\u0026w=1600\",\"https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format\\u0026fit=crop\\u0026q=80\\u0026w=1600\"]", "[\"Branding\",\"Motion Graphics\",\"Corporate\"]", "Next-Gen Energy Vision", "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "2026" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Projects_ClientId",
                table: "Projects",
                column: "ClientId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Messages");

            migrationBuilder.DropTable(
                name: "Projects");

            migrationBuilder.DropTable(
                name: "SiteSettings");

            migrationBuilder.DropTable(
                name: "TeamMembers");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Clients");
        }
    }
}
