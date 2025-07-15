"use client";

import { Box, Stat, StatLabel, StatNumber, StatHelpText } from "@chakra-ui/react";

interface DashboardCardProps {
  title: string;
  value: number | string;
  helpText?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, helpText }) => {
  return (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      bg="white"
      shadow="sm"
      _hover={{ shadow: "md", transform: "scale(1.02)", transition: "0.2s" }}
    >
      <Stat>
        <StatLabel fontSize="sm" color="gray.600">{title}</StatLabel>
        <StatNumber fontSize="2xl" fontWeight="bold">{value}</StatNumber>
        {helpText && <StatHelpText fontSize="xs">{helpText}</StatHelpText>}
      </Stat>
    </Box>
  );
};

export default DashboardCard;
