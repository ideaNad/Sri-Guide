using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SriGuide.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddGuideFieldsNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Specialty",
                table: "GuideProfiles",
                newName: "TwitterLink");

            migrationBuilder.AddColumn<string>(
                name: "LinkedinLink",
                table: "GuideProfiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<List<string>>(
                name: "OperatingAreas",
                table: "GuideProfiles",
                type: "text[]",
                nullable: true);

            migrationBuilder.AddColumn<List<string>>(
                name: "Specialties",
                table: "GuideProfiles",
                type: "text[]",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LinkedinLink",
                table: "GuideProfiles");

            migrationBuilder.DropColumn(
                name: "OperatingAreas",
                table: "GuideProfiles");

            migrationBuilder.DropColumn(
                name: "Specialties",
                table: "GuideProfiles");

            migrationBuilder.RenameColumn(
                name: "TwitterLink",
                table: "GuideProfiles",
                newName: "Specialty");
        }
    }
}
