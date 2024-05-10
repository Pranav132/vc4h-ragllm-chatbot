import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  useColorMode,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  Input, Button,
  Spinner,
  useToast
} from '@chakra-ui/react'
import {
  FiMenu,
  FiLogOut,
  FiChevronDown,
  FiEdit,
  FiMoreVertical,
  FiTrash2,
  FiSun,
  FiMoon
} from 'react-icons/fi'
import { useAuth } from '../Providers/AuthContext';
import { useState } from 'react';
import { db } from '../firebase';
import { useEffect } from 'react';
import { doc, updateDoc, collection, addDoc, query, deleteDoc, getDocs, where } from "firebase/firestore";

const SidebarContent = ({ chats, setChats, onClose, onRename, ...rest }) => {

  const [chatId, setChatId] = useState(null);

    useEffect(() => {
        const pathSegments = window.location.pathname.split('/');
        const idIndex = pathSegments.findIndex(segment => segment === 'chats') + 1;
        if (idIndex !== 0 && pathSegments[idIndex]) {
            setChatId(pathSegments[idIndex]);
        }
    }, []);

  const [loading, setLoading] = useState(false);

  const { currentUser } = useAuth();

  const toast = useToast();

  const handleNewChat = async () => {
    setLoading(true);
    const newChatName = `New Chat`;
    console.log(newChatName);
    const newChat = {
      name: newChatName,
      user: currentUser.email,
      data: []
    };
    const docRef = await addDoc(collection(db, "chats"), newChat);
    newChat.id = docRef.id; // Use the auto-generated ID from Firestore
    setChats([...chats, newChat]);
    setLoading(false);
    window.location = `/chats/${newChat.id}`;
  };
  

  const onDelete = async (id) => {
    if (chats.length < 2){
      toast({
        title: "Error deleting chat",
        description: "User must always have one chat!",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top-right"
      });
    }
    else{
      try {
        // Attempt to delete the chat from Firestore
        await deleteDoc(doc(db, "chats", id));
        
        // Filter out the deleted chat from the local state
        const updatedChats = chats.filter(chat => chat.id !== id);
        console.log(updatedChats)
        setChats(updatedChats);
        console.log(id)
        console.log(chatId)
    
        // Check if the deleted chat is the current one
        if (id == chatId) {
          if (updatedChats.length > 0) {
            // Redirect to the first available chat if there are other chats
            console.log(`/chats/${updatedChats[0].id}`)
            window.location = `/chats/${updatedChats[0].id}`;
          } else {
            // Handle the case when no chats are left (redirect to a general page or display a message)
            window.location = "/welcome"; // or any other appropriate location
          }
        }
      } catch (error) {
        console.error("Failed to delete the chat:", error);
        // Optionally handle the error, e.g., show a toast notification
      }
    }
  };

    return (
      <Box
        transition="3s ease"
        bg={useColorModeValue('white', 'gray.900')}
        borderRight="1px"
        borderRightColor={useColorModeValue('gray.200', 'gray.700')}
        w={{ base: 'full', md: 60 }}
        pos="fixed"
        h="full"
        {...rest}>
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
          <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
            RAG LLM
          </Text>
          <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
        </Flex>
        <Flex alignItems="center" justifyContent={"space-between"} px={6} pt={6} pb={4}>
          <Text fontSize="lg" textDecoration="underline" fontWeight="semibold">
            Previous Chats
          </Text>
          <IconButton
            aria-label="New chat"
            icon={<Icon as={FiEdit} />}
            onClick={handleNewChat}
            size="md"
            ml={4}
            bg={"none"}
          />
        </Flex>
        <Box overflowY="auto" maxH="calc(100vh - 120px)" >
          {loading ? (
            <Spinner />
          ) : (
            chats.map((chat) => (
              <ChatItem key={chat.id} chat={chat} onRename={onRename} onDelete={onDelete} />
            ))
          )}
          {}
        </Box>
      </Box>
    );
  };

  const ChatItem = ({ chat, onRename, onDelete }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [newName, setNewName] = useState(chat.name);
  
    const handleRename = () => {
      onRename(chat.id, newName);
      onClose();
    };

    // Prevent event propagation to stop the chat from changing the URL
    const stopPropagation = (e) => {
      e.stopPropagation();
    };
  
    return (
      <>
        <Flex
          align="center"
          pr="2"
          pl="4"
          py="4"
          mx="4"
          my="2"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          _hover={{
            border: '1px solid',
            borderColor: 'gray.500',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
          }}
          transition="all 0.1s ease"
          onClick={() => (window.location = `/chats/${chat.id}`)}
        >
          <Text flex="1" textAlign="left" fontWeight="medium">{chat.name}</Text>
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<FiMoreVertical />}
              variant="ghost"
              aria-label="Options"
              onClick={stopPropagation} // Stop propagation when clicking the menu button
              _hover={{ color: 'teal.300' }}
            />
            <MenuList onClick={stopPropagation}>
              <MenuItem icon={<FiEdit />} onClick={onOpen}>Rename</MenuItem>
              <MenuItem icon={<FiTrash2 />} color={'red.500'} onClick={() => { onDelete(chat.id); }}>Delete</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
  
        {/* Rename Modal */}
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Rename Chat</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Input
                value={newName}
                onChange={(e) => { e.stopPropagation(); setNewName(e.target.value); }}
                placeholder="New chat name"
                autoFocus
              />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleRename}>
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  };


const MobileNav = ({ onOpen, ...rest }) => {

  const { signOut, currentUser } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue('white', 'gray.900');
  const borderBottomColor = useColorModeValue('gray.200', 'gray.700');
    
  return (
    <Flex
    ml={{ base: 0, md: 60 }}
    px={{ base: 4, md: 4 }}
    height="20"
    alignItems="center"
    bg={bg}
    borderBottomWidth="1px"
    borderBottomColor={borderBottomColor}
    justifyContent={{ base: 'space-between', md: 'flex-end' }}
    {...rest}>
    <IconButton
      display={{ base: 'flex', md: 'none' }}
      onClick={onOpen}
      variant="outline"
      aria-label="open menu"
      icon={<FiMenu />}
    />

    <Text
      display={{ base: 'flex', md: 'none' }}
      fontSize="2xl"
      fontFamily="monospace"
      fontWeight="bold">
      RAG LLM
    </Text>

    <HStack spacing={{ base: '0', md: '6' }}>
      <IconButton
        size="lg"
        variant="ghost"
        icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
        onClick={toggleColorMode}
        aria-label="Toggle color mode"
      />

      <Flex alignItems={'center'}>
        <Menu>
          <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
            <HStack>
              <Avatar
                size={'sm'}
                src={currentUser.photoURL}
              />
              <VStack
                display={{ base: 'none', md: 'flex' }}
                alignItems="flex-start"
                spacing="1px"
                ml="2">
                <Text fontSize="sm">{currentUser.displayName}</Text>
              </VStack>
              <Box display={{ base: 'none', md: 'flex' }}>
                <FiChevronDown />
              </Box>
            </HStack>
          </MenuButton>
          <MenuList
            bg={bg}
            borderColor={borderBottomColor}>
            <MenuItem icon={<Icon as={FiLogOut} color="red.500" />} color="red.600" _hover={{ bg: "red.100" }} onClick={signOut}>
                Sign out
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </HStack>
  </Flex>
  )
}

export const SidebarWithHeader = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [chats, setChats] = useState([]);

  const chatsRef = collection(db, "chats");

  const { currentUser } = useAuth();

  const loadChats = async () => {
    const q = query(collection(db, "chats"), where("user", "==", currentUser.email));
    const snapshot = await getDocs(q);
    const chatsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setChats(chatsData);
  };

  useEffect(() => {
    loadChats();
  }, []);


  const renameChat = async (id, newName) => {
    // const q = query(collection(db, "chats"), where("id", "==", id));

    await updateDoc(doc(db, "chats", id), {
      name: newName
    });

    const updatedChats = chats.map(chat => {
      if (chat.id === id) {
        return { ...chat, name: newName };
      }
      return chat;
    });
    setChats(updatedChats);
  };

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')} overflowX={"hidden"}>
      <SidebarContent chats={chats} onRename={renameChat} setChats={setChats} onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
        <SidebarContent chats={chats} setChats={setChats} onRename={renameChat} onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: '250px' }} p="4" width={{ base: '100vw', md: '80vw' }} position="relative" minHeight="90vh">
        {children}
      </Box>
    </Box>
  )
}
