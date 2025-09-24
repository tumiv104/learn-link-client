const createNextIntPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntPlugin();
import type { NextConfig } from "next";

const nextConfig: NextConfig = {

}

export default withNextIntl(nextConfig);