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
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useRouter } from "next/navigation";

type Genre = {
  id: number;
  name: string;
};

export default function DeleteGenrePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const cancelRef = useRef(null);
  const router = useRouter();
  const toast = useToast();

  // Function to search genres using the search API
  const handleSearch = async () => {
    try {
      const response = await fetch(
        `/api/public/genres/search=${encodeURIComponent(searchQuery)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch genres");
      }
      const data = await response.json();
      setGenres(data);
    } catch (error: any) {
      toast({
        title: "Error searching genres",
        description:
          error.message || "An error occurred while searching for genres.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Function to delete the selected genre using the deletion API
  const handleDelete = async () => {
    if (!selectedGenre) return;
    try {
      const response = await fetch(`/api/admin/genres/${selectedGenre.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete genre");
      }
      router.push("/genres/deleted");
    } catch (error: any) {
      toast({
        title: "Error deleting genre",
        description:
          error.message || "An error occurred while deleting the genre.",
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
            Delete Genre
          </Heading>
          <VStack spacing={4} align="stretch">
            <Input
              placeholder="Enter keyword to search genre"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button onClick={handleSearch} colorScheme="teal">
              Search
            </Button>

            {genres.length > 0 ? (
              genres.map((genre) => (
                <Box
                  key={genre.id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  bg="gray.100"
                >
                  <Text fontWeight="bold">{genre.name}</Text>
                  <Button
                    mt={2}
                    colorScheme="red"
                    onClick={() => {
                      setSelectedGenre(genre);
                      setIsAlertOpen(true);
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              ))
            ) : (
              <Text>No genres found. Try searching for a keyword.</Text>
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
              Do you want to confirm deleting this genre?
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
