using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SriGuide.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class SeparateToursAndTripsFinal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 1. Create new tables first
            migrationBuilder.CreateTable(
                name: "Tours",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AgencyId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Location = table.Column<string>(type: "text", nullable: false),
                    Category = table.Column<string>(type: "text", nullable: true),
                    Duration = table.Column<string>(type: "text", nullable: true),
                    MapLink = table.Column<string>(type: "text", nullable: true),
                    Price = table.Column<decimal>(type: "numeric", nullable: false),
                    MainImageUrl = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tours", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tours_AgencyProfiles_AgencyId",
                        column: x => x.AgencyId,
                        principalTable: "AgencyProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TourDays",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TourId = table.Column<Guid>(type: "uuid", nullable: false),
                    DayNumber = table.Column<int>(type: "integer", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    ImageUrl = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TourDays", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TourDays_Tours_TourId",
                        column: x => x.TourId,
                        principalTable: "Tours",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TourImages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TourId = table.Column<Guid>(type: "uuid", nullable: false),
                    ImageUrl = table.Column<string>(type: "text", nullable: false),
                    Caption = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TourImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TourImages_Tours_TourId",
                        column: x => x.TourId,
                        principalTable: "Tours",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TourItinerarySteps",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TourId = table.Column<Guid>(type: "uuid", nullable: false),
                    Time = table.Column<string>(type: "text", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    ImageUrl = table.Column<string>(type: "text", nullable: true),
                    DayNumber = table.Column<int>(type: "integer", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TourItinerarySteps", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TourItinerarySteps_Tours_TourId",
                        column: x => x.TourId,
                        principalTable: "Tours",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TourLikes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TourId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TourLikes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TourLikes_Tours_TourId",
                        column: x => x.TourId,
                        principalTable: "Tours",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TourLikes_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            // 2. Migrate Data
            migrationBuilder.Sql("INSERT INTO \"Tours\" (\"Id\", \"AgencyId\", \"Title\", \"Description\", \"Location\", \"Category\", \"Duration\", \"MapLink\", \"Price\", \"MainImageUrl\", \"IsActive\", \"CreatedAt\", \"UpdatedAt\") " +
                "SELECT \"Id\", \"AgencyId\", \"Title\", \"Description\", \"Location\", \"Category\", \"Duration\", \"MapLink\", \"Price\", NULL, \"IsActive\", \"CreatedAt\", \"UpdatedAt\" " +
                "FROM \"Trips\" WHERE \"IsAgencyTour\" = true");

            migrationBuilder.Sql("INSERT INTO \"TourDays\" (\"Id\", \"TourId\", \"DayNumber\", \"Description\", \"ImageUrl\", \"CreatedAt\", \"UpdatedAt\") " +
                "SELECT \"Id\", \"TripId\", \"DayNumber\", \"Description\", \"ImageUrl\", \"CreatedAt\", \"UpdatedAt\" " +
                "FROM \"TripDays\" WHERE \"TripId\" IN (SELECT \"Id\" FROM \"Trips\" WHERE \"IsAgencyTour\" = true)");

            migrationBuilder.Sql("INSERT INTO \"TourItinerarySteps\" (\"Id\", \"TourId\", \"Time\", \"Title\", \"Description\", \"ImageUrl\", \"DayNumber\", \"Order\", \"CreatedAt\", \"UpdatedAt\") " +
                "SELECT \"Id\", \"TripId\", \"Time\", \"Title\", \"Description\", \"ImageUrl\", \"DayNumber\", \"Order\", \"CreatedAt\", \"UpdatedAt\" " +
                "FROM \"ItinerarySteps\" WHERE \"TripId\" IN (SELECT \"Id\" FROM \"Trips\" WHERE \"IsAgencyTour\" = true)");

            // 3. Update Bookings and cleanup
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_Trips_TripId",
                table: "Bookings");

            migrationBuilder.RenameColumn(
                name: "TripId",
                table: "Bookings",
                newName: "TourId");

            migrationBuilder.RenameIndex(
                name: "IX_Bookings_TripId",
                table: "Bookings",
                newName: "IX_Bookings_TourId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_Tours_TourId",
                table: "Bookings",
                column: "TourId",
                principalTable: "Tours",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            // Set TourId to null for non-agency trips in Bookings (though normally bookings are only for tours)
            migrationBuilder.Sql("UPDATE \"Bookings\" SET \"TourId\" = NULL WHERE \"TourId\" NOT IN (SELECT \"Id\" FROM \"Tours\")");

            // 4. Drop old tables and columns
            migrationBuilder.DropTable(
                name: "ItinerarySteps");

            migrationBuilder.DropTable(
                name: "TripDays");

            migrationBuilder.DropColumn(
                name: "Category",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "Duration",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "IsAgencyTour",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "Price",
                table: "Trips");

            migrationBuilder.RenameColumn(
                name: "MapLink",
                table: "Trips",
                newName: "MainImageUrl");

            migrationBuilder.AddColumn<int>(
                name: "ViewCount",
                table: "Trips",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_TourDays_TourId",
                table: "TourDays",
                column: "TourId");

            migrationBuilder.CreateIndex(
                name: "IX_TourImages_TourId",
                table: "TourImages",
                column: "TourId");

            migrationBuilder.CreateIndex(
                name: "IX_TourItinerarySteps_TourId",
                table: "TourItinerarySteps",
                column: "TourId");

            migrationBuilder.CreateIndex(
                name: "IX_TourLikes_TourId",
                table: "TourLikes",
                column: "TourId");

            migrationBuilder.CreateIndex(
                name: "IX_TourLikes_UserId_TourId",
                table: "TourLikes",
                columns: new[] { "UserId", "TourId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tours_AgencyId",
                table: "Tours",
                column: "AgencyId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_Tours_TourId",
                table: "Bookings");

            migrationBuilder.DropTable(
                name: "TourDays");

            migrationBuilder.DropTable(
                name: "TourImages");

            migrationBuilder.DropTable(
                name: "TourItinerarySteps");

            migrationBuilder.DropTable(
                name: "TourLikes");

            migrationBuilder.DropTable(
                name: "Tours");

            migrationBuilder.DropColumn(
                name: "ViewCount",
                table: "Trips");

            migrationBuilder.RenameColumn(
                name: "MainImageUrl",
                table: "Trips",
                newName: "MapLink");

            migrationBuilder.RenameColumn(
                name: "TourId",
                table: "Bookings",
                newName: "TripId");

            migrationBuilder.RenameIndex(
                name: "IX_Bookings_TourId",
                table: "Bookings",
                newName: "IX_Bookings_TripId");

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Trips",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Duration",
                table: "Trips",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsAgencyTour",
                table: "Trips",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                table: "Trips",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateTable(
                name: "ItinerarySteps",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TripId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DayNumber = table.Column<int>(type: "integer", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    ImageUrl = table.Column<string>(type: "text", nullable: true),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    Time = table.Column<string>(type: "text", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItinerarySteps", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ItinerarySteps_Trips_TripId",
                        column: x => x.TripId,
                        principalTable: "Trips",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TripDays",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TripId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DayNumber = table.Column<int>(type: "integer", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    ImageUrl = table.Column<string>(type: "text", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TripDays", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TripDays_Trips_TripId",
                        column: x => x.TripId,
                        principalTable: "Trips",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ItinerarySteps_TripId",
                table: "ItinerarySteps",
                column: "TripId");

            migrationBuilder.CreateIndex(
                name: "IX_TripDays_TripId",
                table: "TripDays",
                column: "TripId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_Trips_TripId",
                table: "Bookings",
                column: "TripId",
                principalTable: "Trips",
                principalColumn: "Id");
        }
    }
}
