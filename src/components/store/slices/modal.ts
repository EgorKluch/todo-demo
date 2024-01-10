import {PayloadAction, createSlice} from '@reduxjs/toolkit';

const initialState = {} as {[key in string]: boolean};

export const modalSlice = createSlice({
    name: 'state/modal',
    initialState,
    reducers: {
        setOpen: (state, action: PayloadAction<{id: string}>) => {
            return {...state, ...{[action.payload.id]: true}};
        },
        setClose: (state, action: PayloadAction<{id: string}>) => {
            const newState = {...state};
            delete newState[action.payload.id];
            return newState;
        },
    },
});