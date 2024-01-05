// Import the ReactDOM library from the "react-dom/client" module.
// This library allows you to render React components to the DOM.
import ReactDOM from "react-dom/client";

// Import the main App component from the "App" module.
// This is the root component of your React application.
import App from "./App";

// Import the Provider component from the "react-redux" module.
// This component makes the Redux store available to all components in the app.
import { Provider } from "react-redux";

// Import the Redux store from the "store" module.
// This is the store that you've created using Redux.
import store from "./store";

// Call the createRoot method on ReactDOM with the root DOM node as the argument.
// This method creates a root for your React application.
// Then, call the render method on the root with your root React component as the argument.
// This renders your React application to the DOM.
// The root React component is the Provider component, which wraps the App component and passes the Redux store as a prop.
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);