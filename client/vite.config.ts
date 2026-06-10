import react from '@vitejs/plugin-react';
import {defineConfig, loadEnv} from 'vite';

const LOCAL_API_BASE_URL = 'http://localhost:3000';
const PRODUCTION_API_BASE_URL = 'https://paradi-easter.up.railway.app';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      __API_BASE_URL__: JSON.stringify(getApiBaseUrl(mode, env)),
    },
    plugins: [react()],
    server: {
      host: '127.0.0.1',
      port: 5173,
    },
  };
});

function getApiBaseUrl(mode: string, env: Record<string, string>) {
  if (mode === 'production') return PRODUCTION_API_BASE_URL;

  return env.VITE_API_BASE_URL ?? LOCAL_API_BASE_URL;
}
