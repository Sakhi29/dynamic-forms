import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Form from "./components/Form";
import DataSync from "./components/DataSync";

function App() {
  return (
    <Router>
      <div className="app-container">
        <h1>Dynamic Forms Application</h1>
        <div className="buttons">
          <Link to="/form-a">
            <button>Form A</button>
          </Link>
          <Link to="/form-b">
            <button>Form B</button>
          </Link>
        </div>
        <Routes>
          <Route path="/form-a" element={<Form formType="A" />} />
          <Route path="/form-b" element={<Form formType="B" />} />
          <Route path="/data-sync" element={<DataSync />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
