"use client";

import {
  Box,
  Text,
  Icon,
  Flex,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaTruck, FaBoxOpen, FaClipboardCheck } from "react-icons/fa";
import { useRouter } from "next/navigation";

const menuCards = [
  {
    label: "Pending Dispatch",
    icon: FaTruck,
    bg: "orange.50",
    iconColor: "orange.500",
    href: "/Pending-Dispatch",
  },
  {
    label: "Pickup Requested",
    icon: FaBoxOpen,
    bg: "blue.50",
    iconColor: "blue.500",
    href: "/pickup-requested",
  },
  {

    label: "Collected",
    icon: FaClipboardCheck,
    bg: "green.50",
    iconColor: "green.500",
    href: "/collected",
  },
];

const MenuCard = () => {
  const hoverBg = useColorModeValue("gray.100", "gray.700");
  const router = useRouter();

  const handleClick = (href: string) => {
    router.push(href);
  };

  return (
    <Box p={6}>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
        {menuCards.map((card) => (
          <Box
            key={card.label}
            p={6}
            borderWidth={1}
            rounded="xl"
            bg={card.bg}
            cursor="pointer"
            transition="all 0.2s"
            _hover={{ bg: hoverBg, transform: "translateY(-4px)", boxShadow: "md" }}
            onClick={() => handleClick(card.href)}
          >
            <Flex align="center" mb={3}>
              <Icon as={card.icon} boxSize={6} color={card.iconColor} mr={3} />
              <Text fontSize="lg" fontWeight="bold">
                {card.label}
              </Text>
            </Flex>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default MenuCard;
