"use client";

import { Box, Button, Heading, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";

// Dummy book type and initial data
type Book = {
  id: number;
  title: string;
  author: string;
};

const dummyBooks: Book[] = [
  { id: 1, title: "Book One", author: "Author A" },
  { id: 2, title: "Book Two", author: "Author B" },
];

export default function BooksListPage() {
  const [books, setBooks] = useState<Book[]>(dummyBooks);

  return (
    <Box p={8}>
      <Heading mb={4}>Books Management</Heading>
      <Link href="/books/create" passHref legacyBehavior>
        <Button as="a" colorScheme="blue" mb={4}>Create New Book</Button>
      </Link>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Title</Th>
            <Th>Author</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {books.map((book) => (
            <Tr key={book.id}>
              <Td>{book.id}</Td>
              <Td>{book.title}</Td>
              <Td>{book.author}</Td>
              <Td>
                <Link href={`/books/${book.id}/edit`} passHref legacyBehavior>
                  <Button as="a" size="sm" colorScheme="green" mr={2}>Edit</Button>
                </Link>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => setBooks((prev) => prev.filter(b => b.id !== book.id))}
                >
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
