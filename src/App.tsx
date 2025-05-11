import { Provider } from "react-redux";
import { store } from "./store";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainContainer from "./components/MainContainer";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <h1>智能代办清单</h1>
        <Routes>
          <Route path="/" element={<Navigate to="/all" replace />} />
          <Route path="/all" element={<MainContainer filter="all" />} />
          <Route path="/recent" element={<MainContainer filter="recent" />} />
          <Route path="/completed" element={<MainContainer filter="completed" />} />
          <Route path="/category/:categoryId" element={<MainContainer filter="all" />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
