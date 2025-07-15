'use client';
import React, { useState } from 'react';
import { Box, Heading, useDisclosure } from '@chakra-ui/react';
import CategoryGrid, { Category } from '../../components/CategoryGrid';
import EditTopBooksModal from '../../components/EditTopBooksModal';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSelect = (category: Category) => {
    setSelectedCategory(category);
    onOpen();
  };

  return (
    <Box>
      <Header />
      <Box p={8}>
        <Heading mb={6}>Manage Top Books by Category</Heading>
        <CategoryGrid onSelectCategory={handleSelect} />

        {selectedCategory && (
          <EditTopBooksModal
            isOpen={isOpen}
            onClose={onClose}
            category={selectedCategory}
          />
        )}
      </Box>
      <Footer />
    </Box>
  );
}