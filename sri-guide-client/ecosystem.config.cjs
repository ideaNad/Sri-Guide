/**
 * PM2 ecosystem for SriGuide Next.js (production).
 * Adjust `cwd` to the folder that contains package.json on your server.
 */
module.exports = {
  apps: [
    {
      name: 'sri-guide-web',
      cwd: '/var/www/sriguide/client/sri-guide-client',
      script: 'npm',
      args: 'run start:production',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_restarts: 20,
      env: {
        NODE_ENV: 'production',
      },
    },
    // Optional: run the .NET API with PM2 instead of systemd (pick one).
    // {
    //   name: 'sriguide-api',
    //   cwd: '/var/www/sriguide/api',
    //   script: 'dotnet',
    //   args: 'SriGuide.API.dll',
    //   interpreter: 'none',
    //   env: {
    //     ASPNETCORE_ENVIRONMENT: 'Production',
    //     ASPNETCORE_URLS: 'http://127.0.0.1:5070',
    //   },
    // },
  ],
};
