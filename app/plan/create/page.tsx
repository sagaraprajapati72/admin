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

// ✅ Type definition
type PlanFormData = {
    name: string;
    monthlyPrice: number;
    yearlyPrice: number;
    maxBookQuota: number;
    planDetails: { value: string }[]; // ⬅️ each detail is an object with a 'value' key
};

export default function CreatePlanPage() {
    const {
        handleSubmit,
        register,
        control,
        formState: { errors },
    } = useForm<PlanFormData>({
        defaultValues: {
            planDetails: [{ value: "" }],
        },
    });

    // ✅ useFieldArray to manage dynamic fields
    const { fields, append, remove } = useFieldArray({
        control,
        name: "planDetails",
    });

    const toast = useToast();
    const router = useRouter();

    const onSubmit = async (data: PlanFormData) => {
          console.log("📦 Submitted form data:", data);
        const payload = {
            ...data,
            planDetails: data.planDetails, // already a string[]
        };

        try {
            const response = await fetch("/api/plan", {
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
                            <FormControl isInvalid={!!errors.name}>
                                <FormLabel>Plan Name</FormLabel>
                                <Input
                                    placeholder="Enter plan name"
                                    {...register("name", { required: "Plan name is required" })}
                                />
                                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                            </FormControl>

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

                            <FormControl isInvalid={!!errors.yearlyPrice}>
                                <FormLabel>Yearly Price (₹)</FormLabel>
                                <Input
                                    type="number"
                                    {...register("yearlyPrice", {
                                        required: "Yearly price is required",
                                        valueAsNumber: true,
                                    })}
                                />
                                <FormErrorMessage>
                                    {errors.yearlyPrice?.message}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={!!errors.maxBookQuota}>
                                <FormLabel>Max Book Quota</FormLabel>
                                <Input
                                    type="number"
                                    {...register("maxBookQuota", {
                                        required: "Max book quota is required",
                                        valueAsNumber: true,
                                    })}
                                />
                                <FormErrorMessage>
                                    {errors.maxBookQuota?.message}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Plan Details</FormLabel>
                                {fields.map((field, index) => (
                                    <Box key={field.id} display="flex" gap={2}>
                                        <Input
                                            {...register(`planDetails.${index}.value` as const, {
                                                required: "Detail is required",
                                            })}
                                            placeholder={`Detail ${index + 1}`}
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
                                    + Add Detail
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
