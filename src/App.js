import { Routes, Route } from "react-router-dom";
import "./App.css";
import Welcome from "./layout/Welcome";
// import Game from "./layout/Game";
import GameDynamic from "./layout/GameDynamic";
import FinalResults from "./layout/FinalResults";


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/game" element={<GameDynamic />} />
        <Route path="/game-over" element={<FinalResults />} />
      </Routes>
      
    </div>
  );
}

export default App;
