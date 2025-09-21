import HomePage from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import ParticlesComponent from './particles/ParticlesComponent';
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
  return (
    <div className="app">
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;