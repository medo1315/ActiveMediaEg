using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ActiveMedia.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddRolePermissionsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RolePermissions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RoleName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Permissions = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsSystem = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RolePermissions", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "Clients",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222221"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 19, 0, 2, 12, 802, DateTimeKind.Utc).AddTicks(3090));

            migrationBuilder.UpdateData(
                table: "Clients",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 19, 0, 2, 12, 802, DateTimeKind.Utc).AddTicks(3184));

            migrationBuilder.UpdateData(
                table: "Projects",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333331"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 19, 0, 2, 12, 802, DateTimeKind.Utc).AddTicks(4845));

            migrationBuilder.UpdateData(
                table: "Projects",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333332"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 19, 0, 2, 12, 802, DateTimeKind.Utc).AddTicks(4940));

            migrationBuilder.InsertData(
                table: "RolePermissions",
                columns: new[] { "Id", "CreatedAt", "Description", "IsSystem", "Permissions", "RoleName" },
                values: new object[,]
                {
                    { new Guid("55555555-5555-5555-5555-555555555551"), new DateTime(2026, 5, 19, 0, 2, 12, 797, DateTimeKind.Utc).AddTicks(7336), "صلاحيات المشرف العام الكاملة (إدارة شاملة للنظام)", true, "[\"all\"]", "SuperAdmin" },
                    { new Guid("55555555-5555-5555-5555-555555555552"), new DateTime(2026, 5, 19, 0, 2, 12, 797, DateTimeKind.Utc).AddTicks(7466), "إدارة المحتوى والمشاريع والعملاء والرسائل فقط", true, "[\"projects_view\",\"projects_edit\",\"projects_delete\",\"clients_view\",\"clients_edit\",\"clients_delete\",\"team_view\",\"team_edit\",\"messages_view\",\"messages_delete\"]", "Editor" }
                });

            migrationBuilder.UpdateData(
                table: "SiteSettings",
                keyColumn: "Id",
                keyValue: "global",
                column: "UpdatedAt",
                value: new DateTime(2026, 5, 19, 0, 2, 12, 802, DateTimeKind.Utc).AddTicks(1835));

            migrationBuilder.UpdateData(
                table: "TeamMembers",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444441"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 19, 0, 2, 12, 802, DateTimeKind.Utc).AddTicks(5811));

            migrationBuilder.UpdateData(
                table: "TeamMembers",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444442"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 19, 0, 2, 12, 802, DateTimeKind.Utc).AddTicks(5898));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 19, 0, 2, 12, 802, DateTimeKind.Utc).AddTicks(588));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RolePermissions");

            migrationBuilder.UpdateData(
                table: "Clients",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222221"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 18, 23, 52, 19, 758, DateTimeKind.Utc).AddTicks(1449));

            migrationBuilder.UpdateData(
                table: "Clients",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 18, 23, 52, 19, 758, DateTimeKind.Utc).AddTicks(1548));

            migrationBuilder.UpdateData(
                table: "Projects",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333331"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 18, 23, 52, 19, 758, DateTimeKind.Utc).AddTicks(3111));

            migrationBuilder.UpdateData(
                table: "Projects",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333332"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 18, 23, 52, 19, 758, DateTimeKind.Utc).AddTicks(3227));

            migrationBuilder.UpdateData(
                table: "SiteSettings",
                keyColumn: "Id",
                keyValue: "global",
                column: "UpdatedAt",
                value: new DateTime(2026, 5, 18, 23, 52, 19, 758, DateTimeKind.Utc).AddTicks(188));

            migrationBuilder.UpdateData(
                table: "TeamMembers",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444441"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 18, 23, 52, 19, 758, DateTimeKind.Utc).AddTicks(4129));

            migrationBuilder.UpdateData(
                table: "TeamMembers",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444442"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 18, 23, 52, 19, 758, DateTimeKind.Utc).AddTicks(4223));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 18, 23, 52, 19, 757, DateTimeKind.Utc).AddTicks(5557));
        }
    }
}
