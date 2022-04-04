import React, { useState } from 'react';
import {
  TableBody, TableContainer, Table as MuiTable, TableHead, TableRow, TableCell,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DeleteOutlined } from '@mui/icons-material';
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
    onDelete?: (deletedItem: any) => void;
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
            <TableCell />
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
                              const isDateType = itemColumn.includes('date') || itemColumn.includes('time');
                              const cellDate = isDateType ? new Date(cell) : null;
                              const cellText = cellDate !== null ? `${cellDate.getMonth()}/${cellDate.getDay()}/${cellDate.getFullYear()}` : cell;
                              return (
                                <TableCell
                                  align="left"
                                  style={{ borderBottom: thinThemeBorder }}
                                  key={`row-${item.name}-col-${itemColumn}`}
                                >
                                  <Body>
                                    {cellText}
                                  </Body>
                                </TableCell>
                              );
                            })
                        }
              <TableCell>
                { props.onDelete && hoverRow === rowNumber ? (
                  <DeleteOutlined
                    htmlColor={themeColor}
                    onMouseDown={() => {
                      if (!props.onDelete) {
                        return;
                      }
                      const deletedItem = props.items[hoverRow];
                      props.onDelete(deletedItem);
                    }}
                  />
                ) : (
                  <DeleteOutlined
                    style={{ visibility: 'hidden' }}
                  />
                )}
              </TableCell>
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
