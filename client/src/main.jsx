import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import './index.css';

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#090a0f',
          color: '#ffffff',
          fontFamily: 'system-ui, sans-serif',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '480px',
            backgroundColor: '#12141d',
            padding: '32px',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}>
            <h1 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px' }}>
              Aevion Wallpapers
            </h1>
            <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px' }}>
              We ran into a display issue loading the page cache.
            </p>
            <div style={{
              fontSize: '12px',
              color: '#f43f5e',
              background: 'rgba(244,63,94,0.1)',
              padding: '12px',
              borderRadius: '12px',
              marginBottom: '20px',
              wordBreak: 'break-word',
              fontFamily: 'monospace'
            }}>
              {this.state.error?.message || 'Unknown runtime error'}
            </div>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }}
              style={{
                width: '100%',
                padding: '12px 24px',
                borderRadius: '14px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Reset Cache & Refresh
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <FavoritesProvider>
            <App />
          </FavoritesProvider>
        </ThemeProvider>
      </BrowserRouter>
    </GlobalErrorBoundary>
  </React.StrictMode>
);
