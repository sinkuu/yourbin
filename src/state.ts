export interface State {
  readonly editors: Editors;
  readonly errorMessage: string | null;
}

export interface Editors {
  readonly next_id: number;
  readonly states: { [n: string]: EditorState };
  readonly description: string;
}

export interface EditorState {
  readonly filename: string;
  readonly type: string;
  readonly modified: boolean;
  readonly content: string;
  readonly indent: IndentConfig;
}

export interface Space {
  mode: "space";
  size: number;
}

export interface Tab {
  mode: "tab";
  size: number;
}

export type IndentConfig = Space | Tab;
