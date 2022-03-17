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
    columns: string[];
    items: any[];
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
                            Object.entries(item).map((itemColumn) => (
                              <TableCell align="left" style={{ borderBottom: thinThemeBorder }} key={`row-${item.name}-col-${itemColumn}`}>
                                <Body>
                                  {(typeof itemColumn[1]) === 'string'
                                    ? itemColumn[1] : (itemColumn[1] as any).toString()}
                                </Body>
                              </TableCell>
                            ))
                        }
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
}
