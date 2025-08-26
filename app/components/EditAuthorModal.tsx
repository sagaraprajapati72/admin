"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import dynamic from "next/dynamic";

// Lazy load ReactQuill
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill/dist/quill.snow.css";

// Dummy image uploader (replace with your working uploader)
const SingleImageUploader = ({ onImageChange }: { onImageChange: (file: File | null) => void }) => (
  <FormControl>
    <FormLabel>Author Image</FormLabel>
    <Input type="file" accept="image/*" onChange={(e) => onImageChange(e.target.files?.[0] || null)} />
  </FormControl>
);

interface EditAuthorModalProps {
  isOpen: boolean;
  onClose: () => void;
  authorId: number;
}

interface AuthorFormValues {
  name: string;
  biography: string;
  education: string;
  awards: string;
}

const EditAuthorModal: React.FC<EditAuthorModalProps> = ({ isOpen, onClose, authorId }) => {
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<AuthorFormValues>();
  const [authorImage, setAuthorImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Fetch author details
  useEffect(() => {
    if (!authorId || !isOpen) return;

    const fetchAuthor = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/public/authors/${authorId}`);
        if (!res.ok) throw new Error("Failed to fetch author");
        const data = await res.json();

        reset({
          name: data.name || "",
          biography: data.biography || "",
          education: data.education || "",
          awards: data.awards || "",
        });
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load author details",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAuthor();
  }, [authorId, isOpen, reset, toast]);

  // Handle update
  const onSubmit = async (values: AuthorFormValues) => {
    try {
     
      const payload = {
      name: values.name,
      biography: values.biography,
      education: values.education,
      awards: values.awards,
      authorId :authorId
     
    }; 

      const res = await fetch(`/api/admin/authors/${authorId}`, {
        method: "PUT",
       body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update author");

      toast({
        title: "Author Updated",
        description: "Author information updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose();
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Author</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {loading ? (
            <Spinner size="lg" />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={4}>
                <FormControl isInvalid={!!errors.name}>
                  <FormLabel>Name</FormLabel>
                  <Input {...register("name", { required: "Name is required" })} />
                  <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.biography}>
                  <FormLabel>Biography</FormLabel>
                  <Controller
                    name="biography"
                    control={control}
                    rules={{ required: "Biography is required" }}
                    render={({ field }) => (
                      <ReactQuill value={field.value} onChange={field.onChange} />
                    )}
                  />
                  <FormErrorMessage>{errors.biography?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.education}>
                  <FormLabel>Education</FormLabel>
                  <Input {...register("education", { required: "Education is required" })} />
                  <FormErrorMessage>{errors.education?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.awards}>
                  <FormLabel>Awards & Achievements</FormLabel>
                  <Input {...register("awards", { required: "Awards are required" })} />
                  <FormErrorMessage>{errors.awards?.message}</FormErrorMessage>
                </FormControl>

              </VStack>
            </form>
          )}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit(onSubmit)} isLoading={loading}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditAuthorModal;
