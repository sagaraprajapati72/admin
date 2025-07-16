"use client";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Heading,
  useToast,
  VStack,
  Container,
  Text,
  Icon,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { EditIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";

type FAQSFormData = {
  question: string;
  answer: string;
};

export default function CreateFAQSPage() {

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FAQSFormData>();

  const toast = useToast();
 const router = useRouter();
  const onSubmit = async (data: FAQSFormData) => {
    try {
      const res = await fetch("/api/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to create FAQ");
      }

      toast({
        title: "FAQ created",
        description: "Your FAQ was successfully added.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
     router.push("/faqs/created");
      reset(); // Clear the form after successful submit
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="gray.50">
      <Header />
      <Container maxW="lg" py={{ base: 10, md: 16 }} flex="1">
        <Box
          bg="white"
          rounded="lg"
          shadow="lg"
          p={{ base: 6, md: 8 }}
        >
          <Heading size="lg" mb={2} textAlign="center" display="flex" alignItems="center" justifyContent="center" gap={2}>
            <Icon as={EditIcon} color="teal.500" />
            Create New FAQ
          </Heading>
          <Text fontSize="sm" color="gray.600" textAlign="center" mb={6}>
            Provide helpful answers to common questions for ReadersZone users.
          </Text>

          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={5}>
              <FormControl isInvalid={!!errors.question}>
                <FormLabel>Question</FormLabel>
                <Input
                  placeholder="e.g. How do I return books?"
                  {...register("question", { required: "Question is required" })}
                />
                <FormErrorMessage>{errors.question?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.answer}>
                <FormLabel>Answer</FormLabel>
                <Textarea
                  placeholder="Enter the detailed answer here"
                  {...register("answer", { required: "Answer is required" })}
                  resize="vertical"
                />
                <FormErrorMessage>{errors.answer?.message}</FormErrorMessage>
              </FormControl>

              <Button
                colorScheme="teal"
                type="submit"
                isLoading={isSubmitting}
                width="full"
                size="lg"
              >
                Submit FAQ
              </Button>
            </VStack>
          </form>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
}
