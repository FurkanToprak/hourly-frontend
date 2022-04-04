import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import {
  black,
  darkBackground,
  lightBackground, white,
} from '../../styles/Theme';
import { Title } from '../utils/Texts';
import { useTheme } from '../../contexts/Theme';

function generateStats(values: number[], numBins: number) {
  let max = values[0];
  let min = values[0];
  values.forEach((value) => {
    if (value > max) {
      max = value;
    }
    if (value < min) {
      min = value;
    }
  });
  const bins = Array(numBins).fill(0);
  const range = max - min;
  const binRange = range / numBins;
  values.forEach((value) => {
    const distance = Math.min(numBins - 1, Math.floor((value - min) / binRange));
    bins[distance] += 1;
  });
  const hist = bins.map((freq, index) => ({
    x: Math.round((min + index * binRange) * 100) / 100,
    y: Math.round((100 * (freq / values.length)) * 100) / 100,
  }));
  return hist;
}
const noToolTip = () => <div />;

export default function Histogram(props: {
    title: string;
    data: number[];
    color: string;
}) {
  const { theme } = useTheme();
  const themeColor = theme === 'light' ? black : white;
  const borderColor = theme === 'light' ? darkBackground : lightBackground;
  const numBins = 6;
  const bins = generateStats(props.data, numBins);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Title size="s">{`Distribution of ${props.title}`}</Title>
      <div style={{ position: 'relative', flex: 1 }}>
        <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
          <ResponsiveBar
            colors={props.color}
            data={bins}
            indexBy="x"
            borderColor={borderColor}
            keys={['y']}
            margin={{
              top: 50,
              left: 30,
              bottom: 30,
            }}
            theme={{
              textColor: themeColor,
            }}
            borderRadius={4}
            borderWidth={3}
            tooltip={noToolTip}
            animate
            isInteractive
          />
        </div>
      </div>
    </div>
  );
}
