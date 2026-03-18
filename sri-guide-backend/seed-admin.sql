-- Sri-Guide Admin User Seeding Script
-- Default Password: Admin@123 (Please change after first login)

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM "Users" WHERE "Email" = 'admin@sriguide.lk') THEN
        INSERT INTO "Users" (
            "Id", 
            "FullName", 
            "Email", 
            "PasswordHash", 
            "Role", 
            "IsVerified", 
            "CreatedAt"
        )
        VALUES (
            gen_random_uuid(), 
            'System Administrator', 
            'admin@sriguide.lk', 
            '$2a$11$qjkBudDyagzsx3OCIaC.p.uB3WyVAgmoe.UwKqZDLmxrfAvm3zCEC', 
            6, -- Admin Role
            true, 
            NOW()
        );
    END IF;
END $$;
