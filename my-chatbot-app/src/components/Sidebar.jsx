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
  Input, Button
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


const SidebarContent = ({ chats, setChats, onClose, onRename, ...rest }) => {
    const handleNewChat = () => {
      const newChatId = chats.length > 0 ? Math.max(...chats.map(c => c.id)) + 1 : 1;
      const newChat = {
        id: newChatId,
        name: `Chat #${chats.length + 1}`
      };
      setChats([...chats, newChat]);
    };

    const onDelete = (id) => {
        setChats(chats.filter(chat => chat.id !== id));
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
          {chats.map((chat) => (
            <ChatItem key={chat.id} chat={chat} onRename={onRename} onDelete={onDelete} />
          ))}
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
        >
          <Text flex="1" textAlign="left" fontWeight="medium">{chat.name}</Text>
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<FiMoreVertical />}
              variant="ghost"
              aria-label="Options"
              _hover={{ color: 'teal.300' }}
            />
            <MenuList >
              <MenuItem icon={<FiEdit />} onClick={onOpen}>Rename</MenuItem>
              <MenuItem icon={<FiTrash2 />} color={'red.500'} onClick={() => onDelete(chat.id)}>Delete</MenuItem>
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
                onChange={(e) => setNewName(e.target.value)}
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
  const [chats, setChats] = useState([
    { id: 1, name: 'Alpha Team' },
    { id: 2, name: 'Beta Group' },
    { id: 3, name: 'Gamma Chat' },
  ]);

  const renameChat = (id, newName) => {
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
