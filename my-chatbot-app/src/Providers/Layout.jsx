import { Box } from '@chakra-ui/react';
import { SidebarWithHeader } from '../components/Sidebar';
import { Footer } from '../components/Footer';

const Layout = ({ children }) => {
  return (
    <Box minH="100vh">
      <SidebarWithHeader />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout;
