import React, { useState, useEffect } from 'react';
import {
  Box, Text, Flex, Spinner, VStack, Skeleton, Input, Button, useColorModeValue
} from '@chakra-ui/react';
import { SidebarWithHeader } from '../components/Sidebar';

function ChatScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Simulate fetching chats from a chatbot
    setTimeout(() => {
      setChats([{ text: 'Hello, how can I help you today?', sender: 'bot' }]); // Initial chat loaded from bot
      setIsLoading(false);
    }, 2000);
  }, []);

  const sendChat = () => {
    if (newMessage) {
      setChats([...chats, { text: newMessage, sender: 'user' }]);
      setNewMessage("");
    }
  };

  const inputBg = useColorModeValue("white", "gray.700");

  return (
    <SidebarWithHeader>
      <Flex direction="column" h="full" p={4} w="100%"> 
        <VStack flex="1" overflowY="auto" spacing={4}>
          {isLoading ? (
            <Spinner size="xl" />
          ) : (
            chats.map((chat, index) => (
              <Flex key={index} alignSelf={chat.sender === 'bot' ? 'flex-start' : 'flex-end'}>
                <Box 
                  p={3} 
                  bg={chat.sender === 'bot' ? 'blue.100' : 'teal.500'}
                  borderRadius="lg"
                  boxShadow="md"
                  maxW="100%"
                >
                  <Text color={chat.sender === 'bot' ? 'black' : 'white'}>{chat.text}</Text>
                </Box>
              </Flex>
            ))
          )}
        </VStack>
        <Flex mt={4} p={4} width="100%" align="center">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message here..."
            flexGrow={1}
            mr={2}
            bg={inputBg}
            borderRadius="full"
          />
          <Button onClick={sendChat} colorScheme="teal" borderRadius="full">Send</Button>
        </Flex>
      </Flex>
    </SidebarWithHeader>
  );
}

export default ChatScreen;
