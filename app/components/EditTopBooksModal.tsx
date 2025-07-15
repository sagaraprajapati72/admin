'use client';
import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Tag,
  TagLabel,
  TagCloseButton,
  Flex,
  Box,
  VStack,
} from '@chakra-ui/react';
import { Category } from './CategoryGrid';

interface Book {
  id: number | string;
  title: string;
}

interface BookSuggestion {
  id: number;
  description: string;
}


interface EditTopBooksModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category;
}

export default function EditTopBooksModal({ isOpen, onClose, category }: EditTopBooksModalProps) {
  const [selectedBooks, setSelectedBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [suggestions, setSuggestions] = useState<BookSuggestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!category) return;
    async function fetchTopBooks() {
      try {
        const res = await fetch(`/api/categories/${category.id}/top-books`);
        const data: Book[] = await res.json();
        setSelectedBooks(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchTopBooks();
  }, [category]);

  useEffect(() => {
    if (!searchTerm) {
      setSuggestions([]);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/booksearch?q=${encodeURIComponent(searchTerm)}`);
        const data: BookSuggestion[] = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error(err);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

 // Map suggestion to Book and add
  const addBook = (s: BookSuggestion) => {
    const book: Book = { id: s.id, title: s.description };
    if (!selectedBooks.find(b => b.id === book.id)) {
      setSelectedBooks(prev => [...prev, book]);
    }
    setSearchTerm('');
  };

  const removeBook = (id: number | string) => {
    setSelectedBooks(selectedBooks.filter((b) => b.id !== id));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await fetch('/api/categories/top-books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId: category.id,
          bookIds: selectedBooks.map((b) => b.id),
        }),
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Top Books for {category.name}</ModalHeader>
        <ModalBody>
          <VStack align="start" spacing={4}>
            <Box>
              <Flex wrap="wrap">
                {selectedBooks.map((book) => (
                  <Tag key={book.id} m={1} size="md" borderRadius="full">
                    <TagLabel>{book.title}</TagLabel>
                    <TagCloseButton onClick={() => removeBook(book.id)} />
                  </Tag>
                ))}
              </Flex>
            </Box>
            <Box width="100%">
              <Input
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Box mt={2} borderWidth="1px" borderRadius="md" maxH="200px" overflowY="auto">
                  {suggestions.map((s) => (
                    <Box
                      key={s.id}
                      p={2}
                      _hover={{ bg: 'gray.100' }}
                      cursor="pointer"
                       onClick={() => addBook(s)}
                    >
                      {s.description}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose} mr={3} disabled={loading}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleSave} isLoading={loading}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
