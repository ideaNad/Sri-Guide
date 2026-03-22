using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SriGuide.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class FixVerificationStatusEnum : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Old enum: Pending=0, Approved=1, Rejected=2
            // New enum: None=0, Pending=1, Approved=2, Rejected=3
            // 
            // We need to:
            // 1. Shift Rejected: 2 -> 3
            // 2. Shift Approved: 1 -> 2
            // 3. Shift old Pending (0) -> 1 (real Pending, i.e. those who actually submitted a request)
            //    BUT we can't know which old 0s are "really pending" vs "never set" since the old default was also 0.
            //    So we leave old 0s as 0 which now means None. Only those with a RegistrationNumber filled in = truly pending.

            // Fix Rejected records first (2 -> 3) to avoid collision
            migrationBuilder.Sql(@"
                UPDATE ""GuideProfiles"" SET ""VerificationStatus"" = 3 WHERE ""VerificationStatus"" = 2;
            ");

            migrationBuilder.Sql(@"
                UPDATE ""AgencyProfiles"" SET ""VerificationStatus"" = 3 WHERE ""VerificationStatus"" = 2;
            ");

            // Fix Approved records (1 -> 2)
            migrationBuilder.Sql(@"
                UPDATE ""GuideProfiles"" SET ""VerificationStatus"" = 2 WHERE ""VerificationStatus"" = 1;
            ");

            migrationBuilder.Sql(@"
                UPDATE ""AgencyProfiles"" SET ""VerificationStatus"" = 2 WHERE ""VerificationStatus"" = 1;
            ");

            // Fix old Pending records that have a RegistrationNumber -> set to new Pending (1)
            // Records with VerificationStatus=0 AND a RegistrationNumber were genuinely pending
            migrationBuilder.Sql(@"
                UPDATE ""GuideProfiles"" SET ""VerificationStatus"" = 1 WHERE ""VerificationStatus"" = 0 AND ""RegistrationNumber"" IS NOT NULL AND ""RegistrationNumber"" != '';
            ");

            // Records with VerificationStatus=0 and NO RegistrationNumber = never submitted, keep as 0 (None)
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Reverse: None (0) stays 0, Pending 1->0, Approved 2->1, Rejected 3->2
            migrationBuilder.Sql(@"
                UPDATE ""GuideProfiles"" SET ""VerificationStatus"" = 0 WHERE ""VerificationStatus"" = 1;
            ");
            migrationBuilder.Sql(@"
                UPDATE ""AgencyProfiles"" SET ""VerificationStatus"" = 0 WHERE ""VerificationStatus"" = 1;
            ");
            migrationBuilder.Sql(@"
                UPDATE ""GuideProfiles"" SET ""VerificationStatus"" = 1 WHERE ""VerificationStatus"" = 2;
            ");
            migrationBuilder.Sql(@"
                UPDATE ""AgencyProfiles"" SET ""VerificationStatus"" = 1 WHERE ""VerificationStatus"" = 2;
            ");
            migrationBuilder.Sql(@"
                UPDATE ""GuideProfiles"" SET ""VerificationStatus"" = 2 WHERE ""VerificationStatus"" = 3;
            ");
            migrationBuilder.Sql(@"
                UPDATE ""AgencyProfiles"" SET ""VerificationStatus"" = 2 WHERE ""VerificationStatus"" = 3;
            ");
        }
    }
}
