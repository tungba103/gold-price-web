import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { prisma } from "@/lib/prisma";

const VOLATILITY = {
  LOW: 'Low',
  MODERATE: 'Moderate',
  HIGH: 'High',
} as const;

export async function SectionCards() {
  const goldPricesThisMonth = await prisma.goldPrice.findMany({
    where: {
      date: {
        gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    },
    orderBy: {
      date: 'asc',
    },
  });
  
  const currentPrice = goldPricesThisMonth[goldPricesThisMonth.length - 1].sellPrice;

  const yesterdayPrice = goldPricesThisMonth[goldPricesThisMonth.length - 2].sellPrice;

  const twentyFourHourChange = (currentPrice - yesterdayPrice);
  const twentyFourHourChangePercent = (twentyFourHourChange / yesterdayPrice) * 100;
  const volatility = twentyFourHourChangePercent > 0.1 ? VOLATILITY.HIGH : twentyFourHourChangePercent > 0.05 ? VOLATILITY.MODERATE : VOLATILITY.LOW;

  const monthlyHigh = Math.max(...goldPricesThisMonth.map(price => price.sellPrice));
  const monthlyLow = Math.min(...goldPricesThisMonth.map(price => price.sellPrice));
  
  const monthlyHighDate = goldPricesThisMonth.find(price => price.sellPrice === monthlyHigh)?.date;
  const monthlyLowDate = goldPricesThisMonth.find(price => price.sellPrice === monthlyLow)?.date;

  return (
    <>
      <div className="hidden md:grid *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Current Gold Price</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {currentPrice.toLocaleString('vi-VN')} VND
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Up from last close <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Live market price
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>24h Change</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {twentyFourHourChange.toLocaleString('vi-VN')} VND
          </CardTitle>
          {<CardAction>
            <Badge variant="outline">
              {twentyFourHourChangePercent > 0 ? <IconTrendingUp /> : <IconTrendingDown />}
              {twentyFourHourChangePercent.toFixed(2)}%
            </Badge>
          </CardAction>}
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Compared to previous day <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Volatility: {volatility}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Monthly High</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {monthlyHigh.toLocaleString('vi-VN')} VND
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              New High
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Highest in 30 days <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Set on {monthlyHighDate?.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Monthly Low</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {monthlyLow.toLocaleString('vi-VN')} VND
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Lowest in 30 days <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">Set on {monthlyLowDate?.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
          </div>
        </CardFooter>
      </Card>
     </div>
     <div className="md:hidden px-2 mb-3">
        <CardDescription>Current Gold Price: <span className="font-semibold text-black">{currentPrice.toLocaleString('vi-VN')} VND</span></CardDescription>
        <CardDescription>24h Change: <span className="font-semibold text-black">{twentyFourHourChange.toLocaleString('vi-VN')} VND</span></CardDescription>
        <CardDescription>Monthly High: <span className="font-semibold text-black">{monthlyHigh.toLocaleString('vi-VN')} VND</span></CardDescription>
        <CardDescription>Monthly Low: <span className="font-semibold text-black">{monthlyLow.toLocaleString('vi-VN')} VND</span></CardDescription>
     </div>
    </>
  )
}
