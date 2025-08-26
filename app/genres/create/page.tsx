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

type GenreFormData = {
  name: string;
};

export default function CreateGenrePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GenreFormData>();
  const toast = useToast();
  const router = useRouter();

  const onSubmit = async (data: GenreFormData) => {

    try {
      const response = await fetch("/api/admin/genres", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to create genre");
      }
      router.push("/genres/created");
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message ||
          "An error occurred while creating the genre.",
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
            Create Genre
          </Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4} align="stretch">
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Genre Name</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter genre name"
                  {...register("name", {
                    required: "Genre name is required",
                  })}
                />
                {errors.name && (
                  <FormErrorMessage>{errors.name.message}</FormErrorMessage>
                )}
              </FormControl>

              <Button type="submit" colorScheme="teal" width="full">
                Create Genre
              </Button>
            </VStack>
          </form>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
