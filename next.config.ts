const createNextIntPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntPlugin();
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "product.hstatic.net" },
      { protocol: "https", hostname: "siliconz.vn" },
      { protocol: "https", hostname: "images-na.ssl-images-amazon.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "images-cdn.ubuy.qa" },
      { protocol: "https", hostname: "www.lego.com" },
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com" },
      { protocol: "https", hostname: "pos.nvncdn.com" },
      { protocol: "https", hostname: "freshlypicked.com" },
      { protocol: "https", hostname: "www.westernchief.com" },
      { protocol: "https", hostname: "contents.mediadecathlon.com" }
    ],
  },
}

export default withNextIntl(nextConfig);