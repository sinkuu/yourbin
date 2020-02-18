import { State, Editors } from "../state";
import { Actions } from "../action";
import { produce, Draft } from "immer";
import { combineReducers } from "redux";

export const initialState: State = {
  editors: {
    next_id: 1,
    states: {
      "0": {
        filename: "",
        type: "",
        modified: false,
        content: "",
        indent: { mode: "space", size: 4 }
      }
    }
  }
};

export default combineReducers({
  editors: (state: any = initialState.editors, action: any) =>
    produce(state, (draft: Draft<Editors>) => {
      switch (action.type) {
        case Actions.EditorUpdate: {
          const { id, state } = action.payload;
          if (typeof state === "function") {
            draft.states[id] = state(draft.states[id]);
          } else {
            draft.states[id] = state;
          }
          break;
        }

        case Actions.EditorDiscardAll: {
          Object.assign(draft, initialState.editors);
          break;
        }

        case Actions.EditorAdd: {
          draft.states[draft.next_id.toString()] = initialState.editors.states[0];
          draft.next_id++;
          break;
        }

        case Actions.EditorRemove: {
          const id = action.payload;
          delete draft.states[id];
          break;
        }

        default:
      }
    })
});
