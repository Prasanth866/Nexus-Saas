import { useState } from 'react';
import './AuthPage.css';
type AuthPageProps = {
  initialMode?: 'login' | 'signup';
  onAuthSuccess?: () => void;
};

export default function AuthPage({ initialMode = 'login', onAuthSuccess }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');

  return (
    <div className="auth-page">
      <div className="auth-frame">
        <div className="auth-shell">
          <div className="auth-brand">
            <div className="auth-brand-mark">
              N
              <span>7</span>
            </div>
            <div>
              <h1>exus</h1>
              <p>join together</p>
            </div>
          </div>

          <div className="auth-card">
            <div className="auth-toggle" role="tablist" aria-label="Authentication mode">
              <div className={`auth-toggle-pill ${isLogin ? 'is-login' : 'is-signup'}`}></div>
              <button type="button" onClick={() => setIsLogin(true)} className={isLogin ? 'active' : ''}>
                Login
              </button>
              <button type="button" onClick={() => setIsLogin(false)} className={!isLogin ? 'active' : ''}>
                Sign Up
              </button>
            </div>

            <form className="auth-form" onSubmit={(event) => event.preventDefault()}>
              <div className="field-group">
                <label>Email</label>
                <input type="email" placeholder="username@gmail.com" />
              </div>

              {!isLogin && (
                <div className="field-group">
                  <label>Name</label>
                  <div className="row-two">
                    <input type="text" placeholder="First name" />
                    <input type="text" placeholder="Last name" />
                  </div>
                </div>
              )}

              <div className="field-group">
                <label>{isLogin ? 'Password' : 'New password *'}</label>
                <div className="field-with-icon">
                  <input type="password" placeholder="Password" />
                  {!isLogin && <span className="end-icon">o</span>}
                </div>
              </div>

              {!isLogin && (
                <div className="field-group">
                  <label>Confirm password *</label>
                  <div className="field-with-icon">
                    <input type="password" placeholder="Password" />
                    <span className="end-icon">o</span>
                  </div>
                </div>
              )}

              {isLogin && (
                <div className="forgot-row">
                  <button type="button" className="forgot-btn">
                    Forgot Password?
                  </button>
                </div>
              )}

              <button type="button" className="primary-btn" onClick={onAuthSuccess}>
                {isLogin ? 'Sign in' : 'Sign Up'}
              </button>
            </form>

            <div className="social-wrap">
              <p>or continue with</p>
              <div className="social-buttons">
                <button type="button" aria-label="Continue with Google" className="social-btn" onClick={onAuthSuccess}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                </button>
                <button type="button" aria-label="Continue with GitHub" className="social-btn github" onClick={onAuthSuccess}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M12 2C6.48 2 2 6.58 2 12.26c0 4.54 2.87 8.39 6.84 9.75.5.09.68-.22.68-.49 0-.24-.01-1.03-.01-1.87-2.78.61-3.37-1.22-3.37-1.22-.46-1.2-1.12-1.52-1.12-1.52-.92-.64.07-.63.07-.63 1.02.07 1.56 1.07 1.56 1.07.9 1.58 2.34 1.12 2.91.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.31.1-2.72 0 0 .84-.27 2.75 1.05A9.26 9.26 0 0 1 12 6.85c.85 0 1.7.12 2.5.35 1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.64 1.03 2.76 0 3.93-2.35 4.8-4.58 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.1 10.1 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
                  </svg>
                </button>
                <button type="button" aria-label="Continue with Facebook" className="social-btn facebook" onClick={onAuthSuccess}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M13.5 22v-8.1h2.7l.4-3.1h-3.1V8.8c0-.9.2-1.5 1.6-1.5h1.7V4.6c-.3 0-1.3-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.6v1.8H7.2v3.1h2.6V22h3.7Z" />
                  </svg>
                </button>
              </div>

              {isLogin && (
                <p className="register-copy">
                  Don't have an account yet?{' '}
                  <button type="button" onClick={() => setIsLogin(false)}>
                    Register for free
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
