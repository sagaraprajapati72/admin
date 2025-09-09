"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  VStack,
  FormErrorMessage,
  HStack,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import { useForm, useFieldArray, FieldValues } from "react-hook-form";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
type PlanForm = {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  maxBookQuota: number;
  planDetails: { value: string }[]; // ✅ Array of objects to fix TS inference
};

type Plan = {
  id: number;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  maxBookQuota: number;
  planDetails: string[];
};

type EditPlanModalProps = {
  isOpen: boolean;
  onClose: () => void;
  planId: number | null;
  onUpdate: (updatedPlan: Plan) => void;
};

export default function EditPlanModal({
  isOpen,
  onClose,
  planId,
  onUpdate,
}: EditPlanModalProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<PlanForm>({
    defaultValues: {
      name: "",
      monthlyPrice: 0,
      yearlyPrice: 0,
      maxBookQuota: 0,
      planDetails: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "planDetails",
  });

  useEffect(() => {
    const fetchPlan = async () => {
      if (!planId || !isOpen) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/public/plans/${planId}`);
        if (!res.ok) throw new Error("Failed to load plan");
        const data: Plan = await res.json();

        // Convert string[] to { value: string }[]
        const formData: PlanForm = {
          ...data,
          planDetails: data.planDetails.map((detail) => ({ value: detail })),
        };

        reset(formData);
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [planId, isOpen, reset, toast]);

  const onSubmit = async (data: PlanForm) => {
    try {
      // Convert planDetails back to string[]
      const transformedData: Plan = {
        ...data,
        id: planId!,
        planDetails: data.planDetails.map((item) => item.value),
      };

      const res = await fetch(`/api/admin/plan/${planId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transformedData),
      });

      if (!res.ok) throw new Error("Failed to update plan");

      const updated: Plan = await res.json();
      toast({
        title: "Plan Updated",
        description: `"${updated.name}" updated successfully.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onUpdate(updated);
      setTimeout(() => {
      window.location.reload();
    }, 500);
      onClose();
     
    } catch (err: any) {
      toast({
        title: "Update Error",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Plan</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {loading ? (
            <Spinner />
          ) : (
            <form id="edit-plan-form" onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={4}>
                <FormControl isInvalid={!!errors.name}>
                  <FormLabel>Plan Name</FormLabel>
                  <Input {...register("name", { required: "Name is required" })} />
                  <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.monthlyPrice}>
                  <FormLabel>Monthly Price</FormLabel>
                  <Input
                    type="number"
                    {...register("monthlyPrice", {
                      required: "Monthly price is required",
                      min: { value: 0, message: "Min is 0" },
                    })}
                  />
                  <FormErrorMessage>{errors.monthlyPrice?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.yearlyPrice}>
                  <FormLabel>Yearly Price</FormLabel>
                  <Input
                    type="number"
                    {...register("yearlyPrice", {
                      required: "Yearly price is required",
                      min: { value: 0, message: "Min is 0" },
                    })}
                  />
                  <FormErrorMessage>{errors.yearlyPrice?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.maxBookQuota}>
                  <FormLabel>Max Book Quota</FormLabel>
                  <Input
                    type="number"
                    {...register("maxBookQuota", {
                      required: "Max quota is required",
                      min: { value: 1, message: "At least 1 book" },
                    })}
                  />
                  <FormErrorMessage>{errors.maxBookQuota?.message}</FormErrorMessage>
                </FormControl>

                <FormControl>
                  <FormLabel>Plan Details</FormLabel>
                  {fields.map((field, index) => (
                    <HStack key={field.id} width="100%">
                      <Input
                        {...register(`planDetails.${index}.value` as const, {
                          required: "Required",
                        })}
                        placeholder={`Detail ${index + 1}`}
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        size="sm"
                        aria-label="Remove detail"
                        onClick={() => remove(index)}
                      />
                    </HStack>
                  ))}
                  <Button
                    onClick={() => append({ value: "" })}
                    leftIcon={<AddIcon />}
                    size="sm"
                    mt={2}
                  >
                    Add Detail
                  </Button>
                </FormControl>
              </VStack>
            </form>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="teal"
            type="submit"
            form="edit-plan-form"
            mr={3}
            isLoading={loading}
          >
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
