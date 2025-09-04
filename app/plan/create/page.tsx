"use client";

import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

// ✅ Match backend DTO
type PlanFormData = {
  name: string;
  maxQuota: number;
  monthlyPrice: number;
  bookPriceRange: number;
  deposit: number;
  planDescription: { value: string }[];
};

export default function CreatePlanPage() {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<PlanFormData>({
    defaultValues: {
      planDescription: [{ value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "planDescription",
  });

  const toast = useToast();
  const router = useRouter();

  const onSubmit = async (data: PlanFormData) => {
    console.log("📦 Submitted form data:", data);

    // ✅ transform planDescription into string[]
    const payload = {
      name: data.name,
      maxQuota: data.maxQuota,
      monthlyPrice: data.monthlyPrice,
      bookPriceRange: data.bookPriceRange,
      deposit: data.deposit,
      planDescription: data.planDescription.map((d) => d.value),
    };

    try {
      const response = await fetch("/api/admin/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        toast({
          title: "❌ Failed to create plan",
          description: result.error || "Something went wrong.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      toast({
        title: "✅ Plan Created",
        description: "The subscription plan has been created successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      router.push("/plan/created");
    } catch (err: any) {
      toast({
        title: "⚠️ Network Error",
        description: err.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />
      <Box flex="1" bg="gray.50" p={6}>
        <Box
          maxW="800px"
          mx="auto"
          my={8}
          p={6}
          bg="white"
          borderRadius="lg"
          boxShadow="xl"
        >
          <Heading as="h1" size="lg" textAlign="center" mb={6}>
            Create Subscription Plan
          </Heading>

          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4} align="stretch">
              {/* Plan Name */}
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Plan Name</FormLabel>
                <Input
                  placeholder="Enter plan name"
                  {...register("name", { required: "Plan name is required" })}
                />
                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
              </FormControl>

              {/* Monthly Price */}
              <FormControl isInvalid={!!errors.monthlyPrice}>
                <FormLabel>Monthly Price (₹)</FormLabel>
                <Input
                  type="number"
                  {...register("monthlyPrice", {
                    required: "Monthly price is required",
                    valueAsNumber: true,
                  })}
                />
                <FormErrorMessage>
                  {errors.monthlyPrice?.message}
                </FormErrorMessage>
              </FormControl>

              {/* Max Quota */}
              <FormControl isInvalid={!!errors.maxQuota}>
                <FormLabel>Max Book Quota</FormLabel>
                <Input
                  type="number"
                  {...register("maxQuota", {
                    required: "Max quota is required",
                    valueAsNumber: true,
                  })}
                />
                <FormErrorMessage>
                  {errors.maxQuota?.message}
                </FormErrorMessage>
              </FormControl>

              {/* Book Price Range */}
              <FormControl isInvalid={!!errors.bookPriceRange}>
                <FormLabel>Book Price Range (₹)</FormLabel>
                <Input
                  type="number"
                  {...register("bookPriceRange", {
                    required: "Book price range is required",
                    valueAsNumber: true,
                  })}
                />
                <FormErrorMessage>
                  {errors.bookPriceRange?.message}
                </FormErrorMessage>
              </FormControl>

              {/* Deposit */}
              <FormControl isInvalid={!!errors.deposit}>
                <FormLabel>Deposit (₹)</FormLabel>
                <Input
                  type="number"
                  {...register("deposit", {
                    required: "Deposit is required",
                    valueAsNumber: true,
                  })}
                />
                <FormErrorMessage>{errors.deposit?.message}</FormErrorMessage>
              </FormControl>

              {/* Plan Description (dynamic) */}
              <FormControl>
                <FormLabel>Plan Description</FormLabel>
                {fields.map((field, index) => (
                  <Box key={field.id} display="flex" gap={2}>
                    <Input
                      {...register(`planDescription.${index}.value` as const, {
                        required: "Description is required",
                      })}
                      placeholder={`Description ${index + 1}`}
                    />
                    <Button
                      onClick={() => remove(index)}
                      colorScheme="red"
                      variant="outline"
                      size="sm"
                    >
                      Remove
                    </Button>
                  </Box>
                ))}
                <Button
                  mt={2}
                  onClick={() => append({ value: "" })}
                  colorScheme="teal"
                  size="sm"
                >
                  + Add Description
                </Button>
              </FormControl>

              <Button type="submit" colorScheme="teal" width="full">
                Create Plan
              </Button>
            </VStack>
          </form>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
