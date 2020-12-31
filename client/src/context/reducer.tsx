import { State } from "./types";

export const reducer = (state: State, action: Record<string, any>): State => {
  switch (action.type) {
    case "UPDATE_GAME": {
      return {...state, ...action.payload};
    }
    default: {
      return state;
    }
  }
}