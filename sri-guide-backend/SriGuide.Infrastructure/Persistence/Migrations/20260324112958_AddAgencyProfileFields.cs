using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SriGuide.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddAgencyProfileFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CompanyAddress",
                table: "AgencyProfiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<List<string>>(
                name: "Languages",
                table: "AgencyProfiles",
                type: "text[]",
                nullable: true);

            migrationBuilder.AddColumn<List<string>>(
                name: "OperatingRegions",
                table: "AgencyProfiles",
                type: "text[]",
                nullable: true);

            migrationBuilder.AddColumn<List<string>>(
                name: "Specialties",
                table: "AgencyProfiles",
                type: "text[]",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompanyAddress",
                table: "AgencyProfiles");

            migrationBuilder.DropColumn(
                name: "Languages",
                table: "AgencyProfiles");

            migrationBuilder.DropColumn(
                name: "OperatingRegions",
                table: "AgencyProfiles");

            migrationBuilder.DropColumn(
                name: "Specialties",
                table: "AgencyProfiles");
        }
    }
}
