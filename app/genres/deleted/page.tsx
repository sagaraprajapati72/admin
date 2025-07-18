"use client";

import React from "react";
import { Box, Button, VStack, Heading } from "@chakra-ui/react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useRouter } from "next/navigation";

export default function GenreDeletionSuccess() {
  const router = useRouter();

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
            Genre Successfully Deleted
          </Heading>
          <VStack spacing={4}>
            <Button
              colorScheme="teal"
              width="full"
              onClick={() => router.push("/genres/delete")}
            >
              Delete Other
            </Button>
            <Button
              colorScheme="teal"
              variant="outline"
              width="full"
              onClick={() => router.push("/")}
            >
              Dashboard
            </Button>
          </VStack>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
