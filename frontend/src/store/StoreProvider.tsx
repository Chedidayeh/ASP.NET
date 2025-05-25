"use client";

import { Provider } from "react-redux"
import { store, persistor } from './store'; // Adjust the path to your store file
import { PersistGate } from 'redux-persist/integration/react';



export const StoreProvider = ({ children }: { children: React.ReactNode }) => {

    return <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    {children}
    </PersistGate>

    </Provider>;

};