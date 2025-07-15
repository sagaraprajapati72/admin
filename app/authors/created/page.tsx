"use client";

import React from "react";
import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function AuthorCreatedPage() {
  const router = useRouter();

  const handleCreateAnother = () => {
    // Navigate back to the create author form
    router.push("/authors/create");
  };

  const handleViewDashboard = () => {
    // Navigate to the dashboard or author detail page as needed
    router.push("/");
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />
      {/* Main content area */}
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
            <Heading size="lg">Author Created Successfully!</Heading>
            <Text>Your author has been added to our collection.</Text>
            <Button colorScheme="teal" onClick={handleCreateAnother}>
              Create Another Author
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
