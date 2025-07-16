"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  FormErrorMessage,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

type FAQ = {
  id: number;
  question: string;
  answer: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  faq: FAQ | null;
  onUpdate: (updatedFaq: FAQ) => void;
};

export default function EditFAQModal({ isOpen, onClose, faq, onUpdate }: Props) {
  const toast = useToast();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FAQ>({
    defaultValues: {
      question: "",
      answer: "",
    },
  });

  // Populate form when FAQ changes
  useEffect(() => {
    if (faq) {
      reset({
        question: faq.question,
        answer: faq.answer,
      });
    }
  }, [faq, reset]);

  const onSubmit = async (data: FAQ) => {
    try {
      const res = await fetch(`/api/faqs/${faq?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to update FAQ");
      }

      const updatedFaq = await res.json();
      onUpdate(updatedFaq);
      toast({
        title: "FAQ Updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
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
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit FAQ</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.question}>
                <FormLabel>Question</FormLabel>
                <Input
                  {...register("question", { required: "Question is required" })}
                />
                <FormErrorMessage>{errors.question?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.answer}>
                <FormLabel>Answer</FormLabel>
                <Textarea
                  {...register("answer", { required: "Answer is required" })}
                />
                <FormErrorMessage>{errors.answer?.message}</FormErrorMessage>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} mr={3}>
              Cancel
            </Button>
            <Button type="submit" colorScheme="teal" isLoading={isSubmitting}>
              Update FAQ
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
