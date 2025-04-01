export const APP = {
  DISCORD_INVITE_URL: 'https://discord.gg/QwnGvHk2kz',
  DONATE_URL: 'https://buymeacoffee.com/crowstertkc',
  GITHUB_URL: 'https://github.com/CrowsterTKC/firebutt',
  NAME: 'Firebutt',
};

export const WEB = {
  API_ROUTE: '/integrations/firebutt/management/api',
  BASE_ORIGIN:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:7472'
      : window.location.origin,
  BASE_ROUTE:
    process.env.NODE_ENV === 'development'
      ? '/'
      : '/integrations/firebutt/management',
};
