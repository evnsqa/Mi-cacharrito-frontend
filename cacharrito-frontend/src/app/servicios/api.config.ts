const isLocalDevelopment =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1');

export const API_BASE_URL = isLocalDevelopment
  ? 'http://localhost:8080'
  : 'https://cacharrito-backend.onrender.com';
