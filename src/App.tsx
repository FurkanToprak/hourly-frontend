import './styles/App.css';
import './styles/Fonts.css';
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';
import { ThemeProvider } from './contexts/Theme';
import { ThemeBackground } from './styles/Theme';
import Home from './pages/Home';
import MenuBar from './components/utils/MenuBar';

export default function App() {
  return (
    <Router>
    <ThemeProvider>
        <ThemeBackground>
          <div
            style={appRatioStyle}>
            <MenuBar/>
            <div style={appContentStyle}>
              <Routes>
                <Route path="/" element={<Home/>}/>
              </Routes>
            </div>
          </div>
        </ThemeBackground>
    </ThemeProvider>
  </Router>
  );
}

const appRatioStyle: React.CSSProperties = {display: 'flex', flexDirection: 'column'};
const appContentStyle: React.CSSProperties = {flex: 9};