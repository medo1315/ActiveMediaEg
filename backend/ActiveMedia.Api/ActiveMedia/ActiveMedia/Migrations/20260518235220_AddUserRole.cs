using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ActiveMedia.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddUserRole : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Role",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

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
                columns: new[] { "CreatedAt", "Role" },
                values: new object[] { new DateTime(2026, 5, 18, 23, 52, 19, 757, DateTimeKind.Utc).AddTicks(5557), "SuperAdmin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Role",
                table: "Users");

            migrationBuilder.UpdateData(
                table: "Clients",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222221"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 18, 22, 17, 9, 830, DateTimeKind.Utc).AddTicks(6004));

            migrationBuilder.UpdateData(
                table: "Clients",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 18, 22, 17, 9, 830, DateTimeKind.Utc).AddTicks(6085));

            migrationBuilder.UpdateData(
                table: "Projects",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333331"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 18, 22, 17, 9, 830, DateTimeKind.Utc).AddTicks(7558));

            migrationBuilder.UpdateData(
                table: "Projects",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333332"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 18, 22, 17, 9, 830, DateTimeKind.Utc).AddTicks(7644));

            migrationBuilder.UpdateData(
                table: "SiteSettings",
                keyColumn: "Id",
                keyValue: "global",
                column: "UpdatedAt",
                value: new DateTime(2026, 5, 18, 22, 17, 9, 830, DateTimeKind.Utc).AddTicks(4930));

            migrationBuilder.UpdateData(
                table: "TeamMembers",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444441"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 18, 22, 17, 9, 830, DateTimeKind.Utc).AddTicks(8428));

            migrationBuilder.UpdateData(
                table: "TeamMembers",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444442"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 18, 22, 17, 9, 830, DateTimeKind.Utc).AddTicks(8506));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "CreatedAt",
                value: new DateTime(2026, 5, 18, 22, 17, 9, 829, DateTimeKind.Utc).AddTicks(8443));
        }
    }
}
