import './styles/App.css';
import './styles/Fonts.css';
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';
import { ThemeProvider } from './contexts/Theme';
import { ThemeBackground } from './styles/Themes';

export default function App() {
  return (
    <Router>
    <ThemeProvider>
        <ThemeBackground>
          <div
            style={appRatioStyle}>
            {/* <MenuBar/> */}
            <div style={appContentStyle}>
              <Routes>
                <Route path="/" element={<div>welcome home!</div>}/>
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