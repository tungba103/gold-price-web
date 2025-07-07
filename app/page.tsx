import { SectionCards } from '@/app/gold-price/components/section-cards';
import { GoldPriceChart } from './gold-price/components/gold-price-chart';
import { COMPANIES } from '../utils/utils';

export default async function Page() {
  return (
    <div className='flex flex-1 flex-col'>
      <div className='@container/main flex flex-1 flex-col gap-2'>
        <div className='flex flex-col md:gap-6 md:py-6'>
          <SectionCards />
        </div>
        <div className='px-2 md:px-6 flex gap-4 mb-2 flex-col md:flex-row'>
          <div className='w-full md:w-1/4'>
            <GoldPriceChart name='PNJ HN' company={COMPANIES.PNJ_HN} />
          </div>
          <div className='w-full md:w-1/4'>
            <GoldPriceChart name='DOJI HN' company={COMPANIES.DOJI_HN} />
          </div>
          <div className='w-full md:w-1/4'>
            <GoldPriceChart name='SJC' company={COMPANIES.SJC} />
          </div>
          <div className='w-full md:w-1/4'>
            <GoldPriceChart name='BTMC SJC' company={COMPANIES.BTMC_SJC} />
          </div>
        </div>
      </div>
    </div>
  );
}
