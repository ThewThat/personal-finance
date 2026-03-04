import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Asset, Transaction, DcaConfig } from "./types";
import { initialState as initialDcaState } from "./constants";

const dcaSlice = createSlice({
  name: "dca",
  initialState: initialDcaState,
  reducers: {
    addAsset: (state, action: PayloadAction<Omit<Asset, "id">>) => {
      state.assets.push({
        ...action.payload,
        id: Date.now().toString(),
      });
    },
    updatePrice: (state, action: PayloadAction<{ id: string; price: number }>) => {
      const asset = state.assets.find((a) => a.id === action.payload.id);
      if (asset) {
        asset.currentPrice = action.payload.price;
      }
    },
    addTransaction: (
      state,
      action: PayloadAction<Omit<Transaction, "id">>
    ) => {
      state.transactions.push({
        ...action.payload,
        id: "t" + Date.now(),
      });
    },
    updateDcaConfig: (state, action: PayloadAction<Partial<DcaConfig>>) => {
      state.dcaConfig = {
        ...state.dcaConfig,
        ...action.payload,
      };
    },
    updateTargetAllocation: (
      state,
      action: PayloadAction<{ id: string; value: number }>
    ) => {
      const asset = state.assets.find((a) => a.id === action.payload.id);
      if (asset) {
        asset.targetAllocation = action.payload.value;
      }
    },
    deleteAsset: (state, action: PayloadAction<string>) => {
      state.assets = state.assets.filter((a) => a.id !== action.payload);
    },
    updateAsset: (
      state,
      action: PayloadAction<{ id: string; payload: Partial<Asset> }>
    ) => {
      const asset = state.assets.find((a) => a.id === action.payload.id);
      if (asset) {
        Object.assign(asset, action.payload.payload);
      }
    },
  },
});

export const {
  addAsset,
  updatePrice,
  addTransaction,
  updateDcaConfig,
  updateTargetAllocation,
  deleteAsset,
  updateAsset,
} = dcaSlice.actions;

export default dcaSlice.reducer;
