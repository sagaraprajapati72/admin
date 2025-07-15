"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Heading,
  Textarea
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

type CategoryFormData = {
  name: string;
  icon: string;
  description: string;
};

export default function CreateLanguagePage() {
  const { register, handleSubmit } = useForm<CategoryFormData>();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const toast = useToast();
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      toast({
        title: "Image too large",
        description: "Image must be under 1MB.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setImage(file);
  };

  const onSubmit = async (data: CategoryFormData) => {

    // Build the author payload object
    const categoryPayload = {
      name: data.name,
      icon: data.icon,
      description: data.description
    };

    // Create FormData and append JSON payload and image
    const formData = new FormData();
    formData.append("category", JSON.stringify(categoryPayload));
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to create category");
      }
      router.push("/category/created");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while creating the category.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />
      <Box flex="1" p={6} bg="gray.50">
        <Box
          maxW="600px"
          mx="auto"
          bg="white"
          p={6}
          borderRadius="md"
          boxShadow="md"
        >
          <Heading size="md" mb={4} textAlign="center">
            Create Category
          </Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Category Name</FormLabel>
                <Input {...register("name")} placeholder="Enter Category Name" />
              </FormControl>

              <FormControl>
                <FormLabel>Icon Keyword</FormLabel>
                <Input {...register("icon")} placeholder="Enter Icon Keyword" />
              </FormControl>


              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  {...register("description")}
                  placeholder="Enter Description"
                  resize="vertical" // or "none", "horizontal", "both" depending on your preference
                />
              </FormControl>
              <FormControl>
                <FormLabel textAlign="center">Upload Image</FormLabel>
                <Box
                  position="relative"
                  width="120px"
                  height="120px"
                  border="2px dashed #CBD5E0"
                  borderRadius="md"
                  cursor="pointer"
                  overflow="hidden"
                  mx="auto"  // centers horizontally
                >
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    position="absolute"
                    top={0}
                    left={0}
                    width="100%"
                    height="100%"
                    opacity={0}
                    cursor="pointer"
                  />
                  {preview ? (
                    <img
                      src={preview}
                      alt="Selected"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <Box
                      position="absolute"
                      top="50%"
                      left="50%"
                      transform="translate(-50%, -50%)"
                      color="#A0AEC0"
                      fontSize="sm"
                      textAlign="center"
                      pointerEvents="none"
                    >
                      Click to upload
                    </Box>
                  )}
                </Box>
              </FormControl>


              <Button type="submit" colorScheme="teal" width="full">
                Submit
              </Button>
            </VStack>
          </form>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
