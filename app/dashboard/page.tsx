// app/page.tsx (Landing Page)
'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Heading, SimpleGrid, Button } from '@chakra-ui/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DashboardCard from '../components/DashboardCard';

export default function LandingPage() {
  // Dummy metrics — replace with your actual data or API calls
  const metrics = {
    bookCount: 120,
    audienceCount: 250,
    partnerCount: 15,
    revenue: '$12K',
  };

  return (
    <Box>
      <Header />

      <Box p={8} bg="gray.50" minH="calc(100vh - 128px)">
        <Heading mb={6} color="gray.800">
          Dashboard
        </Heading>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={6}>
          <DashboardCard title="Books" value={metrics.bookCount} helpText="Total number of books" />
          <DashboardCard title="Audiences" value={metrics.audienceCount} helpText="Registered audiences" />
          <DashboardCard title="Partners" value={metrics.partnerCount} helpText="Onboarded partners" />
          <DashboardCard title="Revenue" value={metrics.revenue} helpText="Monthly revenue" />
        </SimpleGrid>

      </Box>

      <Footer />
    </Box>
  );
}
