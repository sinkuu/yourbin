import { State, Editors, IpfsState } from "../state";
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
  },
  ipfs: {
    ipfs: null
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
          draft.states = {};
          draft.states[draft.next_id.toString()] =
            initialState.editors.states[0];
          draft.next_id++;
          break;
        }

        case Actions.EditorAdd: {
          draft.states[draft.next_id.toString()] =
            initialState.editors.states[0];
          draft.next_id++;
          break;
        }

        case Actions.EditorRemove: {
          const id = action.payload;
          delete draft.states[id];
          break;
        }
      }
    }),
  ipfs: (state: any = initialState.editors, action: any) =>
    produce(state, (draft: Draft<IpfsState>) => {
      switch (action.type) {
        case Actions.IpfsSetInstance: {
          draft.ipfs = action.payload;
          break;
        }
      }
    })
});
