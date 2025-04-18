'use client';

import { CSSProperties } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import SyntaxHighlighter from 'react-syntax-highlighter';

// project-imports
import { ThemeMode } from 'config';

// ==============================|| CODE HIGHLIGHTER ||============================== //

export default function SyntaxHighlight({ children, customStyle, ...others }: { children: string; customStyle?: CSSProperties }) {
  const theme = useTheme();

  return (
    <SyntaxHighlighter
      language="javascript"
      showLineNumbers
      style={{}}
      customStyle={{
        ...customStyle,
        padding: '16px',
        borderRadius: '4px',
        backgroundColor: theme.palette.mode === ThemeMode.DARK ? '#2a2a2a' : '#f5f5f5',
        color: theme.palette.mode === ThemeMode.DARK ? '#fff' : '#333'
      }}
      {...others}
    >
      {children}
    </SyntaxHighlighter>
  );
}
