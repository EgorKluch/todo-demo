import {combineReducers} from 'redux';

import { loaderSlice } from './slices/loading';
import { configureStore } from '@reduxjs/toolkit';
import { modalSlice } from './slices/modal';

export const rootReducer = combineReducers({loader: loaderSlice.reducer, modal: modalSlice.reducer});

export const store = configureStore({reducer: rootReducer})

export type RootState = ReturnType<typeof store.getState>