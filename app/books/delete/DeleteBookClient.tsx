"use client";

import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  Heading,
  Text,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

type Book = {
  id: number;
  description: string;
};

type DeleteBookClientProps = {
  user: any; // 👉 Replace with your actual User type if available
};

export default function DeleteBookClient({ user }: DeleteBookClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const cancelRef = useRef(null);
  const router = useRouter();
  const toast = useToast();

  // Search books using API
  const handleSearch = async () => {
    try {
      const response = await fetch(
        `/api/booksearch?q=${encodeURIComponent(searchQuery)}`
      );
      if (!response.ok) throw new Error("Failed to fetch books");
      const data = await response.json();
      setBooks(data);
    } catch (error: any) {
      toast({
        title: "Error searching books",
        description: error.message || "An error occurred while searching for books.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Delete selected book
  const handleDelete = async () => {
    if (!selectedBook) return;
    try {
      const response = await fetch(`/api/admin/books/${selectedBook.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete book");
      router.push("/books/deleted");
    } catch (error: any) {
      toast({
        title: "Error deleting book",
        description: error.message || "An error occurred while deleting the book.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsAlertOpen(false);
    }
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header /> {/* ✅ pass user */}
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
            Delete Book
          </Heading>
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
                    colorScheme="red"
                    onClick={() => {
                      setSelectedBook(book);
                      setIsAlertOpen(true);
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              ))
            ) : (
              <Text>No books found. Try searching for a keyword.</Text>
            )}
          </VStack>
        </Box>
      </Box>
      <Footer />

      {/* Confirmation Modal */}
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Deletion
            </AlertDialogHeader>
            <AlertDialogBody>
              Do you want to confirm deleting this book?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
