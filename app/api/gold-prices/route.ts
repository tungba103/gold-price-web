import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const company = searchParams.get('company');
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');

    if (!company) {
      return NextResponse.json({ error: 'Company parameter is required' }, { status: 400 });
    }

    const whereClause: Prisma.GoldPriceWhereInput = {
      company: company,
    };

    // Add date filtering if provided
    if (fromDate && toDate) {
      whereClause.date = {
        gte: new Date(fromDate),
        lte: new Date(toDate),
      };
    }

    const goldPrices = await prisma.goldPrice.findMany({
      where: whereClause,
      orderBy: {
        date: 'asc',
      },
      select: {
        id: true,
        company: true,
        date: true,
        buyPrice: true,
        sellPrice: true,
      },
    });

    return NextResponse.json(goldPrices);
  } catch (error) {
    console.error('Error fetching gold prices:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}