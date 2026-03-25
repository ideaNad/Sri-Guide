using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SriGuide.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class FixOrganizerRoles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE \"Users\" SET \"Role\" = 7 WHERE \"Role\" = 6 AND EXISTS (SELECT 1 FROM \"EventOrganizerProfiles\" WHERE \"UserId\" = \"Users\".\"Id\");");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE \"Users\" SET \"Role\" = 6 WHERE \"Role\" = 7 AND EXISTS (SELECT 1 FROM \"EventOrganizerProfiles\" WHERE \"UserId\" = \"Users\".\"Id\");");
        }
    }
}
