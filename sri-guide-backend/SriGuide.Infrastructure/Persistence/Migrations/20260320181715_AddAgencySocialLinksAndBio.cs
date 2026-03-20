using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SriGuide.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddAgencySocialLinksAndBio : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Bio",
                table: "AgencyProfiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FacebookLink",
                table: "AgencyProfiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InstagramLink",
                table: "AgencyProfiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LinkedinLink",
                table: "AgencyProfiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TikTokLink",
                table: "AgencyProfiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TwitterLink",
                table: "AgencyProfiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "YouTubeLink",
                table: "AgencyProfiles",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Bio",
                table: "AgencyProfiles");

            migrationBuilder.DropColumn(
                name: "FacebookLink",
                table: "AgencyProfiles");

            migrationBuilder.DropColumn(
                name: "InstagramLink",
                table: "AgencyProfiles");

            migrationBuilder.DropColumn(
                name: "LinkedinLink",
                table: "AgencyProfiles");

            migrationBuilder.DropColumn(
                name: "TikTokLink",
                table: "AgencyProfiles");

            migrationBuilder.DropColumn(
                name: "TwitterLink",
                table: "AgencyProfiles");

            migrationBuilder.DropColumn(
                name: "YouTubeLink",
                table: "AgencyProfiles");
        }
    }
}
