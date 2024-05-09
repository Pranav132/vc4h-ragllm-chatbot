import {
  Box, Text, Flex
} from '@chakra-ui/react';
import { SidebarWithHeader } from '../components/Sidebar';

function WelcomeScreen() {
  return (
    <SidebarWithHeader>
      <Flex direction="column" h="full" p={4} w="100%">
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
      </Flex>
    </SidebarWithHeader>
  );
}

export default WelcomeScreen;
