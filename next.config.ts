import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  async rewrites() {
    return [
      
      // 👇 Book search goes to another service
      {
        source: "/api/booksearch",
        destination: "http://localhost:8081/search",
      },
      {
        source: "/api/genai/book-keywords",
        destination: "http://localhost:8081/api/genai/book-keywords",
      },
      {
        source: "/api/genai/book-descriptions",
        destination: "http://localhost:8081/api/genai/book-description",
      },
      // 👇 everything else still goes to Spring Boot
      {
        source: "/api/:path*",
        destination: "http://localhost:8080/api/:path*",
      },
    ];
  },
};

export default nextConfig;
