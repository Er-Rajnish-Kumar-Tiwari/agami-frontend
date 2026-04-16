import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "./Components/Game.jsx";
import History from "./Components/History.jsx";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/history" element={<History />} />
      </Routes>
  );
}

export default App;