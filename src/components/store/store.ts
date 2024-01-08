import {combineReducers} from 'redux';

import { loaderSlice } from './slices/loading';
import { configureStore } from '@reduxjs/toolkit';

export const rootReducer = combineReducers({loader: loaderSlice.reducer});

export const store = configureStore({reducer: rootReducer})

export type RootState = ReturnType<typeof store.getState>