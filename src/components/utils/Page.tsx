import React from 'react';

export default function Page(props: {
    fullHeight?: true;
    centerX?: true;
    centerY?: true;
    children: any;
}) {
  return (
    <div style={{
      flex: props.fullHeight ? 1 : undefined,
      display: 'flex',
      flexDirection: 'column',
      alignItems: props.centerY ? 'center' : undefined,
      justifyContent: props.centerX ? 'center' : undefined,
    }}
    >
      {props.children}
    </div>
  );
}
