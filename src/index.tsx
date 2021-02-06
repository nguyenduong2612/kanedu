import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { createStore } from "redux";
import { Provider } from "react-redux";

import rootReducer from "./redux/reducers/rootReducer";
import { isPlatform, setupConfig } from "@ionic/react";
import { pageAnimation } from "./utils/pageAnimation";

const store = createStore(rootReducer);

if (!isPlatform("desktop")) {
  setupConfig({
    navAnimation: pageAnimation,
  });
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
