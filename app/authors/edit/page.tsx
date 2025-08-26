"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  Heading,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import EditAuthorModal from "../../components/EditAuthorModal";

type Author = {
  id: number;
  name: string;
};

export default function AuthorSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAuthorId, setSelectedAuthorId] = useState<number | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [authors, setAuthors] = useState<Author[]>([]);
  const toast = useToast();

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `/api/public/authors?search=${encodeURIComponent(searchQuery)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch authors");
      }
      const data = await response.json();
      setAuthors(data);
    } catch (error: any) {
      toast({
        title: "Error searching authors",
        description:
          error.message || "An error occurred while searching for authors.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
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
        >
          <Heading as="h1" mb={6} size="lg" textAlign="center">
            Search & Edit Author
          </Heading>
          <VStack spacing={4} align="stretch">
            <Input
              placeholder="Enter keyword to search author"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button onClick={handleSearch} colorScheme="teal">
              Search
            </Button>

            {authors.length > 0 ? (
              authors.map((author) => (
                <Box
                  key={author.id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  bg="gray.100"
                >
                  <Text fontWeight="bold">{author.name}</Text>
                  <Button
                    mt={2}
                    colorScheme="blue"
                    onClick={() => {
                      setSelectedAuthorId(author.id);
                      onOpen();
                    }}
                  >
                    Edit Author
                  </Button>
                </Box>
              ))
            ) : (
              <Text>No authors found. Try searching for a keyword.</Text>
            )}
          </VStack>
        </Box>
      </Box>
      <Footer />

      {selectedAuthorId && (
        <EditAuthorModal
          isOpen={isOpen}
          onClose={() => {
            onClose();
            setSelectedAuthorId(null);
          }}
          authorId={selectedAuthorId}
        />
      )}
    </Box>
  );
}
