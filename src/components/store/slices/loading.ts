import {PayloadAction, createSlice} from '@reduxjs/toolkit';

const initialState = {
    isLoading: false,
    loadingIds: [] as string[],
};

export const loaderSlice = createSlice({
    name: 'state/loading',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<{id: string, isLoading: boolean}>) => {
            if (action.payload.isLoading) {
                return {
                    isLoading: true,
                    loadingIds: [...state.loadingIds, action.payload.id],
                }
            } else {
                const newLoadingIsd = state.loadingIds.filter(id => id !== action.payload.id);

                return {
                    isLoading: newLoadingIsd.length > 0,
                    loadingIds: newLoadingIsd,
                }
            }
        },
    },
});