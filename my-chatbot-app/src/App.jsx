import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthScreen from './screens/AuthScreen';
import ChatScreen from './screens/ChatScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthScreen />} />
        <Route path="/chat" element={<ChatScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
