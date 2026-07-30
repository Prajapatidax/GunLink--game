export const getBackendServerUrl = (): string => {
  const envUrl = import.meta.env.VITE_SERVER_URL;
  if (envUrl && envUrl.trim() !== '') {
    return envUrl.replace(/\/$/, '');
  }
  // Production fallback backend URL on Render
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return 'https://gunlink-backend.onrender.com';
  }
  return 'http://localhost:3001';
};

export const SERVER_URL = getBackendServerUrl();
