import { useState, useEffect } from 'react';
import {
  Box, Text, Flex, VStack, SkeletonText, Input, Button, useColorModeValue,
  Spinner
} from '@chakra-ui/react';
import { SidebarWithHeader } from '../components/Sidebar';
import { useAuth } from '../Providers/AuthContext';
import { getDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';

function ChatScreen() {
  const [chats, setChats] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState(null);

  useEffect(() => {
    const pathSegments = window.location.pathname.split('/');
    const idIndex = pathSegments.findIndex(segment => segment === 'chats') + 1;
    if (idIndex > 0 && pathSegments[idIndex]) {
      setChatId(pathSegments[idIndex]);
    } else {
      console.error("Failed to extract chat ID from URL");
    }
  }, []);
  
  // get chats
  // send chats

  const { currentUser } = useAuth();

  const loadChat = async () => {
    if (!chatId) {
      console.error("Chat ID is undefined");
      return;
    }
  
    setLoading(true);
  
    // Assuming each chat has its messages directly stored within a document
    const chatRef = doc(db, "chats", chatId);
    try {
      const chatSnap = await getDoc(chatRef);
      if (chatSnap.exists()) {
        const chatData = chatSnap.data();
        // Assuming 'data' is the field where messages are stored
        if (chatData.data) {
          setChats(chatData.data);
        } else {
          console.error("No messages found in the chat");
        }
      } else {
        console.log("No such chat found");
      }
    } catch (error) {
      console.error("Error fetching chat:", error);
    }
  
    setLoading(false);
  };
  
  
  useEffect(() => {
    if (chatId) {
      loadChat();
    }
  }, [chatId]);
  
  function cleanResponse(text) {
    // Remove instruction tags and content between them, and also remove <s> </s> tags
    const cleanedText = text.replace(/\[INST\].*?\[\/INST\]/gs, '').replace(/<\/?s>/g, '');

    // Trim whitespace from the start and end of the string
    return cleanedText.trim();
}

  const simulateBotResponse = async (question) => {
    const initialBotResponse = { text: `Fetching response for: ${question}`, sender: 'bot', isLoading: true };
    setChats(currentChats => [...currentChats, initialBotResponse]);
    const chatIndex = chats.length; // Get current length before the update
  
    try {
      // API call to get the response
      const response = await fetch('http://10.1.23.188:8502/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const { answer } = await response.json();
      const responseText = cleanResponse(answer) || `No response received.`;
  
      // Update chat with the actual response
      updateChatAtIndex(chatIndex + 1, responseText);
  
      // Optionally update Firestore as well if bot responses are stored
      const chatRef = doc(db, "chats", chatId);
      await updateDoc(chatRef, {
        data: arrayUnion({...initialBotResponse, text: responseText, isLoading: false}) // Update Firestore data
      });
  
    } catch (error) {
      console.error("Failed to get bot response:", error.message);
      updateChatAtIndex(chatIndex + 1, "Failed to get response."); // Update chat to show failure
    }
  };
  

 const addChat = async (text, sender) => {
  const newChat = { text, sender, isLoading: false }; // Initially set to loading
  setChats(chats => [...chats, newChat]); // Update UI to show loading state

  // Add new chat to Firestore
  const chatRef = doc(db, "chats", chatId);
  try {
    await updateDoc(chatRef, {
      data: arrayUnion({...newChat, isLoading: false}) // Send to Firestore without isLoading
    });
    // Update local state if needed or handle confirmation
  } catch (error) {
    console.error("Failed to send chat:", error);
    // Optionally handle error in UI, e.g., show retry option
  }
};
const updateChatAtIndex = (index, text) => {
  setChats(currentChats => {
    const updatedChats = [...currentChats];
    if (index >= 0 && index < updatedChats.length) {
      updatedChats[index] = { ...updatedChats[index], text, isLoading: false };
    }
    return updatedChats;
  });
};

  const sendChat = () => {
    if (newMessage) {
      addChat(newMessage, 'user');
      setNewMessage("");
      simulateBotResponse(newMessage);
    }
  };

  const inputBg = useColorModeValue("white", "gray.700");

  return (
    <SidebarWithHeader>
      <Flex direction="column" overflowY="scroll" height="80vh" p={4} w="100%">
        {loading ? (
          <Flex width="100%" height="60vh" justifyContent="center" alignItems="center">
            <Spinner />
          </Flex>
        ) : (
          <>
          {chats.length > 0 ? (
            <VStack flex="1" overflowY="auto" spacing={4} height="80vh"> 
            {chats.map((chat, index) => (
              <Flex key={index} alignSelf={chat.sender === 'bot' ? 'flex-start' : 'flex-end'}>
                <Box
                  p={3}
                  bg={chat.sender === 'bot' ? 'blue.100' : 'teal.500'}
                  borderRadius="lg"
                  boxShadow="md"
                  maxW="100%"
                >
                  {chat.isLoading ? (
                    <SkeletonText noOfLines={2} spacing='4' width="40vw" />
                  ) : (
                    <Text color={chat.sender === 'bot' ? 'black' : 'white'}>{chat.text}</Text>
                  )}
                </Box>
              </Flex>
            ))}
          </VStack>
          ) : (
            <Flex width="100%" height="60vh" justifyContent="center" alignItems="center">
              <Box>
                <Text fontSize="5xl" fontFamily="monospace" fontWeight="bold" textAlign='center'>
                  RAG LLM
                </Text>
                <Text  textAlign='center' py={4} fontFamily="monospace" fontSize="md">
                  How can I help you today?
                </Text>
              </Box>
            </Flex>  
          )}
          <Flex
            mt={4}
            p={4}
            width={{ base: '100vw', md: '80vw' }}
            align="center"
            position="fixed"
            bottom="0"
            right="0"
            // Adds a shadow to make it pop
            borderRadius="lg" // Rounded corners for the entire Flex container
            zIndex="10" // Ensures it's above other content
          >
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
              flexGrow={1}
              mr={2}
              bg={inputBg}
              borderRadius="full"
              boxShadow="0px 2px 6px rgba(0, 0, 0, 0.1)" // Optional: Adds subtle shadow to the input
              onKeyPress={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) { // Check if Enter key is pressed and not Shift+Enter
                  event.preventDefault(); // Prevent the default action to avoid form submission or line breaks
                  sendChat(); // Call the sendChat function
                }
              }}
            />
            <Button onClick={sendChat} colorScheme="teal" borderRadius="full">Send</Button>
          </Flex>

          </>
        ) }
      </Flex>
    </SidebarWithHeader>
  );
}

export default ChatScreen;
