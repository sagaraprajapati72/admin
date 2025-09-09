"use client";

import React from "react";
import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { User } from "../../../lib/auth";

type Props = {
  user: User;
};

export default function CategoryCreatedClient({ user }: Props) {
  const router = useRouter();

  const handleCreateCategory = () => {
    router.push("/category/create");
  };

  const handleViewDashboard = () => {
    router.push("/");
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header  />
      <Box
        flex="1"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="gray.50"
        p={6}
      >
        <Box
          maxW="600px"
          w="full"
          p={8}
          bg="white"
          borderWidth="1px"
          borderRadius="lg"
          boxShadow="xl"
          textAlign="center"
        >
          <VStack spacing={6}>
            <Heading size="lg">Category Created Successfully!</Heading>
            <Text>Your category has been added to our collection.</Text>
            <Button colorScheme="teal" onClick={handleCreateCategory}>
              Create Another Category
            </Button>
            <Button variant="outline" onClick={handleViewDashboard}>
              View Dashboard
            </Button>
          </VStack>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
