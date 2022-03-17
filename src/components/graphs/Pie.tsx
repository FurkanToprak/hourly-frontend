import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import {
  black, darkBackground, lightBackground, purple, raspberry, white,
} from '../../styles/Theme';
import { useTheme } from '../../contexts/Theme';

interface PieData {
id: string;
label: string;
value: number;
color: string;
}

export default function Pie(props: {
    data: PieData[];
}) {
  const { theme } = useTheme();
  const textColor = theme === 'light' ? black : white;
  return (
    <ResponsivePie
      innerRadius={0.5}
      data={props.data}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderWidth={3}
      borderColor={textColor}
      margin={{
        top: 10, right: 10, left: 10, bottom: 10,
      }}
      colors={[purple, raspberry, theme === 'light' ? lightBackground : darkBackground]}
      arcLinkLabelsTextColor={textColor}
      arcLinkLabelsColor={textColor}
      arcLabelsTextColor={textColor}
    />
  );
}
