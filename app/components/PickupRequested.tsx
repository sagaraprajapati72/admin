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

type Book = {
  id: string;
  title: string;
  authors: string[];
  borrowedDate: string;
  status: "PICKUP_SCHEDULED" | "DISPATCHED";
};

type DeliveryMan = {
  id: string;
  name: string;
  phone: string;
};

const getStatusColor = (status: Book["status"]) => {
  switch (status) {
    case "PICKUP_SCHEDULED":
      return "orange";
    case "DISPATCHED":
      return "green";
    default:
      return "gray";
  }
};

const getStatusLabel = (status: Book["status"]) => {
  switch (status) {
    case "PICKUP_SCHEDULED":
      return "Pending Scheduled";
    case "DISPATCHED":
      return "Dispatched";
    default:
      return status;
  }
};

export default function PickupRequested() {
  const [books, setBooks] = useState<Book[]>([]);
  const [deliveryMen, setDeliveryMen] = useState<DeliveryMan[]>([]);
  const [selectedGuy, setSelectedGuy] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchDeliveryMen = async () => {
      try {
        const res = await fetch(`/api/delivery-men`);
        const data = await res.json();
        setDeliveryMen(data);
      } catch (err) {
        console.error("Failed to fetch delivery men:", err);
      }
    };

    const fetchBooks = async () => {
      try {
        const res = await fetch(`/api/pickup-scheduled`);
        const dispatchList = await res.json();

        const enriched = await Promise.all(
          dispatchList.map(async (item: any) => {
            try {
              const bookRes = await fetch(`/api/book/${item.bookId}`);
              const book = await bookRes.json();

              return {
                id: item.id.toString(),
                title: book.title || `Book #${item.bookId}`,
                authors: (book.authors || []).map((a: any) => a.name) || [],
                borrowedDate: item.borrowedOn,
                status: item.status as Book["status"],
              };
            } catch (error) {
              console.error("Failed to fetch book details:", error);
              return {
                id: item.id.toString(),
                title: `Book #${item.bookId}`,
                authors: [],
                borrowedDate: item.borrowedOn,
                status: "PICKUP_SCHEDULED",
              };
            }
          })
        );

        setBooks(enriched);
      } catch (err) {
        console.error("Failed to fetch pickup list:", err);
      }
    };

    fetchDeliveryMen();
    fetchBooks();
  }, []);

  const getDeliveryMan = (id?: string) =>
    deliveryMen.find((dm) => dm.id == id);

  return (
    <>
      <MenuCard />
      <Flex minH="100vh" bg="gray.50">
        <Box flex="1" p={6}>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Book PICKUP_SCHEDULED Board
          </Text>

          <Flex gap={4} mb={6}>
            <Button leftIcon={<FaCalendarAlt />} colorScheme="gray">
              Today, Jul 22, 2025
            </Button>
          </Flex>

          <Table
            variant="simple"
            bg="white"
            borderRadius="md"
            boxShadow="md"
          >
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
                const assignedGuy = deliveryMen.find(
                  (dm) => dm.id == assignedId
                );

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
                        {getStatusLabel(book.status)}
                      </Badge>
                    </Td>
                    <Td>
                      {book.status === "PICKUP_SCHEDULED"&& !assignedId ? (
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

                          try {
                            const res = await fetch("/api/assign-pickup", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                dispatchId: book.id,
                                deliveryGuyId,
                              }),
                            });

                            if (res.ok) {
                              alert("Pickup person assigned successfully.");
                            } else {
                              alert("Failed to assign pickup person.");
                            }
                          } catch (err) {
                            console.error("Assignment error:", err);
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
      </Flex>
    </>
  );
}
