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
} from "@chakra-ui/react";
import { FaCalendarAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import MenuCard from "./MenuCard";

type Book = {
  id: string;
  title: string;
  authors: string[];
  borrowedDate: string;
  status: "PICKUP_SCHEDULED" | "PICKED_UP" | "RETURNED";
};

const getStatusColor = (status: Book["status"]) => {
  switch (status) {
    case "PICKUP_SCHEDULED":
      return "orange";
    case "PICKED_UP":
      return "blue";
    case "RETURNED":
      return "green";
    default:
      return "gray";
  }
};

const getStatusLabel = (status: Book["status"]) => {
  switch (status) {
    case "PICKUP_SCHEDULED":
      return "Pending Pickup";
    case "PICKED_UP":
      return "Picked Up";
    case "RETURNED":
      return "Returned";
    default:
      return status;
  }
};

export default function Collected() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(`/api/picked-up`);
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

    fetchBooks();
  }, []);

  return (
    <>
      <MenuCard />
      <Flex minH="100vh" bg="gray.50">
        <Box flex="1" p={6}>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Book Pickup Board
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
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {books.map((book) => (
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
                    {book.status === "PICKED_UP" ? (
                      <Button
                        colorScheme="green"
                        size="sm"
                        onClick={async () => {
                          try {
                            const res = await fetch("/api/collect", {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({ dispatchId: book.id }),
                            });

                            if (res.ok) {
                              setBooks((prev) =>
                                prev.map((b) =>
                                  b.id === book.id
                                    ? { ...b, status: "RETURNED" }
                                    : b
                                )
                              );
                              alert("Book marked as returned.");
                            } else {
                              alert("Failed to update status.");
                            }
                          } catch (err) {
                            console.error("Error marking returned:", err);
                            alert("An error occurred.");
                          }
                        }}
                      >
                        Mark Returned
                      </Button>
                    ) : (
                      <Text fontSize="sm" color="gray.600">
                        —
                      </Text>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Flex>
    </>
  );
}
