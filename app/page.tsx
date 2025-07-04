import { SectionCards } from '@/components/section-cards';
import { GoldPriceChart } from './gold-price/components/gold-price-chart';

const Company = {
  SJC: 'SJC',
  BTMC_SJC: 'BTMC SJC',
  PhuQuy_SJC: 'Phú Qúy SJC',
  DOJI_HN: 'DOJI HN',
  PNJ_HN: 'PNJ Hà Nội',
  DOJI_SG: 'DOJI SG',
  PNJ_TPHCM: 'PNJ TP.HCM',
} as const;

export default async function Page() {
  return (
    <div className='flex flex-1 flex-col'>
      <div className='@container/main flex flex-1 flex-col gap-2'>
        <div className='hidden md:flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
          <SectionCards />
        </div>
        <div className='px-2 md:px-6 flex gap-4 mb-2 flex-col md:flex-row'>
          <div className='w-full md:w-1/4'>
            <GoldPriceChart name='SJC' company={Company.SJC} />
          </div>
          <div className='w-full md:w-1/4'>
            <GoldPriceChart name='BTMC SJC' company={Company.BTMC_SJC} />
          </div>
          <div className='w-full md:w-1/4'>
            <GoldPriceChart name='PNJ HN' company={Company.PNJ_HN} />
          </div>
          <div className='w-full md:w-1/4'>
            <GoldPriceChart name='DOJI HN' company={Company.DOJI_HN} />
          </div>
        </div>
      </div>
    </div>
  );
}
