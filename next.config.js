/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    "/api/rag/retrieve": ["./models/**"],
    "/api/rag/answer": ["./models/**"],
    "/api/almendro/answer": ["./models/**"],
  },
};

module.exports = nextConfig;
