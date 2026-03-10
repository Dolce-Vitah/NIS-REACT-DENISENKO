declare module '@monaco-editor/react' {
  import * as React from 'react';

  export type MonacoEditorOnMount = (editor: unknown, monaco: unknown) => void;
  export type MonacoEditorOnChange = (value: string | undefined, event: unknown) => void;

  export type MonacoEditorProps = {
    value?: string;
    defaultValue?: string;
    language?: string;
    theme?: string;
    height?: string | number;
    width?: string | number;
    loading?: React.ReactNode;
    options?: Record<string, unknown>;
    onMount?: MonacoEditorOnMount;
    onChange?: MonacoEditorOnChange;
    [key: string]: unknown;
  };

  const Editor: React.ComponentType<MonacoEditorProps>;
  export default Editor;
}
