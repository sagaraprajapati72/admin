// app/login/page.tsx
"use client";

import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  Text,
} from "@chakra-ui/react";

const login = async (username: string, password: string) => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      username,
      password,
    }).toString()
  });

  if (res.ok) {
    window.location.href = "/dashboard"; // cookie set by Spring Security
  } else {
    throw new Error("Login failed");
  }
};

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(username, password);
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
      px={4}
    >
      <Box
        as="form"
        onSubmit={handleSubmit}
        bg="white"
        p={8}
        rounded="xl"
        shadow="md"
        w="100%"
        maxW="sm"
      >
        <VStack spacing={4} align="stretch">
          <Heading size="lg" textAlign="center">
            Login
          </Heading>

          <FormControl isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </FormControl>

          {error && (
            <Text color="red.500" fontSize="sm" textAlign="center">
              {error}
            </Text>
          )}

          <Button
            type="submit"
            colorScheme="red"
            isLoading={loading}
            loadingText="Logging in..."
          >
            Login
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}
