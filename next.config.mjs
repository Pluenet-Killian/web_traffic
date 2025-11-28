/** @type {import('next').NextConfig} */
const nextConfig = {
  // Headers requis pour FFmpeg.wasm (SharedArrayBuffer)
  async headers() {
    return [
      {
        // Appliquer uniquement aux pages outils vidéo pour ne pas impacter le reste du site
        source: '/:lang/tools/:slug(video-to-audio|video-mute|gif-maker)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
