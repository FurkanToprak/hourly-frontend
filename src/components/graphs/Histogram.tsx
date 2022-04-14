import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import {
  black,
  darkBackground,
  lightBackground, white,
} from '../../styles/Theme';
import { Body, Title } from '../utils/Texts';
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
  const dataSum = props.data.length === 0 ? 0 : props.data.reduce((sum, newNum) => sum + newNum);
  const dataAvg = dataSum / props.data.length;
  let dataUnique = true;
  props.data.forEach((datum) => {
    if (dataAvg !== datum) {
      dataUnique = false;
    }
  });
  if (dataUnique || props.data.length < 2) {
    return <Body>{`Not Enough Data To Display The ${props.title}`}</Body>;
  }
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
              top: 20,
              left: 50,
              bottom: 50,
            }}
            theme={{
              textColor: themeColor,
            }}
            borderRadius={4}
            borderWidth={3}
            tooltip={noToolTip}
            animate
            isInteractive
            axisLeft={{
              legend: 'Percentage (%)',
              legendOffset: -40,
            }}
            axisBottom={{
              legend: 'Hours',
              legendOffset: 30,
            }}
          />
        </div>
      </div>
    </div>
  );
}
