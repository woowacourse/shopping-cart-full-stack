import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router';
import './index.css';
import './styles/colors.css';
import './styles/typography.css';
import App from './App.tsx';

async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser.ts');
    return worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: { url: '/shopping-cart-full-stack/mockServiceWorker.js' },
    });
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
    </StrictMode>,
  );
});
