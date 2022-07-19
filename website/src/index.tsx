import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { ColorModeContextProvider } from "./colorModeContext";
import "./index.css";
import { store } from "./state";

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <StrictMode>
    <Provider store={store}>
      <ColorModeContextProvider>
        <App />
      </ColorModeContextProvider>
    </Provider>
  </StrictMode>
);
