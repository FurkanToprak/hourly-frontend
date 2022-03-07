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

const appRatioStyle: React.CSSProperties = {
  backgroundColor: 'blue', flex: 1, display: 'flex', flexDirection: 'column',
};
const appContentStyle: React.CSSProperties = { flex: 9, display: 'flex', flexDirection: 'column' };

export default function App() {
  return (
    <Router>
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
              </Routes>
            </div>
          </div>
        </ThemeBackground>
      </ThemeProvider>
    </Router>
  );
}
