using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SriGuide.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Phase3_Pricing_Likes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ContactForPrice",
                table: "GuideProfiles",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "TripLikes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    TripId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TripLikes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TripLikes_Trips_TripId",
                        column: x => x.TripId,
                        principalTable: "Trips",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TripLikes_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TripLikes_TripId",
                table: "TripLikes",
                column: "TripId");

            migrationBuilder.CreateIndex(
                name: "IX_TripLikes_UserId_TripId",
                table: "TripLikes",
                columns: new[] { "UserId", "TripId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TripLikes");

            migrationBuilder.DropColumn(
                name: "ContactForPrice",
                table: "GuideProfiles");
        }
    }
}
