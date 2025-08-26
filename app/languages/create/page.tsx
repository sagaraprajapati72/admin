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

type LanguageFormData = {
  name: string;
  code: string;
};

export default function CreateLanguagePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LanguageFormData>();
  const toast = useToast();
  const router = useRouter();

  const onSubmit = async (data: LanguageFormData) => {
    // Create FormData object with language details
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("code", data.code);

    try {
      const response = await fetch("/api/admin/languages", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to create language");
      }
      router.push("/languages/created");
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "An error occurred while creating the language.",
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
            Create Language
          </Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4} align="stretch">
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Language Name</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter language name"
                  {...register("name", { required: "Language name is required" })}
                />
                {errors.name && (
                  <FormErrorMessage>{errors.name.message}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={!!errors.code}>
                <FormLabel>Language Code</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter language code"
                  {...register("code", { required: "Language code is required" })}
                />
                {errors.code && (
                  <FormErrorMessage>{errors.code.message}</FormErrorMessage>
                )}
              </FormControl>
              <Button type="submit" colorScheme="teal" width="full">
                Create Language
              </Button>
            </VStack>
          </form>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
