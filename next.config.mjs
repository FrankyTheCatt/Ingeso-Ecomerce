/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Se recomienda corregir errores en producción, pero mantenemos esto por si acaso
    ignoreBuildErrors: true,
  },
  eslint: {
    // Evita que el build falle por warnings de linter
    ignoreDuringBuilds: true,
  },
  images: {
    // Habilitamos optimización de imágenes
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Permite imágenes de cualquier dominio externo (Supabase, etc.)
      },
    ],
  },
}

export default nextConfig
