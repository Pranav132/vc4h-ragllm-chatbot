import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthScreen from './screens/AuthScreen';
import ChatScreen from './screens/ChatScreen';
import { useAuth } from './Providers/AuthContext';

function App() {
  const { currentUser } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={currentUser ? <Navigate replace to="/chat" /> : <AuthScreen />} />
        <Route path="/chat" element={!currentUser ? <Navigate replace to="/" /> : <ChatScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
