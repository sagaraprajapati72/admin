"use client";

import React from "react";
import { Box, Heading, SimpleGrid } from "@chakra-ui/react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DashboardCard from "./DashboardCard";
import { User } from "@/lib/auth";

type Metrics = {
  bookCount: number;
  audienceCount: number;
  partnerCount: number;
  revenue: string;
};

type Props = {
  user: User;
  metrics: Metrics;
};

export default function LandingPageClient({ user, metrics }: Props) {
  return (
    <Box>
      <Header />

      <Box p={8} bg="gray.50" minH="calc(100vh - 128px)">
        <Heading mb={6} color="gray.800">
          Welcome, {user.name}!
        </Heading>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={6}>
          <DashboardCard
            title="Books"
            value={metrics.bookCount}
            helpText="Total number of books"
          />
          <DashboardCard
            title="Audiences"
            value={metrics.audienceCount}
            helpText="Registered audiences"
          />
          <DashboardCard
            title="Partners"
            value={metrics.partnerCount}
            helpText="Onboarded partners"
          />
          <DashboardCard
            title="Revenue"
            value={metrics.revenue}
            helpText="Monthly revenue"
          />
        </SimpleGrid>
      </Box>

      <Footer />
    </Box>
  );
}
