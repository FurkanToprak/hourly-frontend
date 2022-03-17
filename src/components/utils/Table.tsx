import React from 'react';
import {
  TableBody, TableContainer, Table as MuiTable, TableHead, TableRow, TableCell,
} from '@mui/material';
import { Body, Title } from './Texts';
import { useTheme } from '../../contexts/Theme';
import {
  darkBorder, lightBorder, thinDarkBorder, thinLightBorder,
} from '../../styles/Theme';

export default function Table(props: {
    keys: string[]
    columns: string[];
    items: any[];
    emptyMessage: string;
}) {
  const { theme } = useTheme();
  const thickThemeBorder = theme === 'light' ? lightBorder : darkBorder;
  const thinThemeBorder = theme === 'light' ? thinLightBorder : thinDarkBorder;
  return (
    <TableContainer>
      <MuiTable>
        <TableHead>
          <TableRow style={{ borderBottom: thickThemeBorder }}>
            {props.columns.map((column: string) => (
              <TableCell align="left" key={`head-col-${column}`}>
                <Title size="s">{column}</Title>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.items.map((item) => (
            <TableRow key={`row-${item.name}`}>
              {
                            props.keys.map((itemColumn) => {
                              const cell = item[itemColumn];
                              const cellText = (cell instanceof Date) ? `${cell.getMonth()}/${cell.getDay()}/${cell.getFullYear()}` : cell;
                              return (
                                <TableCell align="left" style={{ borderBottom: thinThemeBorder }} key={`row-${item.name}-col-${itemColumn}`}>
                                  <Body>
                                    {cellText}
                                  </Body>
                                </TableCell>
                              );
                            })
                        }
            </TableRow>
          ))}
          {props.items.length === 0 && (
          <TableRow style={{ display: 'flex', justifyContent: 'center' }}>
            <Body>{props.emptyMessage}</Body>
          </TableRow>
          )}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
}
