// store.ts
import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Correct import for localStorage
import rootReducer from './reducers/reducers';

// Configuration object for redux-persist
const persistConfig = {
  key: 'root',
  storage,
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store with the persisted reducer
const store = createStore(persistedReducer);

// Create a persistor
const persistor = persistStore(store);

export { store, persistor };
