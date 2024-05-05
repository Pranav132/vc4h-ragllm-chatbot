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
    // Simulate fetching chats
    setTimeout(() => {
      setChats(['Hello, how can I help you today?']); // Initial chat loaded
      setIsLoading(false);
    }, 2000);
  }, []);

  const sendChat = () => {
    if (newMessage) {
      setChats([...chats, newMessage]);
      setNewMessage("");
    }
  };

  return (
    <SidebarWithHeader>
      <Flex direction="column" h="full" p={4} w="calc(100%)"> 
        <VStack flex="1" overflowY="auto">
          {isLoading ? (
            <Spinner size="xl" />
          ) : (
            chats.map((chat, index) => (
              <Skeleton isLoaded={!isLoading} key={index}>
                <Text p={4} borderRadius="lg">{chat}</Text>
              </Skeleton>
            ))
          )}
        </VStack>
        <Flex mt={4} p={4} width="100%" align="center">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message here..."
            flexGrow={1}  // Makes the input flexibly grow to use available space
            mr={2}  // Adds a margin to the right for spacing between input and button
          />
          <Button onClick={sendChat} colorScheme="teal">Send</Button>
        </Flex>
      </Flex>
    </SidebarWithHeader>
  );
}

export default ChatScreen;
