'use client';

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
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useRouter } from "next/navigation";

type Author = {
  id: number;
  name: string;
};

type Props = {
  user: { name: string };
};

export default function DeleteAuthorClient({ user }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [authors, setAuthors] = useState<Author[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const cancelRef = useRef(null);
  const router = useRouter();
  const toast = useToast();

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `/api/public/authors?search=${encodeURIComponent(searchQuery)}`
      );
      if (!response.ok) throw new Error("Failed to fetch authors");
      const data: Author[] = await response.json();
      setAuthors(data);
    } catch (error: any) {
      toast({
        title: "Error searching authors",
        description: error.message || "An error occurred while searching for authors.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedAuthor) return;
    try {
      const response = await fetch(`/api/admin/authors/${selectedAuthor.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete author");
      router.push("/authors/deleted");
    } catch (error: any) {
      toast({
        title: "Error deleting author",
        description: error.message || "An error occurred while deleting the author.",
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
      <Header />
      <Box flex="1" overflowY="auto" bg="gray.50" p={6}>
        <Box maxW="800px" mx="auto" my={8} p={6} bg="white" borderRadius="lg" boxShadow="xl">
          <Heading as="h1" mb={6} size="lg" textAlign="center">
            Delete Author
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
                <Box key={author.id} p={4} borderWidth="1px" borderRadius="md" bg="gray.100">
                  <Text fontWeight="bold">{author.name}</Text>
                  <Button
                    mt={2}
                    colorScheme="red"
                    onClick={() => {
                      setSelectedAuthor(author);
                      setIsAlertOpen(true);
                    }}
                  >
                    Delete
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

      {/* Confirmation AlertDialog */}
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
              Do you want to confirm deleting this author?
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
