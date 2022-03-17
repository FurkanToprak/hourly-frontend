import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { purple, white } from '../../styles/Theme';
import { Title } from '../utils/Texts';

export default function Histogram(props: {
    title: string;
    data: number[];
}) {
  const sortedData = props.data;
  sortedData.sort();
  const population = sortedData.length;
  const data: {x: number, y: number}[] = [];
  const currentPercentile = sortedData[0];
  let percentile = 0;
  sortedData.forEach((datum: number, index: number) => {
    if (datum > currentPercentile) {
      percentile = Math.round(100 * (index / population));
      data.push({
        x: datum,
        y: percentile,
      });
    }
  });
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Title size="s">{`Distribution of ${props.title}`}</Title>
      <div style={{ position: 'relative', flex: 1 }}>
        <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
          <ResponsiveBar
            colors={purple}
            labelTextColor={white}
            data={data}
            indexBy="x"
            borderColor="red"
            keys={['y']}
            margin={{
              top: 50,
              left: 50,
              bottom: 30,
            }}
          />
        </div>
      </div>
    </div>
  );
}
