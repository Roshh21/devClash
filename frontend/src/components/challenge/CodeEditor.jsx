import Editor from '@monaco-editor/react';
import Skeleton from '../ui/Skeleton';
import { useThemeStore } from '../../store/themeStore';

function defineDevClashThemes(monaco) {
  monaco.editor.defineTheme('devclash-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#221a13',
      'editor.lineHighlightBackground': '#2a2118',
      'editorLineNumber.foreground': '#87796b',
      'editorCursor.foreground': '#e2985c',
      'editorGutter.background': '#221a13',
    },
  });
  monaco.editor.defineTheme('devclash-light', {
    base: 'vs',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#fffaf3',
      'editor.lineHighlightBackground': '#f6efe4',
      'editorLineNumber.foreground': '#9c8c7a',
      'editorCursor.foreground': '#a2602f',
      'editorGutter.background': '#fffaf3',
    },
  });
}

// Syntax highlighting only — the roadmap explicitly calls for Monaco
// here, but Run/Submit never touch its contents for real execution.
// The parent page's mock Run/Submit handlers operate independently.
export default function CodeEditor({ value, onChange, language = 'javascript' }) {
  const theme = useThemeStore((s) => s.theme);

  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      onChange={onChange}
      theme={theme === 'dark' ? 'devclash-dark' : 'devclash-light'}
      beforeMount={defineDevClashThemes}
      loading={<Skeleton className="h-full w-full rounded-none" />}
      options={{
        minimap: { enabled: false },
        fontSize: 13,
        fontFamily: "'JetBrains Mono', monospace",
        scrollBeyondLastLine: false,
        padding: { top: 16 },
        automaticLayout: true,
      }}
    />
  );
}
