using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SriGuide.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddRestaurantSocialLinks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FacebookLink",
                table: "RestaurantProfiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InstagramLink",
                table: "RestaurantProfiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LinkedinLink",
                table: "RestaurantProfiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TikTokLink",
                table: "RestaurantProfiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TwitterLink",
                table: "RestaurantProfiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Website",
                table: "RestaurantProfiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "YouTubeLink",
                table: "RestaurantProfiles",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FacebookLink",
                table: "RestaurantProfiles");

            migrationBuilder.DropColumn(
                name: "InstagramLink",
                table: "RestaurantProfiles");

            migrationBuilder.DropColumn(
                name: "LinkedinLink",
                table: "RestaurantProfiles");

            migrationBuilder.DropColumn(
                name: "TikTokLink",
                table: "RestaurantProfiles");

            migrationBuilder.DropColumn(
                name: "TwitterLink",
                table: "RestaurantProfiles");

            migrationBuilder.DropColumn(
                name: "Website",
                table: "RestaurantProfiles");

            migrationBuilder.DropColumn(
                name: "YouTubeLink",
                table: "RestaurantProfiles");
        }
    }
}
