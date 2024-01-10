import { createEvent, createStore } from 'effector';
import { useUnit } from 'effector-react';

export const showLoader = createEvent();
export const hideLoader = createEvent();

const $loader = createStore(false)
    .on(showLoader, () => true)
    .on(hideLoader, () => false);

export const useLoader = () => {
    return useUnit($loader);
};
