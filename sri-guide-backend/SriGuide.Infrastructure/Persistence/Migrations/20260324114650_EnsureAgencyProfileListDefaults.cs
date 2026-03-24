using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SriGuide.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class EnsureAgencyProfileListDefaults : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE \"AgencyProfiles\" SET \"Languages\" = '{}' WHERE \"Languages\" IS NULL;");
            migrationBuilder.Sql("UPDATE \"AgencyProfiles\" SET \"Specialties\" = '{}' WHERE \"Specialties\" IS NULL;");
            migrationBuilder.Sql("UPDATE \"AgencyProfiles\" SET \"OperatingRegions\" = '{}' WHERE \"OperatingRegions\" IS NULL;");
            migrationBuilder.Sql("UPDATE \"GuideProfiles\" SET \"Languages\" = '{}' WHERE \"Languages\" IS NULL;");

            migrationBuilder.AlterColumn<List<string>>(
                name: "Languages",
                table: "GuideProfiles",
                type: "text[]",
                nullable: true,
                oldClrType: typeof(List<string>),
                oldType: "text[]");

            migrationBuilder.AlterColumn<List<string>>(
                name: "Specialties",
                table: "AgencyProfiles",
                type: "text[]",
                nullable: true,
                oldClrType: typeof(List<string>),
                oldType: "text[]");

            migrationBuilder.AlterColumn<List<string>>(
                name: "OperatingRegions",
                table: "AgencyProfiles",
                type: "text[]",
                nullable: true,
                oldClrType: typeof(List<string>),
                oldType: "text[]");

            migrationBuilder.AlterColumn<List<string>>(
                name: "Languages",
                table: "AgencyProfiles",
                type: "text[]",
                nullable: true,
                oldClrType: typeof(List<string>),
                oldType: "text[]");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<List<string>>(
                name: "Languages",
                table: "GuideProfiles",
                type: "text[]",
                nullable: false,
                oldClrType: typeof(List<string>),
                oldType: "text[]",
                oldNullable: true);

            migrationBuilder.AlterColumn<List<string>>(
                name: "Specialties",
                table: "AgencyProfiles",
                type: "text[]",
                nullable: false,
                oldClrType: typeof(List<string>),
                oldType: "text[]",
                oldNullable: true);

            migrationBuilder.AlterColumn<List<string>>(
                name: "OperatingRegions",
                table: "AgencyProfiles",
                type: "text[]",
                nullable: false,
                oldClrType: typeof(List<string>),
                oldType: "text[]",
                oldNullable: true);

            migrationBuilder.AlterColumn<List<string>>(
                name: "Languages",
                table: "AgencyProfiles",
                type: "text[]",
                nullable: false,
                oldClrType: typeof(List<string>),
                oldType: "text[]",
                oldNullable: true);
        }
    }
}
