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
import Tasks from './pages/Tasks';
import Dashboard from './pages/Dashboard';

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
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/login" element={<LogIn />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </div>
          </ThemeBackground>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}
