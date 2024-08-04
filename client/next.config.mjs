import { fileURLToPath } from 'url';
import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.(mp3)$/i,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 8192,
            fallback: 'file-loader',
            publicPath: '/_next/static/sounds/',
            outputPath: 'static/sounds/',
            name: '[name].[ext]',
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
