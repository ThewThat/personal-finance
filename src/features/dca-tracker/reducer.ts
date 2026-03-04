import type { AppState, AppAction } from "./types";

export function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "ADD_ASSET":
      return {
        ...state,
        assets: [...state.assets, { ...action.payload, id: Date.now().toString() }],
      };
    case "UPDATE_PRICE":
      return {
        ...state,
        assets: state.assets.map((a) =>
          a.id === action.id ? { ...a, currentPrice: action.price } : a
        ),
      };
    case "ADD_TX":
      return {
        ...state,
        transactions: [
          ...state.transactions,
          { ...action.payload, id: "t" + Date.now() },
        ],
      };
    case "UPDATE_DCA":
      return {
        ...state,
        dcaConfig: { ...state.dcaConfig, ...action.payload },
      };
    case "UPDATE_TARGET":
      return {
        ...state,
        assets: state.assets.map((a) =>
          a.id === action.id ? { ...a, targetAllocation: action.value } : a
        ),
      };
    case "DELETE_ASSET":
      return {
        ...state,
        assets: state.assets.filter((a) => a.id !== action.id),
      };
    default:
      return state;
  }
}
