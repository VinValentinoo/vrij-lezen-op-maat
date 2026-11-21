/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Router Cache: Next 14 hergebruikt bezochte dynamische pagina's 30 seconden
    // bij client-side navigatie. Voor pagina's met per-gebruiker data (leeslijst,
    // advies) wil ik altijd verse data, dus die tijd gaat naar 0.
    staleTimes: { dynamic: 0 },
  },
};

module.exports = nextConfig;
