import React from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import MyApp from "./MyApp";

const App = () => {
  return (
    <Provider store={store}>
      <MyApp />
    </Provider>
  );
};

export default App;
