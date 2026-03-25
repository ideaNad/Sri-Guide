using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SriGuide.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ExpandOrganizerProfile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TwitterUrl",
                table: "EventOrganizerProfiles",
                newName: "YouTubeLink");

            migrationBuilder.RenameColumn(
                name: "InstagramUrl",
                table: "EventOrganizerProfiles",
                newName: "TwitterLink");

            migrationBuilder.RenameColumn(
                name: "FacebookUrl",
                table: "EventOrganizerProfiles",
                newName: "TikTokLink");

            migrationBuilder.AddColumn<string>(
                name: "FacebookLink",
                table: "EventOrganizerProfiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InstagramLink",
                table: "EventOrganizerProfiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<List<string>>(
                name: "Languages",
                table: "EventOrganizerProfiles",
                type: "text[]",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LinkedinLink",
                table: "EventOrganizerProfiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<List<string>>(
                name: "OperatingAreas",
                table: "EventOrganizerProfiles",
                type: "text[]",
                nullable: true);

            migrationBuilder.AddColumn<List<string>>(
                name: "Specialties",
                table: "EventOrganizerProfiles",
                type: "text[]",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FacebookLink",
                table: "EventOrganizerProfiles");

            migrationBuilder.DropColumn(
                name: "InstagramLink",
                table: "EventOrganizerProfiles");

            migrationBuilder.DropColumn(
                name: "Languages",
                table: "EventOrganizerProfiles");

            migrationBuilder.DropColumn(
                name: "LinkedinLink",
                table: "EventOrganizerProfiles");

            migrationBuilder.DropColumn(
                name: "OperatingAreas",
                table: "EventOrganizerProfiles");

            migrationBuilder.DropColumn(
                name: "Specialties",
                table: "EventOrganizerProfiles");

            migrationBuilder.RenameColumn(
                name: "YouTubeLink",
                table: "EventOrganizerProfiles",
                newName: "TwitterUrl");

            migrationBuilder.RenameColumn(
                name: "TwitterLink",
                table: "EventOrganizerProfiles",
                newName: "InstagramUrl");

            migrationBuilder.RenameColumn(
                name: "TikTokLink",
                table: "EventOrganizerProfiles",
                newName: "FacebookUrl");
        }
    }
}
