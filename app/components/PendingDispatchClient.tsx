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

// Types
type Book = {
  id: string;
  title: string;
  authors: string[];
  borrowedDate: string;
  status: "Pending Dispatch" | "Dispatched";
  deliveryManId?: string;
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
  const [dispatches, setDispatches] = useState<any[]>([]);
  const [selectedDeliveryGuyMap, setSelectedDeliveryGuyMap] = useState<Record<string, string>>({});

  useEffect(() => {
    // Fetch delivery men
    const fetchDeliveryMen = async () => {
      try {
        const res = await fetch(`/api/delivery-men`);
        const data = await res.json();
        setDeliveryMen(data);
      } catch (err) {
        console.error("Failed to fetch delivery men:", err);
      }
    };

    // Fetch books
    const fetchBooks = async () => {
      try {
        const res = await fetch(`/api/pending-dispatch`);
        const dispatchList = await res.json();
        setDispatches(dispatchList);
        const enriched = await Promise.all(
          dispatchList.map(async (item: any) => {
            try {
              const bookRes = await fetch(`/api/book/${item.bookId}`);
              const book = await bookRes.json();

              return {
                id: item.id.toString(), // delivery ID
                title: book.title || `Book #${item.bookId}`,
                authors: (book.authors || []).map((a: any) => a.name) || [],
                borrowedDate: item.borrwedAt,
                status:
                  item.status === "PENDING_DISPATCH" ? "Pending Dispatch" : "Dispatched",
                deliveryManId: undefined, // Will be set later if needed
              };
            } catch (error) {
              console.error("Failed to fetch book detail for ID:", item.bookId, error);
              return {
                id: item.id.toString(),
                title: `Book #${item.bookId}`,
                authors: [],
                borrowedDate: item.borrwedAt,
                status:
                  item.status === "PENDING_DISPATCH" ? "Pending Dispatch" : "Dispatched",
                deliveryManId: undefined,
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



  const handleDeliveryPersonChange = (bookId: string, deliveryManId: string) => {
    setSelectedDeliveryGuyMap((prev) => ({
      ...prev,
      [bookId]: deliveryManId,
    }));
  };
  const getDeliveryMan = (id?: string) =>
    deliveryMen.find((dm) => dm.id === id);

  return (
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
              const deliveryMan = getDeliveryMan(book.deliveryManId);
              return (
                <Tr key={book.id}>
                  <Td>
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold">{book.id}</Text>
                      <Tag size="sm" colorScheme="blue">
                        BOOK
                      </Tag>
                    </VStack>
                  </Td>
                  <Td>
                    <Text fontWeight="medium">{book.title}</Text>
                    <Text fontSize="sm" color="gray.600">
                      {book.authors.join(", ")}
                    </Text>
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
                      <Select
                        placeholder="Assign Delivery"
                        value={selectedDeliveryGuyMap[book.id] || ""}
                        onChange={(e) => handleDeliveryPersonChange(book.id, e.target.value)}
                        size="sm"
                      >
                        {deliveryMen.map((dm) => (
                          <option key={dm.id} value={dm.id}>
                            {dm.name} ({dm.phone})
                          </option>
                        ))}
                      </Select>

                    ) : (
                      <Box>
                        <Text fontWeight="semibold" fontSize="sm">
                          {deliveryMan?.name}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {deliveryMan?.phone}
                        </Text>
                      </Box>
                    )}
                  </Td>
                  <Td>
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={async () => {
                        if (!selectedDeliveryGuyMap) return;

                        const deliveryGuyId = selectedDeliveryGuyMap[book.id];
                        
                           const body = JSON.stringify({
                            dispatchId: book.id, // ✅ send dispatch ID
                            deliveryGuyId, // ✅ send delivery guy ID
                          });
                             
                          console.log("body:"+ body);
                        const response = await fetch("/api/dispatchBook", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: body,
                        });
                         
                        const data = await response.json();
                        console.log("Dispatch update response:", data);
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
    </Flex>
  );
}
