'use client';
import React, { useEffect, useState } from 'react';
import { SimpleGrid, Box, Text, Spinner, Center, Image } from '@chakra-ui/react';

export interface Category {
  id: number | string;
  name: string;
  imageUrl?: string;
}

interface CategoryGridProps {
  onSelectCategory: (category: Category) => void;
}

export default function CategoryGrid({ onSelectCategory }: CategoryGridProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        const data: Category[] = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <SimpleGrid columns={[1, 2, 3]} spacing={6}>
      {categories.map((cat) => (
        <Box
          key={cat.id}
          p={4}
          borderWidth="1px"
          borderRadius="lg"
          cursor="pointer"
          _hover={{ shadow: 'md' }}
          onClick={() => onSelectCategory(cat)}
          textAlign="center"
        >
          {cat.imageUrl && (
            <Image
              src={cat.imageUrl}
              alt={cat.name}
              boxSize="150px"
              objectFit="cover"
              mx="auto"
              mb={4}
              borderRadius="md"
            />
          )}
          <Text fontSize="xl" fontWeight="bold">
            {cat.name}
          </Text>
        </Box>
      ))}
    </SimpleGrid>
  );
}
