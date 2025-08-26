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

type Language = {
  id: number;
  name: string;
  code: string;
};

export default function DeleteLanguagePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const cancelRef = useRef(null);
  const router = useRouter();
  const toast = useToast();

  // Function to search languages using the search API
  const handleSearch = async () => {
    try {
      const response = await fetch(
        `/api/public/languages/search?search=${encodeURIComponent(searchQuery)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch languages");
      }
      const data = await response.json();
      setLanguages(data);
    } catch (error: any) {
      toast({
        title: "Error searching languages",
        description:
          error.message || "An error occurred while searching for languages.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Function to delete the selected language using the deletion API
  const handleDelete = async () => {
    if (!selectedLanguage) return;
    try {
      const response = await fetch(`/api/admin/languages/${selectedLanguage.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete language");
      }
      router.push("/languages/deleted");
    } catch (error: any) {
      toast({
        title: "Error deleting language",
        description:
          error.message || "An error occurred while deleting the language.",
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
            Delete Language
          </Heading>
          <VStack spacing={4} align="stretch">
            <Input
              placeholder="Enter keyword to search language"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button onClick={handleSearch} colorScheme="teal">
              Search
            </Button>

            {languages.length > 0 ? (
              languages.map((language) => (
                <Box
                  key={language.id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  bg="gray.100"
                >
                  <Text fontWeight="bold">
                    {language.name} ({language.code})
                  </Text>
                  <Button
                    mt={2}
                    colorScheme="red"
                    onClick={() => {
                      setSelectedLanguage(language);
                      setIsAlertOpen(true);
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              ))
            ) : (
              <Text>No languages found. Try searching for a keyword.</Text>
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
              Do you want to confirm deleting this language?
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
