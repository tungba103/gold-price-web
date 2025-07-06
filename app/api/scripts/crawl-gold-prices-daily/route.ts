import { crawlGoldPricesDaily } from '@/scripts/crawl-gold-prices-daily';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await crawlGoldPricesDaily();
    return NextResponse.json({ message: 'Gold prices crawled and saved successfully.' });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to crawl gold prices.' }, { status: 500 });
  }
}