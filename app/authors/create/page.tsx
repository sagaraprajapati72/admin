"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
  useToast,
  Image,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

// Dynamically load ReactQuill
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

type AuthorFormData = {
  name: string;
  biography: string;
  education: string;
  awards: string;
};

// Custom Toast Renderer
const showCustomToast = (
  toast: ReturnType<typeof useToast>,
  title: string,
  message: string,
  color: string
) => {
  toast({
    render: () => (
      <Box
        color="white"
        bg={color}
        px={6}
        py={4}
        borderRadius="lg"
        boxShadow="lg"
        fontSize="md"
        fontWeight="medium"
      >
        {title}
        <Text fontSize="sm" mt={2}>{message}</Text>
      </Box>
    ),
    duration: 5000,
    isClosable: true,
    position: "top",
  });
};

// Image uploader component
const SingleImageUploader: React.FC<{ onImageChange: (file: File | null) => void }> = ({
  onImageChange,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const toast = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        showCustomToast(toast, "❌ Image too large", "The image must be under 1MB.", "red.500");
        return;
      }
      onImageChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <VStack spacing={4}>
      <Text>Upload Author's Photo:</Text>
      <Box display="flex" gap={4}>
        <Box position="relative">
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            id="author-image-upload"
            onChange={handleImageChange}
          />
          <Box
            as="label"
            htmlFor="author-image-upload"
            border="1px dashed"
            borderColor="gray.400"
            borderRadius="md"
            width="150px"
            height="150px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
          >
            {preview ? (
              <Image src={preview} boxSize="100%" objectFit="cover" borderRadius="md" />
            ) : (
              <Text fontSize="sm" color="gray.500">Upload Photo</Text>
            )}
          </Box>
        </Box>
      </Box>
    </VStack>
  );
};

export default function CreateAuthorPage() {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<AuthorFormData>();

  const [authorImage, setAuthorImage] = useState<File | null>(null);
  const toast = useToast();
  const router = useRouter();

  const onSubmit = async (data: AuthorFormData) => {
    const authorPayload = {
      name: data.name,
      biography: data.biography,
      education: data.education,
      awards: data.awards,
    };

    const formData = new FormData();
    formData.append("author", JSON.stringify(authorPayload));
    if (authorImage) {
      formData.append("image", authorImage);
    }

    try {
      const response = await fetch("/api/admin/authors", {
        method: "POST",
        body: formData,
      });

      const resData = await response.json();

      if (!response.ok) {
        showCustomToast(toast, "❌ Failed to Create Author", resData?.error || "Something went wrong.", "red.500");
        return;
      }

      showCustomToast(toast, "✅ Author Created", "The author was created successfully!", "green.500");
      router.push("/authors/created");

    } catch (error: any) {
      showCustomToast(toast, "⚠️ Network Error", error?.message || "Unexpected error occurred.", "orange.500");
    }
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />
      <Box flex="1" overflowY="auto" bg="gray.50" p={6}>
        <Box maxW="800px" mx="auto" my={8} p={6} bg="white" borderRadius="lg" boxShadow="xl">
          <Heading as="h1" mb={6} size="lg" textAlign="center">
            Create Author
          </Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4} align="stretch">
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Name</FormLabel>
                <Input type="text" placeholder="Enter author's name" {...register("name", { required: "Name is required" })} />
                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.biography}>
                <FormLabel>Biography</FormLabel>
                <Controller
                  name="biography"
                  control={control}
                  rules={{ required: "Biography is required" }}
                  render={({ field }) => (
                    <ReactQuill theme="snow" value={field.value || ""} onChange={field.onChange} placeholder="Enter biography..." />
                  )}
                />
                <FormErrorMessage>{errors.biography?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.education}>
                <FormLabel>Education</FormLabel>
                <Input type="text" placeholder="Enter education" {...register("education", { required: "Education is required" })} />
                <FormErrorMessage>{errors.education?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.awards}>
                <FormLabel>Awards & Achievement</FormLabel>
                <Input type="text" placeholder="Enter awards & achievements" {...register("awards", { required: "Awards & Achievement is required" })} />
                <FormErrorMessage>{errors.awards?.message}</FormErrorMessage>
              </FormControl>

              <SingleImageUploader onImageChange={(file) => setAuthorImage(file)} />

              <Button type="submit" colorScheme="teal" width="full">
                Create Author
              </Button>
            </VStack>
          </form>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
