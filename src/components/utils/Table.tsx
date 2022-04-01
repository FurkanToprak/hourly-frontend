import React, { useState } from 'react';
import {
  TableBody, TableContainer, Table as MuiTable, TableHead, TableRow, TableCell,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Body, Title } from './Texts';
import { useTheme } from '../../contexts/Theme';
import {
  black,
  darkBorder, lightBorder, purple, thinDarkBorder, thinLightBorder, white,
} from '../../styles/Theme';

export default function Table(props: {
    keys: string[]
    columns: string[];
    items: any[];
    emptyMessage: string;
    urlPrefix?: string;
}) {
  const [hoverRow, setHoverRow] = useState(-1);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const thickThemeBorder = theme === 'light' ? lightBorder : darkBorder;
  const thinThemeBorder = theme === 'light' ? thinLightBorder : thinDarkBorder;
  const themeColor = theme === 'light' ? black : white;
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
          {props.items.map((item, rowNumber: number) => (
            <TableRow
              onMouseOver={() => {
                setHoverRow(rowNumber);
              }}
              onMouseLeave={() => {
                setHoverRow(-1);
              }}
              key={`row-${item.id || ''}`}
              onMouseDown={() => {
                if (!props.urlPrefix) {
                  return;
                }
                navigate(`/${props.urlPrefix}/${item.id}`);
              }}
              style={{ cursor: 'pointer', backgroundColor: hoverRow === rowNumber ? purple : undefined }}
            >
              {
                            props.keys.map((itemColumn) => {
                              const cell = item[itemColumn];
                              const isBoolean: boolean = itemColumn === 'completed';
                              const booleanValue = isBoolean ? undefined : (cell === 1);
                              const isDateType = itemColumn.includes('date') || itemColumn.includes('time');
                              if (itemColumn === 'due_date') {
                                console.log(cell);
                              }
                              const cellDate = isDateType ? new Date(cell) : null;
                              const cellText = cellDate !== null ? `${cellDate.getMonth()}/${cellDate.getDay()}/${cellDate.getFullYear()}` : cell;
                              const booleanIndicator = booleanValue
                                ? <CheckBoxIcon htmlColor={themeColor} />
                                : <CheckBoxOutlineBlankIcon htmlColor={themeColor} />;
                              return (
                                <TableCell align="left" style={{ borderBottom: thinThemeBorder }} key={`row-${item.name}-col-${itemColumn}`}>
                                  {isBoolean ? booleanIndicator : (
                                    <Body>
                                      {cellText}
                                    </Body>
                                  )}
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
