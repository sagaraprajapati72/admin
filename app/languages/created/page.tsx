"use client";

import React from "react";
import { Box, Button, Heading, VStack } from "@chakra-ui/react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useRouter } from "next/navigation";

export default function LanguageCreatedPage() {
  const router = useRouter();

  const handleCreateAnother = () => {
    // Navigate back to the create language form
    router.push("/languages/create");
  };

  const handleViewDashboard = () => {
    // Navigate to the dashboard or language detail page as needed
    router.push("/");
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
          <Heading as="h1" mb={6} size="lg">
            Language Created Successfully!
          </Heading>
          <VStack spacing={4}>
            <Button
              colorScheme="teal"
              width="full"
              onClick={handleCreateAnother}
            >
              Create Another Language
            </Button>
            <Button
              colorScheme="teal"
              variant="outline"
              width="full"
              onClick={handleViewDashboard}
            >
              View Dashboard
            </Button>
          </VStack>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
