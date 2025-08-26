"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Grid,
  Heading,
  Text,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Spinner,
} from "@chakra-ui/react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useRouter } from "next/navigation";
import EditFAQModal from "../../components/EditFAQModal";

type FAQ = {
  id: number;
  question: string;
  answer: string;
};

export default function DeleteFAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const cancelRef = useRef(null);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const res = await fetch("/api/public/faqs");
        if (!res.ok) throw new Error("Failed to fetch FAQs");
        const data = await res.json();
        setFaqs(data);
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, [toast]);

  const handleDelete = async () => {
    if (!selectedFAQ) return;
    try {
      const res = await fetch(`/api/admin/faqs/${selectedFAQ.id}`, {
        method: "DELETE",
      });

      if (!res.ok && res.status !== 204) {
        throw new Error("Failed to delete FAQ");
      }

      toast({
        title: "FAQ Deleted",
        description: `FAQ "${selectedFAQ.question}" was removed.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setFaqs((prev) => prev.filter((f) => f.id !== selectedFAQ.id));
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsAlertOpen(false);
    }
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />
      <Box flex="1" bg="gray.50" p={6}>
        <Box maxW="1000px" mx="auto" my={8} p={6} bg="white" borderRadius="lg" boxShadow="xl">
          <Heading mb={6} textAlign="center">
            Manage FAQs
          </Heading>

          {loading ? (
            <Spinner size="xl" color="teal.500" />
          ) : faqs.length === 0 ? (
            <Text>No FAQs available.</Text>
          ) : (
            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
              {faqs.map((faq) => (
                <Box
                  key={faq.id}
                  p={5}
                  borderWidth="1px"
                  borderRadius="lg"
                  bg="gray.100"
                  boxShadow="md"
                  transition="all 0.2s"
                  _hover={{ transform: "scale(1.02)", boxShadow: "lg" }}
                >
                  <Box>
                    <Text fontWeight="bold" mb={2}>{faq.question}</Text>
                    <Text color="gray.600">{faq.answer}</Text>
                  </Box>

                  <Box mt={4} display="flex" justifyContent="space-between">
                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={() => {
                        setSelectedFAQ(faq);
                        setIsEditOpen(true);
                      }}
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      color="teal.600"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedFAQ(faq);
                        setIsAlertOpen(true);
                      }}
                    >
                      🗑️ Delete
                    </Button>
                  </Box>
                </Box>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
      <Footer />

      {/* Confirm Delete Alert */}
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete FAQ
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete: <strong>{selectedFAQ?.question}</strong>?
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

      {/* Edit Modal */}
      <EditFAQModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        faq={selectedFAQ}
        onUpdate={() => {
          setIsEditOpen(false); // close modal
         window.location.reload();    // revalidate page (Next.js 13+ App Router)
        }}
      />
    </Box>
  );
}
