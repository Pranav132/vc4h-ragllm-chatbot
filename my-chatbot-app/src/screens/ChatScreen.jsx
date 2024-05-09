import React, { useState, useEffect } from 'react';
import {
  Box, Text, Flex, VStack, SkeletonText, Input, Button, useColorModeValue
} from '@chakra-ui/react';
import { SidebarWithHeader } from '../components/Sidebar';

function ChatScreen() {
  const [chats, setChats] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Simulate initial greeting from the chatbot
    simulateBotResponse('Hello, how can I help you today?');
  }, []);

  const simulateBotResponse = (question) => {
    // Start by adding a bot response that is loading
    setChats(currentChats => {
      const newChat = { text: `Fetching response for: ${question}`, sender: 'bot', isLoading: true };
      const newChats = [...currentChats, newChat];
      const chatIndex = newChats.length - 1;  // Correct index of the new chat

      // Simulate API response
      setTimeout(() => {
        const responseText = `Response to: ${question}`;
        updateChatAtIndex(chatIndex, responseText);
      }, 2000);

      return newChats;
    });
  };

  const addChat = (text, sender) => {
    setChats(chats => [...chats, { text, sender, isLoading: false }]);
  };

  const updateChatAtIndex = (index, text) => {
    setChats(currentChats => {
      const updatedChats = [...currentChats];
      updatedChats[index] = { ...updatedChats[index], text, isLoading: false };
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
      <Flex direction="column" h="full" p={4} w="100%">
        <VStack flex="1" overflowY="auto" spacing={4}>
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
