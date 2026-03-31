using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SriGuide.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddParticipantCountToTour : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ParticipantCount",
                table: "Tours",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ParticipantCount",
                table: "Tours");
        }
    }
}
