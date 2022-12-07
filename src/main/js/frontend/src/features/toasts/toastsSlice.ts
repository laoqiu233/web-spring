import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface Toast {
    id: number,
    message: string
    type: 'info' | 'success' | 'warning'
};

interface ToastsState {
    nextId:number,
    toasts:Toast[]
}

const initialState: ToastsState = {
    nextId: 1,
    toasts: []
};

export const toastsSlice = createSlice({
    name: 'toasts',
    initialState,
    reducers: {
        toastAdded: (state, action:PayloadAction<Toast>) => {
            state.toasts.push({...action.payload, id: state.nextId});
            state.nextId++;
        },
        toastRemoved: (state, action:PayloadAction<number>) => {
            state.toasts = state.toasts.filter((v) => v.id !== action.payload);
        }
    }
});

export const { toastAdded, toastRemoved } = toastsSlice.actions;