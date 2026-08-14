/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    "/api/rag/retrieve": ["./models/**"],
    "/api/rag/answer": ["./models/**"],
  },
};

module.exports = nextConfig;
