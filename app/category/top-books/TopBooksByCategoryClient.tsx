"use client";

import React, { useState } from "react";
import { Box, Heading, useDisclosure } from "@chakra-ui/react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CategoryGrid, { Category } from "./CategoryGrid";
import EditTopBooksModal from "./EditTopBooksModal";
import { User } from "../../../lib/auth";

type Props = {
  user: User;
};

export default function TopBooksByCategoryClient({ user }: Props) {
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
