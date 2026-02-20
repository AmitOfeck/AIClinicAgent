import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ChatProvider } from './context/ChatContext';
import LandingPage from './pages/LandingPage';

const App = () => {
  return (
    <ChatProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          {/* Redirect old routes to landing page */}
          <Route path="/services" element={<Navigate to="/" replace />} />
          <Route path="/about" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ChatProvider>
  );
};

export default App;
