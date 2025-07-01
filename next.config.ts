import type { NextConfig } from "next";
import { crawlGoldPricesDaily } from "./scripts/crawl-gold-prices-daily";

crawlGoldPricesDaily(); 

const nextConfig: NextConfig = {
  /* config options here */
  
};

export default nextConfig;
