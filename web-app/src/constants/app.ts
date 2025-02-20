export const APP = {
  DISCORD_INVITE_URL: 'https://discord.gg/QwnGvHk2kz',
  DONATE_URL: 'https://buymeacoffee.com/crowstertkc',
  GITHUB_URL: 'https://github.com/CrowsterTKC/firebutt',
  NAME: 'Firebutt',
};

export const WEB = {
  API_BASE_ROUTE: '/api',
  BASE_ROUTE:
    process.env.NODE_ENV === 'development' ? '/' : '/integrations/firebutt',
  MANAGEMENT_ROUTE: '/management',
};
