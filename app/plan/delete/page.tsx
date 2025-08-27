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
import EditPlanModal from "../../components/EditPlanModal";

type Plan = {
  id: number;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
};

export default function DeletePlanPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const cancelRef = useRef(null);
  const toast = useToast();
  const router = useRouter();

  // Fetch all plans on mount
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch("/api/public/subscription/plans");
        if (!response.ok) throw new Error("Failed to fetch plans");
        const data = await response.json();
        setPlans(data);
      } catch (error: any) {
        toast({
          title: "Error fetching plans",
          description: error.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [toast]);

  // Delete plan
  const handleDelete = async () => {
    if (!selectedPlan) return;
    try {
      const response = await fetch(`/api/admin/plan/${selectedPlan.id}`, {
        method: "DELETE",
      });

      if (!response.ok && response.status !== 204) {
        throw new Error("Failed to delete plan");
      }

      toast({
        title: "Plan Deleted",
        description: `Plan "${selectedPlan.name}" was successfully deleted.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Remove from UI
      setPlans((prev) => prev.filter((p) => p.id !== selectedPlan.id));
    } catch (error: any) {
      toast({
        title: "Error deleting plan",
        description: error.message,
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
        <Box
          maxW="1000px"
          mx="auto"
          my={8}
          p={6}
          bg="white"
          borderRadius="lg"
          boxShadow="xl"
        >
          <Heading mb={6} textAlign="center">
            Delete / Edit Subscription Plans
          </Heading>

          {loading ? (
            <Spinner size="xl" color="teal.500" />
          ) : plans.length === 0 ? (
            <Text>No plans available.</Text>
          ) : (
            <Grid
              templateColumns={{ base: "1fr", md: "1fr 1fr" }}
              gap={6}
              alignItems="stretch"
            >
              {plans.map((plan) => (
                <Box
                  key={plan.id}
                  p={5}
                  borderWidth="1px"
                  borderRadius="lg"
                  bg="gray.100"
                  boxShadow="md"
                  transition="all 0.2s"
                  _hover={{
                    transform: "scale(1.02)",
                    boxShadow: "lg",
                  }}
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                >
                  <Box>
                    <Text fontSize="xl" fontWeight="bold" color="teal.700">
                      {plan.name}
                    </Text>
                    <Text mt={2}>
                      <strong>Monthly:</strong> ₹{plan.monthlyPrice}
                    </Text>
                    <Text>
                      <strong>Yearly:</strong> ₹{plan.yearlyPrice}
                    </Text>
                  </Box>

                  <Box mt={4} display="flex" justifyContent="space-between">
                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={() => {
                        setSelectedPlan(plan);
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
                        setSelectedPlan(plan);
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

      {/* Confirm Deletion Dialog */}
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
              Are you sure you want to delete the plan "
              <strong>{selectedPlan?.name}</strong>"?
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

      {/* Edit Plan Modal */}
      <EditPlanModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        planId={selectedPlan?.id ?? null}
        onUpdate={(updatedPlan) => {
          setPlans((prev) =>
            prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
          );
        }}
      />

    </Box>
  );
}
