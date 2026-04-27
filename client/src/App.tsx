import Books from "./pages/Books";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Books />} />
    </Routes>
  );
}

export default App;
