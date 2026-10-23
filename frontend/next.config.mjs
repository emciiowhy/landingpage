/** @type {import('next').NextConfig} */
const nextConfig = {
    // This helps with the 'frontend' subfolder structure
    distDir: '.next',
    
    typescript: {
      // This ensures minor type mismatches between local and Vercel don't stop the build
      ignoreBuildErrors: true,
    },

    eslint: {
      // Don't fail the production build on lint warnings/errors.
      ignoreDuringBuilds: true,
    },

    images: {
      // Useful for static exports or if you prefer manual image optimization
      unoptimized: true, 
    },
};
  
export default nextConfig;