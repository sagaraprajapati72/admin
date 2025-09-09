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
  Text,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { User } from "../../../lib/auth";

type AudienceFormData = {
  name: string;
};

type Props = {
  user: User;
};

export default function CreateAudienceClient({ user }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AudienceFormData>();

  const toast = useToast();
  const router = useRouter();

  const onSubmit = async (data: AudienceFormData) => {
    try {
      const response = await fetch("/api/admin/audiences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name }),
      });

      if (!response.ok) throw new Error("Failed to create audience");

      router.push("/audiences/created");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while creating the audience.",
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
        <Box maxW="800px" mx="auto" my={8} p={6} bg="white" borderRadius="lg" boxShadow="xl">
          <Heading as="h1" mb={2} size="lg" textAlign="center">
            Create Audience
          </Heading>
          <Text mb={4} textAlign="center" color="gray.600">
            Logged in as: <b>{user.name}</b> 
          </Text>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4} align="stretch">
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Audience Name</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter audience name"
                  {...register("name", { required: "Audience name is required" })}
                />
                {errors.name && <FormErrorMessage>{errors.name.message}</FormErrorMessage>}
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
