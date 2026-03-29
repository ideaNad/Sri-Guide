using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SriGuide.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueSlugIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Users_Slug",
                table: "Users",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Trips_Slug",
                table: "Trips",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tours_Slug",
                table: "Tours",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PopularPlaces_Slug",
                table: "PopularPlaces",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AgencyProfiles_Slug",
                table: "AgencyProfiles",
                column: "Slug",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Users_Slug",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Trips_Slug",
                table: "Trips");

            migrationBuilder.DropIndex(
                name: "IX_Tours_Slug",
                table: "Tours");

            migrationBuilder.DropIndex(
                name: "IX_PopularPlaces_Slug",
                table: "PopularPlaces");

            migrationBuilder.DropIndex(
                name: "IX_AgencyProfiles_Slug",
                table: "AgencyProfiles");
        }
    }
}
