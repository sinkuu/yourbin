export interface State {
  readonly editors: Editors;
  readonly ipfs: IpfsState;
}

export interface IpfsState {
  ipfs: any;
}

export interface Editors {
  readonly next_id: number;
  readonly states: { [n: string]: EditorState };
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
