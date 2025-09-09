"use client";

import React, { useEffect, useState } from "react";
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
import AsyncSelect from "react-select/async";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

type CreateBookClientProps = {
  user: any; // Adjust type if you have User type defined
};

function ClientOnlySelect(props: any) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null;
  return <AsyncSelect {...props} />;
}

type Option = {
  value: number | string;
  label: string;
};

type BookFormData = {
  title: string;
  isbn: string;
  authors: Option[];
  audiences: Option[];
  summary: string;
  language: Option | null;
  publicationDate: string;
  publisher: string;
  price: number;
  keywords: string;
  genre: Option[];
  category: Option | null;
};

export default function CreateBookClient({ user }: CreateBookClientProps) {
  const {
    handleSubmit,
    register,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<BookFormData>({
    defaultValues: {
      title: "",
      isbn: "",
      authors: [],
      audiences: [],
      summary: "",
      language: null,
      publicationDate: "",
      publisher: "",
      price: 0,
      keywords: "",
      genre: [],
      category: null,
    },
  });

  const [bookImages, setBookImages] = useState<(File | null)[]>([
    null,
    null,
    null,
    null,
    null,
  ]);
  const toast = useToast();
  const router = useRouter();

  // --- Example fetch functions (implement yours) ---
  const loadAuthors = async (inputValue: string) => {
    const res = await fetch(`/api/admin/authors?search=${inputValue}`);
    const data = await res.json();
    return data.map((a: any) => ({ value: a.id, label: a.name }));
  };

  const onSubmit = async (data: BookFormData) => {
    try {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("isbn", data.isbn);
      formData.append("summary", data.summary);
      formData.append("publisher", data.publisher);
      formData.append("publicationDate", data.publicationDate);
      formData.append("price", data.price.toString());
      formData.append("keywords", data.keywords);

      if (data.language) formData.append("language", String(data.language.value));
      if (data.category) formData.append("category", String(data.category.value));

      data.authors.forEach((a, idx) =>
        formData.append(`authors[${idx}]`, String(a.value))
      );
      data.audiences.forEach((a, idx) =>
        formData.append(`audiences[${idx}]`, String(a.value))
      );
      data.genre.forEach((g, idx) =>
        formData.append(`genre[${idx}]`, String(g.value))
      );

      bookImages.forEach((file, idx) => {
        if (file) {
          formData.append("images", file); // backend must accept array of "images"
        }
      });

      const response = await fetch("/api/admin/books", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to create book");

      toast({
        title: "Book created",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push("/books/created");
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "An error occurred while creating the book.",
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
            Create Book
          </Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4} align="stretch">
              <FormControl isInvalid={!!errors.title}>
                <FormLabel>Title</FormLabel>
                <Input {...register("title", { required: "Title is required" })} />
                <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
              </FormControl>
              {/* Add other form controls for isbn, authors, etc. */}
              <Button type="submit" colorScheme="red" mt={4}>
                Create Book
              </Button>
            </VStack>
          </form>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
