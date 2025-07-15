"use client";

import { Box, Button, FormControl, FormLabel, Input, Heading, VStack } from "@chakra-ui/react";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";

// Dummy fetch to simulate retrieving book details
const fetchBookById = (id: number) => {
  return { id, title: `Book ${id}`, author: `Author ${id}` };
};

export default function EditBookPage() {
  const router = useRouter();
  const params = useParams();
  const bookId = Number(params.id);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    const book = fetchBookById(bookId);
    setTitle(book.title);
    setAuthor(book.author);
  }, [bookId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Normally, call your API to update the book.
    console.log("Book updated", { bookId, title, author });
    router.push("/books");
    
  };

  return (
    <Box p={8}>
      <Heading mb={4}>Edit Book</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Enter book title" 
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Author</FormLabel>
            <Input 
              value={author} 
              onChange={(e) => setAuthor(e.target.value)} 
              placeholder="Enter author name" 
            />
          </FormControl>
          <Button type="submit" colorScheme="blue">Update Book</Button>
        </VStack>
      </form>
    </Box>
  );
}
