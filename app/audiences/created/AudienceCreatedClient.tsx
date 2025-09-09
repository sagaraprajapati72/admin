"use client";

import React from "react";
import { Box, Button, Heading, VStack, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { User } from "../../../lib/auth";

type Props = {
  user: User;
};

export default function AudienceCreatedClient({ user }: Props) {
  const router = useRouter();

  const handleCreateAnother = () => {
    router.push("/audiences/create");
  };

  const handleViewDashboard = () => {
    router.push("/dashboard"); // or "/" if you want
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />
      <Box flex="1" overflowY="auto" bg="gray.50" p={6}>
        <Box
          maxW="800px"
          mx="auto"
          my={8}
          p={6}
          bg="white"
          borderRadius="lg"
          boxShadow="xl"
          textAlign="center"
        >
          <Heading as="h1" mb={2} size="lg">
            Audience Created Successfully!
          </Heading>
          <Text mb={6} color="gray.600">
            Logged in as: <b>{user.name}</b> 
          </Text>
          <VStack spacing={4}>
            <Button colorScheme="teal" width="full" onClick={handleCreateAnother}>
              Create Another Audience
            </Button>
            <Button colorScheme="teal" variant="outline" width="full" onClick={handleViewDashboard}>
              Dashboard
            </Button>
          </VStack>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
