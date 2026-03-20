using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SriGuide.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddTourPlannerAndAgencyTrips : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "AgencyId",
                table: "Trips",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Category",
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
                    Time = table.Column<string>(type: "text", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    ImageUrl = table.Column<string>(type: "text", nullable: true),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
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

            migrationBuilder.CreateIndex(
                name: "IX_Trips_AgencyId",
                table: "Trips",
                column: "AgencyId");

            migrationBuilder.CreateIndex(
                name: "IX_ItinerarySteps_TripId",
                table: "ItinerarySteps",
                column: "TripId");

            migrationBuilder.AddForeignKey(
                name: "FK_Trips_AgencyProfiles_AgencyId",
                table: "Trips",
                column: "AgencyId",
                principalTable: "AgencyProfiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Trips_AgencyProfiles_AgencyId",
                table: "Trips");

            migrationBuilder.DropTable(
                name: "ItinerarySteps");

            migrationBuilder.DropIndex(
                name: "IX_Trips_AgencyId",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "AgencyId",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "Category",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "IsAgencyTour",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "Price",
                table: "Trips");
        }
    }
}
