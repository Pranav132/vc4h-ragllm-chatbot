import { Center, Box, Button, Text, VStack, useColorModeValue, Heading, useToast } from '@chakra-ui/react';
import { signInWithGoogle } from '../Providers/AuthService'; // Adjust the import path if necessary
import { useAuth } from '../Providers/AuthContext';

function AuthScreen() {
  const bg = useColorModeValue('white', 'gray.700');  // Adjusts background color based on the theme
  const color = useColorModeValue('gray.600', 'gray.300');

  const toast = useToast();
  const { signIn } = useAuth();

  const handleToast = ({ title, description, status }) => {
    toast({
      title: title,
      description: description,
      status: status,
      duration: 9000,
      isClosable: true,
      position: "top-right"
    });
  };

  return (
    <Center height="100vh" bgGradient="linear(to-br, gray.200, gray.400)">
      <Box p={8} boxShadow="xl" bg={bg} borderRadius="2xl" width={['90%', '400px']}>
        <VStack spacing={5}>
          <Heading fontSize="2xl" fontWeight="bold">VC4H RAG LLM ChatBot</Heading>
          <Text fontSize="md" color={color} textAlign="center">
            Sign in with your Ashoka University account to continue.
          </Text>
          <Button colorScheme="blue" onClick={() => signInWithGoogle(signIn, handleToast)} width="full" size="lg">
            Sign in with Google
          </Button>
        </VStack>
      </Box>
    </Center>
  );
}

export default AuthScreen;
