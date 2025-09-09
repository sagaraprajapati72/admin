"use client";

import React from "react";
import { Box, Button, Divider, Heading, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

type BookCreatedClientProps = {
  user: any; // 👉 Replace `any` with your actual User type if defined
};

export default function BookCreatedClient({ user }: BookCreatedClientProps) {
  const router = useRouter();

  const handleCreateAnother = () => {
    router.push("/books/create");
  };

  const handleViewBook = () => {
    router.push("/");
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header  /> {/* ✅ pass user to header */}
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
          {/* Success message */}
          <VStack spacing={6}>
            <Heading size="lg">Book Created Successfully!</Heading>
            <Text>Your book has been added to our collection.</Text>
            <Text fontSize="sm" color="gray.500">
              Logged in as: {user?.name || "Unknown User"}
            </Text>
          </VStack>

          <Divider my={6} />

          {/* Actions */}
          <VStack spacing={4}>
            <Button colorScheme="teal" onClick={handleCreateAnother} w="full">
              Create Another Book
            </Button>
            <Button variant="outline" onClick={handleViewBook} w="full">
              View Dashboard
            </Button>
          </VStack>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
