"use client";

import React from "react";
import { Box, Button, VStack, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/auth";

interface Props {
  user: User | null;
}

export default function BookDeletionSuccessClient({ user }: Props) {
  const router = useRouter();

  return (
    <Box flex="1" overflowY="auto" bg="gray.50" p={6}>
      <Box
        maxW="800px"
        mx="auto"
        my={8}
        p={6}
        bg="white"
        borderRadius="lg"
        boxShadow="xl"
        textAlign="center"
      >
        <Heading as="h1" mb={4} size="lg">
          Book Successfully Deleted
        </Heading>

        {user && (
          <Text fontSize="md" mb={6}>
            Hi <b>{user.name}</b>, your book has been removed from the collection.
          </Text>
        )}

        <VStack spacing={4}>
          <Button
            colorScheme="teal"
            width="full"
            onClick={() => router.push("/books/delete")}
          >
            Delete Another
          </Button>
          <Button
            colorScheme="teal"
            variant="outline"
            width="full"
            onClick={() => router.push("/")}
          >
            Dashboard
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}
