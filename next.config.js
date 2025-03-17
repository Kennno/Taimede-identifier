/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ["flagcdn.com", "images.unsplash.com", "api.dicebear.com"],
  },
};

if (process.env.NEXT_PUBLIC_TEMPO) {
  nextConfig["experimental"] = {
    // NextJS 14.1.3 to 14.2.11:
    swcPlugins: [[require.resolve("tempo-devtools/swc/0.90"), {}]],
  };
}

module.exports = nextConfig;
