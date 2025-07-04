'use client';
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { PeriodOptions, PeriodSelector } from './period-selector';
import { useState, useEffect, useCallback } from 'react';
import { TrendingUp } from 'lucide-react';

export const description = 'A linear line chart';

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

interface IProps {
  name: string;
  company: string;
}

interface GoldPriceData {
  id: number;
  company: string;
  date: Date;
  buyPrice: number;
  sellPrice: number;
}

export function GoldPriceChart({ name, company }: IProps) {
  const today = new Date(new Date().toISOString().split('T')[0]);
  const sevenDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [fromDate, setFromDate] = useState<Date | null>(sevenDaysAgo);
  const [toDate, setToDate] = useState<Date | null>(today);

  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOptions>('1month');

  const [goldPrices, setGoldPrices] = useState<GoldPriceData[]>([]);
  const [trendUpPercent, setTrendUpPercent] = useState<number>();

  // Function to fetch gold prices
  const fetchGoldPrices = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        company: company,
        ...(fromDate && { fromDate: fromDate.toISOString() }),
        ...(toDate && { toDate: toDate.toISOString() }),
      });

      const response = await fetch(`/api/gold-prices?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch gold prices');
      }

      const data = await response.json();
      const formattedData = data.map((price: GoldPriceData) => ({
        date: new Date(price.date).toISOString().split('T')[0],
        'Buy Price': price.buyPrice,
        'Sell Price': price.sellPrice,
      }));

      setGoldPrices(formattedData);
      const delta = (data[data.length - 1].sellPrice * 100) / data[0].sellPrice - 100;
      setTrendUpPercent(Number(delta.toFixed(2)));
    } catch (err) {
      console.error('Error fetching gold prices:', err);
    }
  }, [company, fromDate, toDate]);

  useEffect(() => {
    fetchGoldPrices();
    console.log('useEffect fetchGoldPrices');
  }, [company, fromDate, toDate, fetchGoldPrices]);

  const handlePeriodChange = (period: PeriodOptions, fromDate: Date | null, toDate: Date | null) => {
    setSelectedPeriod(period);
    setFromDate(fromDate);
    setToDate(toDate);
  };

  return (
    <Card>
      <CardHeader>
        <div className='flex justify-between items-center'>
          <div className='flex flex-col gap-1'>
            <CardTitle>{name}</CardTitle>
            <CardDescription>
              {fromDate?.toLocaleDateString() || ''} - {toDate?.toLocaleDateString() || ''}
            </CardDescription>
          </div>
          <PeriodSelector
            selectedPeriod={selectedPeriod}
            onPeriodChange={handlePeriodChange}
          />
        </div>
      </CardHeader>
      <CardContent className='px-0'>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={goldPrices}
            margin={{
              left: 12,
              right: 12,
            }}
            width={1000}
            height={600}
          >
            <CartesianGrid vertical={false} />
            <YAxis
              domain={['auto', 'auto']}
              tickFormatter={(value) => {
                if (typeof value !== 'number') return value;
                if (value >= 1_000_000) {
                  return `${(value / 1_000_000).toFixed(2)}M`;
                }
                if (value >= 1_000) {
                  return `${(value / 1_000).toFixed(2)}K`;
                }
                return value.toString();
              }}
            />
            <XAxis
              dataKey='date'
              tickLine={true}
              axisLine={true}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 10)}
            />
            <Line
              dataKey='Buy Price'
              type='linear'
              stroke='#000'
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey='Sell Price'
              type='linear'
              stroke='var(--color-desktop)'
              strokeWidth={2}
              dot={false}
            />
            <Tooltip
              formatter={(value) =>
                (value as number).toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                })
              }
              labelFormatter={(value) => new Date(value).toLocaleDateString('vi-VN')}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        <div className='flex gap-2 leading-none font-medium'>
          Trending up by {trendUpPercent}% <TrendingUp className='h-4 w-4' />
        </div>
        {/* <div className='text-muted-foreground leading-none'>Showing total visitors for the last 6 months</div> */}
      </CardFooter>
    </Card>
  );
}
