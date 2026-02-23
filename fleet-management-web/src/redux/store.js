import { createLogger } from "redux-logger";
import reducers from "./reducers";
import { configureStore } from "@reduxjs/toolkit";

const logger = createLogger();

export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger),
});
