import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthScreen from './screens/AuthScreen';
import ChatScreen from './screens/ChatScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import { useAuth } from './Providers/AuthContext';
import { useEffect } from 'react';
import { Spinner, Flex } from '@chakra-ui/react';


function App() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <Flex width="100vw" height="100vh" justifyContent={"center"} alignItems={"center"}><Spinner/></Flex>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={currentUser ? <Navigate replace to="/welcome" /> : <AuthScreen />} />
        <Route path="/chats/:id" element={!currentUser ? <Navigate replace to="/" /> : <ChatScreen />} />
        <Route path="/welcome" element={!currentUser ? <Navigate replace to="/" /> : <WelcomeScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
