import { EditorState } from "../state";

export enum Actions {
  EditorUpdate = "EDITOR_UPDATE",
  EditorDiscardAll = "EDITOR_DISCARD_ALL",
  EditorAdd = "EDITOR_ADD",
  EditorRemove = "EDITOR_REMOVE",
  EditorSetDescription = "EDITOR_SET_DESCRIPTION",
  SetErrorMessage = "SET_ERROR_MESSAGE"
}

export const editorUpdate = (
  id: string,
  state: EditorState | ((e: EditorState) => EditorState)
) => ({
  type: Actions.EditorUpdate,
  payload: { id, state }
});

export const editorDiscardAll = () => ({
  type: Actions.EditorDiscardAll
});

export const editorAdd = () => ({
  type: Actions.EditorAdd
});

export const editorRemove = (id: string) => ({
  type: Actions.EditorRemove,
  payload: id
});

export const editorSetDescription = (desc: string) => ({
  type: Actions.EditorSetDescription,
  payload: desc
});

export const setErrorMessage = (message: string | null) => ({
  type: Actions.SetErrorMessage,
  payload: message
});
