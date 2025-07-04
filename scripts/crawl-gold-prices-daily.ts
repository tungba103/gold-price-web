import axios, { AxiosResponse } from 'axios';
import * as cheerio from 'cheerio';
import { PrismaClient } from '@prisma/client';

// Types
interface GoldPriceData {
  today: {
    buy: number;
    sell: number;
  };
}

interface GoldData {
  [company: string]: GoldPriceData;
}

/**
 * Extract first number from text
 */
function extractFirstNumber(text: string): number {
  const match = text.match(/\d[\d,.]*/);
  if (match) {
    // Remove commas for thousands separator
    return parseFloat(match[0].replace(/,/g, ''));
  }
  return 0;
}

/**
 * Scrape gold prices from 24h.com.vn
 * 
 * @param date - Date in format YYYY-MM-DD. If not provided, uses today's date.
 * @returns Promise<GoldData | null> - Dictionary containing gold price data
 */
async function getGoldPrices(date: string): Promise<GoldData | null> {

  const url = `https://www.24h.com.vn/gia-vang-hom-nay-c425.html?ngaythang=${date}`;
  
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1'
  };

  try {
    const response: AxiosResponse = await axios.get(url, { 
      headers, 
      timeout: 10000 
    });

    const $ = cheerio.load(response.data);
    
    // Find the gold price table
    const goldTable = $('.gia-vang-search-data-table');
    
    if (goldTable.length === 0) {
      console.log('No gold price data found on the page.');
      return null;
    }

    // Extract gold price data
    const goldData: GoldData = {};
    const rows = goldTable.find('tr');

    rows.each((i, row) => {
      const cols = $(row).find('td');
      const companyName = $(cols[0]).text().trim();
        
      if (companyName && companyName !== '') {
          try {
            const buyToday = extractFirstNumber($(cols[1]).text());
            const sellToday = extractFirstNumber($(cols[2]).text());
            
            goldData[companyName] = {
              today: {
                buy: buyToday * 1000,
                sell: sellToday * 1000,
              },
            };
          } catch (error) {
            console.log(`Error processing data for ${companyName}: ${error}`);
          }
      }
    });

    return goldData;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(`Error fetching data: ${error.message}`);
    } else {
      console.log(`Error parsing data: ${error}`);
    }
    return null;
  }
}

// Initialize Prisma Client
const prisma = new PrismaClient();

/**
 * Save gold price data to database using Prisma ORM
 */
async function saveToPrisma(goldData: GoldData, date: string): Promise<void> {
  try {
    // Create an array of gold price records
    const goldPriceRecords = Object.entries(goldData).map(([company, data]) => ({
      company,
      date: new Date(date),
      buyPrice: data.today.buy,
      sellPrice: data.today.sell,
    }));

    await prisma.goldPrice.createMany({
      data: goldPriceRecords,
      skipDuplicates: true,
    });

    console.log('Gold price data saved to database');

  } catch (error) {
    console.error('Error saving to database with Prisma:', error);
    throw error;
  }
}

/**
 * Clean up Prisma client connection
 */
async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
}

/**
 * Main function to run the gold price scraper
 */
async function crawlGoldPricesDaily(): Promise<void> {
  try {
    console.log('Gold Price Scraper for 24h.com.vn');
    console.log('='.repeat(40));
    
    const selectedDate = new Date().toISOString().split('T')[0];
    
    console.log('Date:',selectedDate);
    
    // Get gold prices for the selected date
    const goldData = await getGoldPrices(selectedDate);
    
    if (goldData) {
      // Save to database using Prisma
      await saveToPrisma(goldData, selectedDate);
    }
  } catch (error) {
    console.error('Error in main function:', error);
  } finally {
    // Always disconnect Prisma client
    await disconnectPrisma();
  }
}

async function crawlAllGoldPrices(): Promise<void> {
  try {
    console.log('Gold Price Scraper for 24h.com.vn');
    console.log('='.repeat(40));
    
    // Loop from 2025-01-01 to 2025-07-01 (inclusive)
    const startDate = new Date('2025-01-24');
    const endDate = new Date('2025-06-01');

    for (
      let currentDate = new Date(startDate);
      currentDate <= endDate;
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      const selectedDate = currentDate.toISOString().split('T')[0];
      console.log('Date:', selectedDate);

      // Get gold prices for the selected date
      const goldData = await getGoldPrices(selectedDate);

      if (goldData) {
        // Save to database using Prisma
        await saveToPrisma(goldData, selectedDate);
      }
    }
  } catch (error) {
    console.error('Error in main function:', error);
  } finally {
    // Always disconnect Prisma client
    await disconnectPrisma();
  }
}

export { crawlGoldPricesDaily, crawlAllGoldPrices };