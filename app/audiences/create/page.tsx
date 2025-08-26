"use client";

import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

type AudienceFormData = {
  name: string;
};

export default function CreateAudiencePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AudienceFormData>();
  const toast = useToast();
  const router = useRouter();

  const onSubmit = async (data: AudienceFormData) => {
    // Create FormData object for the audience payload
    const formData = new FormData();
    formData.append("name", data.name);

    try {
      const response = await fetch("/api/admin/audiences", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to create audience");
      }
      router.push("/audiences/created");
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "An error occurred while creating the audience.",
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
            Create Audience
          </Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4} align="stretch">
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Audience Name</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter audience name"
                  {...register("name", {
                    required: "Audience name is required",
                  })}
                />
                {errors.name && (
                  <FormErrorMessage>{errors.name.message}</FormErrorMessage>
                )}
              </FormControl>
              <Button type="submit" colorScheme="teal" width="full">
                Create Audience
              </Button>
            </VStack>
          </form>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
