// logging 옵션으로 api fetch등의 작업 시 진행 상황/상태를 시각적으로 확인할 수 있음

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    taint: true,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    remotePatterns: [
      {
        hostname: "avatars.githubusercontent.com",
      },
      {
        hostname: "imagedelivery.net",
      },
    ],
  },
};

export default nextConfig;
