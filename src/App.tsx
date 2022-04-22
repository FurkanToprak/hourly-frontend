import './styles/App.css';
import './styles/Fonts.css';
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';
import { ThemeProvider } from './contexts/Theme';
import { ThemeBackground } from './styles/Theme';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import LogIn from './pages/LogIn';
import MenuBar from './components/utils/MenuBar';
import { AuthProvider } from './contexts/Auth';
import NotFound from './pages/NotFound';
import Group from './pages/Group';
import Groups from './pages/Groups';
import Dashboard from './pages/Dashboard';
import { AuthBannedRoute, AuthOnlyRoute } from './components/auth/AuthRoute';

const appRatioStyle: React.CSSProperties = { flex: 1, display: 'flex', flexDirection: 'column' };
const appContentStyle: React.CSSProperties = { flex: 9, display: 'flex', flexDirection: 'column' };

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <ThemeBackground>
            <div
              style={appRatioStyle}
            >
              <MenuBar />
              <div style={appContentStyle}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route
                    path="/signup"
                    element={
                      <AuthBannedRoute to="/"><SignUp /></AuthBannedRoute>
                    }
                  />
                  <Route path="/login" element={<AuthBannedRoute><LogIn /></AuthBannedRoute>} />
                  <Route path="/groups" element={<AuthOnlyRoute><Groups /></AuthOnlyRoute>} />
                  <Route path="/group/:groupid" element={<AuthOnlyRoute><Group /></AuthOnlyRoute>} />
                  <Route path="/dashboard" element={<AuthOnlyRoute><Dashboard /></AuthOnlyRoute>} />
                  <Route path="*" element={<AuthOnlyRoute><NotFound /></AuthOnlyRoute>} />
                </Routes>
              </div>
            </div>
          </ThemeBackground>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}
