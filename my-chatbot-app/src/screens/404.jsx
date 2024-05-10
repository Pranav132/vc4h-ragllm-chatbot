import React from "react";
import { Button, Flex, Text } from "@chakra-ui/react";

const Page404 = () => {
  return (
    <Flex flexDir="column" margin="auto" width="100vw">
      <Flex
        width="90vw"
        margin="auto"
        flexDirection="column"
        justifyContent="center"
      >
        <Flex
        height="100vh"
        justifyContent={"center"}
        alignItems="center"
        flexDirection={"column"}>
            <Text
            fontSize="3xl"
            fontWeight="600"
            paddingTop="2vh">
                404
            </Text>
            <Text
            paddingTop={"2vh"}>
                This page does not exist.
            </Text>
            <Button
            marginTop="4vh"
            bg="black"
            color="white"
            _hover={{
                bg: 'gray.600'
            }}
            borderRadius={"0"}
            fontSize={"lg"}
            fontWeight={"400"}
            as="a"
            href="/">Home</Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Page404;
