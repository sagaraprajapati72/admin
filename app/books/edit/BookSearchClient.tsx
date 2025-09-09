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
import EditBookModal from "./EditBookModal";
import type { User } from "../../../lib/auth";

type Book = {
  id: number;
  description: string;
};

interface Props {
  user: User | null;
}

export default function BookSearchClient({ user }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [books, setBooks] = useState<Book[]>([]);
  const toast = useToast();

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `/api/booksearch?q=${encodeURIComponent(searchQuery)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }
      const data = await response.json();
      setBooks(data);
    } catch (error: any) {
      toast({
        title: "Error searching books",
        description:
          error.message || "An error occurred while searching for books.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
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
          Search & Edit Book
        </Heading>
        {user && (
          <Text fontSize="md" mb={4}>
            Welcome, <b>{user.name}</b>! Search and edit books below.
          </Text>
        )}
        <VStack spacing={4} align="stretch">
          <Input
            placeholder="Enter keyword to search book"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button onClick={handleSearch} colorScheme="teal">
            Search
          </Button>

          {books.length > 0 ? (
            books.map((book) => (
              <Box
                key={book.id}
                p={4}
                borderWidth="1px"
                borderRadius="md"
                bg="gray.100"
              >
                <Text fontWeight="bold">{book.description}</Text>
                <Button
                  mt={2}
                  colorScheme="blue"
                  onClick={() => {
                    setSelectedBookId(book.id);
                    onOpen();
                  }}
                >
                  Edit Book
                </Button>
              </Box>
            ))
          ) : (
            <Text>No books found. Try searching for a keyword.</Text>
          )}
        </VStack>
      </Box>

      {selectedBookId && (
        <EditBookModal
          isOpen={isOpen}
          onClose={() => {
            onClose();
            setSelectedBookId(null);
          }}
          bookId={selectedBookId}
        />
      )}
    </Box>
  );
}
