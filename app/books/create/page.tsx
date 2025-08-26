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
// import Select from "react-select";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

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

// type Audience = {
//   id: number;
//   targetGroup: string;
// };

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

// Simulated typeahead search for authors.
const fetchAuthors = async (inputValue: string): Promise<Option[]> => {
  try {
    const response = await fetch(
      `/api/public/authors?search=${encodeURIComponent(inputValue)}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch authors");
    }
    const data: { id: number; name: string }[] = await response.json();
    return data.map((author) => ({
      value: author.id,
      label: author.name,
    }));
  } catch (error) {
    console.error("Error fetching authors:", error);
    return [];
  }
};

const fetchAudiences = async (): Promise<Option[]> => {
  try {
    const response = await fetch("/api/public/audiences");
    if (!response.ok) {
      throw new Error("Failed to fetch audiences");
    }
    const data = await response.json();
    return data.map((aud: any) => ({
      value: aud.id,
      label: aud.targetGroup,
    }));
  } catch (error) {
    console.error("Error fetching audiences:", error);
    return [];
  }
};
const fetchCategories = async (): Promise<Option[]> => {
  try {
    const response = await fetch("/api/public/categories");
    const data = await response.json();
    console.log("Fetched categories:", data); // ✅ check if it's an array

    if (!Array.isArray(data)) {
      throw new Error("Invalid categories response format");
    }

    return data.map((cat: any) => ({
      value: cat.id,
      label: cat.name,
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

const fetchLanguages = async (): Promise<Option[]> => {
  try {
    const response = await fetch("/api/public/languages");
    if (!response.ok) {
      throw new Error("Failed to fetch languages");
    }
    const data: { id: number; code: string; name: string }[] =
      await response.json();
    return data.map((lang) => ({
      value: lang.id,
      label: lang.name,
    }));
  } catch (error) {
    console.error("Error fetching languages:", error);
    return [];
  }
};

const fetchGenres = async (): Promise<Option[]> => {
  try {
    const response = await fetch("/api/public/genres");
    if (!response.ok) {
      throw new Error("Failed to fetch genres");
    }
    const data: { id: number; name: string }[] = await response.json();
    return data.map((genre) => ({
      value: genre.id,
      label: genre.name,
    }));
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
};

// FiveImageUploader component: provides 5 fixed image upload slots with file size validation.
type FiveImageUploaderProps = {
  onImagesChange: (files: (File | null)[]) => void;
};

const FiveImageUploader: React.FC<FiveImageUploaderProps> = ({
  onImagesChange,
}) => {
  const [images, setImages] = useState<(File | null)[]>([
    null,
    null,
    null,
    null,
    null,
  ]);
  const [previews, setPreviews] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
    null,
  ]);
  const toast = useToast();

  const handleImageChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 1MB per image)
      if (file.size > 1024 * 1024) {
        toast({
          title: "Image too large",
          description: "Each image must be under 1MB.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const updatedImages = [...images];
      updatedImages[index] = file;
      setImages(updatedImages);
      onImagesChange(updatedImages);

      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedPreviews = [...previews];
        updatedPreviews[index] = reader.result as string;
        setPreviews(updatedPreviews);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <VStack spacing={4}>
      <Text>Upload up to 5 images (order will be preserved):</Text>
      <Box display="flex" gap={4}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Box key={index} position="relative">
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              id={`image-upload-${index}`}
              onChange={(e) => handleImageChange(index, e)}
            />
            <Box
              as="label"
              htmlFor={`image-upload-${index}`}
              border="1px dashed"
              borderColor="gray.400"
              borderRadius="md"
              width="100px"
              height="100px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
            >
              {previews[index] ? (
                <Image
                  src={previews[index]!}
                  boxSize="100%"
                  objectFit="cover"
                  borderRadius="md"
                />
              ) : (
                <Text fontSize="sm" color="gray.500">
                  Slot {index + 1}
                </Text>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </VStack>
  );
};

export default function CreateBookPage() {
  const {
    handleSubmit,
    register,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<BookFormData>({
    defaultValues: {
      title: "",
      isbn: "",
      authors: [],       // multi-select → array
      audiences: [],     // multi-select → array
      summary: "",
      language: null,    // single-select → object or null
      publicationDate: "",
      publisher: "",
      price: 0,
      keywords: "",
      genre: [],         // multi-select → array
      category: null     // single-select → object or null
    }
  });
  const [audiences, setAudiences] = useState<Option[]>([]);
  const [languages, setLanguages] = useState<Option[]>([]);
  const [genres, setGenres] = useState<Option[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);
  const toast = useToast();
  const router = useRouter();

  // State for book images from the uploader.
  const [bookImages, setBookImages] = useState<(File | null)[]>([
    null,
    null,
    null,
    null,
    null,
  ]);

  // State for the auto-generation loading indicator.
  const [generating, setGenerating] = useState(false);
  const [generatingKeywords, setGeneratingKeywords] = useState(false);

  useEffect(() => {
    fetchAudiences().then((data) => setAudiences(data));
    fetchLanguages().then((data) => setLanguages(data));
    fetchGenres().then((data) => setGenres(data));
    fetchCategories().then((data) => setCategories(data));
  }, []);

  // Function to call external backend to generate description based on the title.
  const handleAutoGenerate = async () => {
    const title = getValues("title");
    const authors = getValues("authors"); // Array of author objects
    if (!title) {
      toast({
        title: "Title Required",
        description: "Please enter a book title to generate a description.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Extract the author name. You could join multiple authors if needed.
    let authorName = "";
    if (authors && Array.isArray(authors) && authors.length > 0) {
      authorName = authors.map((author) => author.label).join(", ");
    }

    setGenerating(true);
    try {
      // Replace with your external backend service endpoint.
      const response = await fetch("/api/genai/book-descriptions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, authorName }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate description.");
      }
      const data = await response.json();
      // Assume the response contains a 'description' property.
      setValue("summary", data.description);
      toast({
        title: "Description Generated",
        description: "The description has been auto-generated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "An error occurred while generating description.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setGenerating(false);
    }
  };

  // Add this new function in your CreateBookPage component
  const handleAutoGenerateKeywords = async () => {
    const title = getValues("title");
    const authors = getValues("authors");
    const summary = getValues("summary");

    if (!title || !summary) {
      toast({
        title: "Missing Information",
        description: "Please provide both Title and Description to generate keywords.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Extract the author name from your authors field. For multiple authors,
    // you could join them into one string.
    let authorName = "";
    if (authors && Array.isArray(authors) && authors.length > 0) {
      authorName = authors.map((a) => a.label).join(", ");
    }

    setGeneratingKeywords(true);
    try {
      // Replace with your actual endpoint for generating keywords
      const response = await fetch("/api/genai/book-keywords", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, authorName, summary }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate keywords.");
      }
      const data = await response.json();
      // Assume that the response contains a 'keywords' property.
      setValue("keywords", data.keywords);
      toast({
        title: "Keywords Generated",
        description: "The keywords have been auto-generated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "An error occurred while generating keywords.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setGeneratingKeywords(false);
    }
  };

  const onSubmit = async (data: BookFormData) => {
    // Prepare arrays of IDs
    if (!Array.isArray(data.authors)) {
      console.error('❗ authors is not an array:', data.authors);
      return;
    }
    const authorIds = data.authors.map((author) => author.value);
    const audienceIds = data.audiences.map((audience) => audience.value);
    const selectedLanguage = data.language?.value;
    const selectedGenres = data.genre.map((g) => g.value);
    const categoryId = data.category?.value || null;
  console.log({ authorIds, audienceIds, selectedGenres, categoryId });
    // Create the book payload object that matches your backend DTO
    const bookPayload = {
      title: data.title,
      summary: data.summary,
      publicationDate: data.publicationDate, // Expecting YYYY-MM-DD format
      publisher: data.publisher,
      price: data.price,
      keywords: data.keywords,
      languageId: selectedLanguage ? Number(selectedLanguage) : null,
      genreIds: selectedGenres.map(Number),
      audienceIds: audienceIds.map(Number),
      authorIds: authorIds.map(Number),
      isbn: data.isbn,
      categoryId,
    };

    // Create FormData and append the book JSON and images.
    const formData = new FormData();
    formData.append("book", JSON.stringify(bookPayload));

    // Append images (skip null slots)
    bookImages.forEach((file) => {
      if (file) {
        formData.append("images", file);
      }
    });

    console.log("Submitting payload:", bookPayload);
    try {
      const response = await fetch("/api/admin/books", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to create book");
      }
      router.push("/books/created");
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message ||
          "An error occurred while creating the book.",
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
              {/* Title */}
              <FormControl isInvalid={!!errors.title}>
                <FormLabel>Title</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter book title"
                  {...register("title", {
                    required: "Title is required",
                  })}
                />
                {errors.title && (
                  <FormErrorMessage>
                    {errors.title.message}
                  </FormErrorMessage>
                )}
              </FormControl>

              {/* Authors */}
              <FormControl isInvalid={!!errors.authors}>
                <FormLabel>Authors</FormLabel>
                <Controller
                  name="authors"
                  control={control}
                  defaultValue={[]}
                  render={({ field }) => (
                    <ClientOnlySelect
                      instanceId="authors"
                      cacheOptions
                      defaultOptions
                       isMulti
                      loadOptions={fetchAuthors}
                      {...field}
                    />
                  )}
                />
                {errors.authors && (
                  <FormErrorMessage>
                    {(errors.authors as any).message}
                  </FormErrorMessage>
                )}
              </FormControl>

              {/* ISBN */}
              <FormControl isInvalid={!!errors.isbn}>
                <FormLabel>ISBN</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter ISBN"
                  {...register("isbn", {
                    required: "ISBN is required",
                  })}
                />
                {errors.isbn && (
                  <FormErrorMessage>
                    {errors.isbn.message}
                  </FormErrorMessage>
                )}
              </FormControl>

              {/* Publication Date */}
              <FormControl isInvalid={!!errors.publicationDate}>
                <FormLabel>Release Date</FormLabel>
                <Input
                  type="date"
                  placeholder="Select release date"
                  {...register("publicationDate", {
                    required: "Release date is required",
                  })}
                />
                {errors.publicationDate && (
                  <FormErrorMessage>
                    {errors.publicationDate.message}
                  </FormErrorMessage>
                )}
              </FormControl>

              {/* Publisher */}
              <FormControl isInvalid={!!errors.publisher}>
                <FormLabel>Publisher</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter publisher"
                  {...register("publisher", {
                    required: "Publisher is required",
                  })}
                />
                {errors.publisher && (
                  <FormErrorMessage>
                    {errors.publisher.message}
                  </FormErrorMessage>
                )}
                {/* price */}
              </FormControl>
              <FormControl isInvalid={!!errors.price}>
                <FormLabel>Price</FormLabel>
                <Input
                  type="number"
                  placeholder="Enter Price"
                  {...register("price", {
                    required: "Price is required",
                  })}
                />
                {errors.price && (
                  <FormErrorMessage>
                    {errors.price.message}
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={!!errors.category}>
                <FormLabel>Category</FormLabel>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <ClientOnlySelect
                      instanceId="category"
                      cacheOptions
                      defaultOptions
                      loadOptions={fetchCategories}
                      {...field}
                    />
                  )}
                />

                <FormErrorMessage>{errors.category?.message}</FormErrorMessage>
              </FormControl>


              {/* Summary (Book Description) with Auto-Generate */}
              <FormControl isInvalid={!!errors.summary}>
                <FormLabel>Book Summary</FormLabel>
                <Button
                  onClick={handleAutoGenerate}
                  isLoading={generating}
                  colorScheme="blue"
                  size="sm"
                  mb={2}
                >
                  Auto Generate Description
                </Button>
                <Controller
                  name="summary"
                  control={control}
                  rules={{ required: "Summary is required" }}
                  render={({ field }) => (
                    <ReactQuill
                      theme="snow"
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="Enter book summary..."
                    />
                  )}
                />
                {errors.summary && (
                  <FormErrorMessage>
                    {errors.summary.message}
                  </FormErrorMessage>
                )}
              </FormControl>


              {/* Keywords */}
              <FormControl isInvalid={!!errors.keywords}>
                <FormLabel>Keywords</FormLabel>
                <Button
                  onClick={handleAutoGenerateKeywords}
                  isLoading={generatingKeywords}
                  colorScheme="blue"
                  size="sm"
                  mb={2}
                >
                  Auto Generate Keywords
                </Button>
                <Input
                  type="text"
                  placeholder="Enter keywords"
                  {...register("keywords", {
                    required: "Keywords is required",
                  })}
                />
                {errors.keywords && (
                  <FormErrorMessage>
                    {errors.keywords.message}
                  </FormErrorMessage>
                )}
              </FormControl>

              {/* Language */}
              <FormControl isInvalid={!!errors.language}>
                <FormLabel>Book Language</FormLabel>
                <Controller
                  name="language"

                  control={control}
                  render={({ field }) => (
                    <ClientOnlySelect
                      instanceId="language"
                      cacheOptions
                      defaultOptions
                      loadOptions={fetchLanguages}
                      {...field}
                    />
                  )}
                />

                {errors.language && (
                  <FormErrorMessage>
                    {errors.language.message}
                  </FormErrorMessage>
                )}
              </FormControl>

              {/* Genre */}
              <FormControl isInvalid={!!errors.genre}>
                <FormLabel>Genres</FormLabel>
                <Controller
                  name="genre"
                  control={control}
                  defaultValue={[]}
                  render={({ field }) => (
                    <ClientOnlySelect
                      instanceId="genre"
                      cacheOptions
                      defaultOptions
                       isMulti
                      loadOptions={fetchGenres}
                      {...field}
                    />
                  )}
                />

                {errors.genre && (
                  <FormErrorMessage>
                    {errors.genre.message}
                  </FormErrorMessage>
                )}
              </FormControl>

              {/* Audiences */}
              <FormControl isInvalid={!!errors.audiences}>
                <FormLabel>Audiences</FormLabel>
                <Controller
                  name="audiences"
                  control={control}
                  defaultValue={[]}
                  render={({ field }) => (
                    <ClientOnlySelect
                      instanceId="audiences"
                      cacheOptions
                      defaultOptions
                       isMulti
                      loadOptions={fetchAudiences}
                      {...field}
                    />
                  )}
                />

                {errors.audiences && (
                  <FormErrorMessage>
                    {(errors.audiences as any).message}
                  </FormErrorMessage>
                )}
              </FormControl>

              {/* Image Uploader */}
              <FiveImageUploader onImagesChange={(files) => setBookImages(files)} />

              {/* Submit Button */}
              <Button type="submit" colorScheme="teal" width="full">
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
