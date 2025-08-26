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

type Audience = {
  id: number;
  targetGroup: string;
};

export default function DeleteAudiencePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [selectedAudience, setSelectedAudience] = useState<Audience | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const cancelRef = useRef(null);
  const router = useRouter();
  const toast = useToast();

  // Function to search audiences using the search API
  const handleSearch = async () => {
    try {
      const response = await fetch(
        `/api/public/audiences/search?=${encodeURIComponent(searchQuery)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch audiences");
      }
      const data = await response.json();
      setAudiences(data);
    } catch (error: any) {
      toast({
        title: "Error searching audiences",
        description: error.message || "An error occurred while searching for audiences.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Function to delete the selected audience using the deletion API
  const handleDelete = async () => {
    if (!selectedAudience) return;
    try {
      const response = await fetch(`/api/admin/audiences/${selectedAudience.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete audience");
      }
      router.push("/audiences/deleted");
    } catch (error: any) {
      toast({
        title: "Error deleting audience",
        description: error.message || "An error occurred while deleting the audience.",
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
            Delete Audience
          </Heading>
          <VStack spacing={4} align="stretch">
            <Input
              placeholder="Enter keyword to search audience"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button onClick={handleSearch} colorScheme="teal">
              Search
            </Button>
            {audiences.length > 0 ? (
              audiences.map((audience) => (
                <Box
                  key={audience.id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  bg="gray.100"
                >
                  <Text fontWeight="bold">{audience.targetGroup}</Text>
                  <Button
                    mt={2}
                    colorScheme="red"
                    onClick={() => {
                      setSelectedAudience(audience);
                      setIsAlertOpen(true);
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              ))
            ) : (
              <Text>No audiences found. Try searching for a keyword.</Text>
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
              Do you want to confirm deleting this audience?
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
