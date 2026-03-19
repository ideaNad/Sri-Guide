using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SriGuide.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddGuideSocialLinks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FacebookLink",
                table: "GuideProfiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InstagramLink",
                table: "GuideProfiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "GuideProfiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TikTokLink",
                table: "GuideProfiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WhatsAppNumber",
                table: "GuideProfiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "YouTubeLink",
                table: "GuideProfiles",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FacebookLink",
                table: "GuideProfiles");

            migrationBuilder.DropColumn(
                name: "InstagramLink",
                table: "GuideProfiles");

            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "GuideProfiles");

            migrationBuilder.DropColumn(
                name: "TikTokLink",
                table: "GuideProfiles");

            migrationBuilder.DropColumn(
                name: "WhatsAppNumber",
                table: "GuideProfiles");

            migrationBuilder.DropColumn(
                name: "YouTubeLink",
                table: "GuideProfiles");
        }
    }
}
