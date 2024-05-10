import {
  Box, Text, Flex, Button, Spinner
} from '@chakra-ui/react';
import { SidebarWithHeader } from '../components/Sidebar';
import { useEffect, useState } from 'react';
import { collection, query, getDocs, where } from "firebase/firestore";
import { useAuth } from '../Providers/AuthContext';
import { db } from '../firebase';

function WelcomeScreen() {

  const { currentUser } = useAuth();
  const [chats, setChats]  = useState("");

  const loadChats = async () => {
    const q = query(collection(db, "chats"), where("user", "==", currentUser.email));
    const snapshot = await getDocs(q);
    const chatsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log("chats:" + JSON.stringify(chatsData));
    setChats(chatsData[0]["id"]);
  };

  useEffect(() => {
    loadChats();
  }, []);

  return (
    <SidebarWithHeader>
      <Flex direction="column" h="full" p={4} w="100%">
          <Flex width="100%" height="60vh" justifyContent="center" alignItems="center">
            { chats === "" ? (
              <>
                <Spinner />
              </>
            ) : (
               <Box>
                <Text fontSize="5xl" fontFamily="monospace" fontWeight="bold" textAlign='center'>
                  RAG LLM
                </Text>
                <Text  textAlign='center' py={4} fontFamily="monospace" fontSize="md">
                  How can I help you today?
                </Text>
                <Button as="a" href={`/chats/${chats}`} ml={20} mt={6}>Start</Button>
             </Box>
            ) }
          </Flex>  
      </Flex>
    </SidebarWithHeader>
  );
}

export default WelcomeScreen;
