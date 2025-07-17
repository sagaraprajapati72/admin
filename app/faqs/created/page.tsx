"use client";

import React from "react";
import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function PlanCreatedPage() {
  const router = useRouter();

  const handleCreateFAQS = () => {
    router.push("/faqs/create"); // Navigate to plan creation form
  };

  const handleViewDashboard = () => {
    router.push("/"); // Navigate to dashboard or home
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />
      <Box
        flex="1"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="gray.50"
        p={6}
      >
        <Box
          maxW="600px"
          w="full"
          p={8}
          bg="white"
          borderWidth="1px"
          borderRadius="lg"
          boxShadow="xl"
          textAlign="center"
        >
          <VStack spacing={6}>
            <Heading size="lg" color="teal.600">
              ✅ FAQS Created Successfully!
            </Heading>
            <Text>Your FAQS has been added to the system.</Text>
            <Button colorScheme="teal" onClick={handleCreateFAQS}>
              Create Another FAQs
            </Button>
            <Button variant="outline" onClick={handleViewDashboard}>
              View Dashboard
            </Button>
          </VStack>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
