"use client";

import {
  Box,
  Flex,
  Text,
  VStack,
  Badge,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tag,
  Select,
} from "@chakra-ui/react";
import { FaCalendarAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import MenuCard from "./MenuCard";

// Types
type Book = {
  id: string;
  title: string;
  authors: string[];
  borrowedDate: string;
  status: "Pending Dispatch" | "Dispatched";
};

type DeliveryMan = {
  id: string;
  name: string;
  phone: string;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending Dispatch":
      return "orange";
    case "Dispatched":
      return "green";
    default:
      return "gray";
  }
};

export default function DispatchBoardPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [deliveryMen, setDeliveryMen] = useState<DeliveryMan[]>([]);
  const [selectedGuy, setSelectedGuy] = useState<Record<string, string>>({}); // bookId -> deliveryManId

  useEffect(() => {
    const fetchDeliveryMen = async () => {
      try {
        const res = await fetch(`/api/public/deliveryguy`);
        const data = await res.json();
        setDeliveryMen(data);
      } catch (err) {
        console.error("Failed to fetch delivery men:", err);
      }
    };

    const fetchBooks = async () => {
      try {
        const res = await fetch(`/api/admin/loans/pending-dispatch`);
        const dispatchList = await res.json();

        const enriched = await Promise.all(
          dispatchList.map(async (item: any) => {
            try {
              const bookRes = await fetch(`/api/public/books/${item.bookId}`);
              const book = await bookRes.json();

              return {
                id: item.id.toString(),
                title: book.title || `Book #${item.bookId}`,
                authors: (book.authors || []).map((a: any) => a.name) || [],
                borrowedDate: item.borrowedOn,
                status: item.status === "PENDING_DISPATCH" ? "Pending Dispatch" : "Dispatched",
              };
            } catch (error) {
              console.error("Failed to fetch book detail for ID:", item.bookId, error);
              return {
                id: item.id.toString(),
                title: `Book #${item.bookId}`,
                authors: [],
                borrowedDate: item.borrowedOn,
                status: item.status === "PENDING_DISPATCH" ? "Pending Dispatch" : "Dispatched",
              };
            }
          })
        );

        setBooks(enriched);
      } catch (err) {
        console.error("Failed to fetch pending dispatch list:", err);
      }
    };

    fetchDeliveryMen();
    fetchBooks();
  }, []);

  const getDeliveryMan = (id?: string) =>
    deliveryMen.find((dm) => dm.id == id);

  return (
    <><MenuCard/>
    <Flex minH="100vh" bg="gray.50">
      
      <Box flex="1" p={6}>
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Book Dispatch Board
        </Text>

        <Flex gap={4} mb={6}>
          <Button leftIcon={<FaCalendarAlt />} colorScheme="gray">
            Today, Jul 22, 2025
          </Button>
        </Flex>

        <Table variant="simple" bg="white" borderRadius="md" boxShadow="md">
          <Thead bg="gray.100">
            <Tr>
              <Th>Book ID</Th>
              <Th>Title</Th>
              <Th>Borrowed Date</Th>
              <Th>Status</Th>
              <Th>Delivery Person</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {books.map((book) => {
              const assignedId = selectedGuy[book.id] || "";
              const assignedGuy = deliveryMen.find((dm) => dm.id == assignedId);

              return (
                <Tr key={book.id}>
                  <Td>
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold">{book.id}</Text>
                      <Tag size="sm" colorScheme="blue">BOOK</Tag>
                    </VStack>
                  </Td>
                  <Td>
                    <Text fontWeight="medium">{book.title}</Text>
                    <Text fontSize="sm" color="gray.600">{book.authors.join(", ")}</Text>
                  </Td>
                  <Td>
                    {new Date(book.borrowedDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(book.status)}>
                      {book.status}
                    </Badge>
                  </Td>
                  <Td>
                    {book.status === "Pending Dispatch" ? (
                      <>
                        <Select
                          placeholder="Assign Delivery"
                          size="sm"
                          value={assignedId}
                          onChange={(e) =>
                            setSelectedGuy((prev) => ({
                              ...prev,
                              [book.id]: e.target.value,
                            }))
                          }
                        >
                          {deliveryMen.map((dm) => (
                            <option key={dm.id} value={dm.id}>
                              {dm.name} ({dm.phone})
                            </option>
                          ))}
                        </Select>
                        {assignedGuy && (
                          <Box mt={1}>
                            <Text fontSize="sm" fontWeight="medium">
                              Selected: {assignedGuy.name}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              {assignedGuy.phone}
                            </Text>
                          </Box>
                        )}
                      </>
                    ) : (
                      <Box>
                        <Text fontWeight="semibold" fontSize="sm">
                          {assignedGuy?.name || "N/A"}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {assignedGuy?.phone || "N/A"}
                        </Text>
                      </Box>
                    )}
                  </Td>
                  <Td>
                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={async () => {
                        const deliveryGuyId = selectedGuy[book.id];
                        if (!deliveryGuyId) {
                          alert("Please select a delivery person.");
                          return;
                        }

                        console.log("Dispatching book:", book.id);
                        console.log("Selected ID:", deliveryGuyId);
                        const selected = getDeliveryMan(deliveryGuyId);
                        console.log(deliveryMen);
                        console.log(selected);
                        console.log("Selected Name:", selected?.name);
                        console.log("Selected Phone:", selected?.phone);

                        try {
                          const res = await fetch(`/api/admin/dispatch/loan/${book.id}`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              deliveryGuyId
                            }),
                          });

                          if (res.ok) {
                            setBooks((prev) =>
                              prev.map((b) =>
                                b.id === book.id
                                  ? {
                                      ...b,
                                      status: "Dispatched",
                                    }
                                  : b
                              )
                            );
                          } else {
                            alert("Dispatch failed.");
                          }
                        } catch (err) {
                          console.error("Dispatch error:", err);
                          alert("An error occurred.");
                        }
                      }}
                    >
                      Assign
                    </Button>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
    </Flex></>
    
  );
}
