// period-selector.tsx
'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type PeriodOptions = '7days' | '1month' | '1year' | '5years' | '10years' | 'all';

interface PeriodSelectorProps {
  selectedPeriod: PeriodOptions;
  onPeriodChange: (period: PeriodOptions, fromDate: Date | null, toDate: Date | null) => void;
}

export function PeriodSelector({ selectedPeriod, onPeriodChange }: PeriodSelectorProps) {

  const handlePeriodChange = (value: PeriodOptions) => {
    const today = new Date();
    let fromDate: Date | null = null;

    switch (value) {
      case '7days':
        fromDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '1month':
        fromDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '1year':
        fromDate = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      case '5years':
        fromDate = new Date(today.getTime() - 5 * 365 * 24 * 60 * 60 * 1000);
        break;
      case '10years':
        fromDate = new Date(today.getTime() - 10 * 365 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
        fromDate = null;
        break;
      default:
    }

    onPeriodChange(value, fromDate, today);
  };

  return (
    <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Period" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="7days">7 days</SelectItem>
          <SelectItem value="1month">1 month</SelectItem>
          <SelectItem value="1year">1 year</SelectItem>
          <SelectItem value="5years">5 years</SelectItem>
          <SelectItem value="10years">10 years</SelectItem>
          <SelectItem value="all">All time</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}