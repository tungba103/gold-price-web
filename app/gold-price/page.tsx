import { SectionCards } from '@/app/gold-price/components/section-cards';
import { GoldPriceChart } from './components/gold-price-chart';

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
        <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6  md:flex'>
          <SectionCards />
        </div>
        <div className='px-6 flex gap-4 mb-2'>
          <div className='w-1/3'>
            <GoldPriceChart
              name='SJC'
              company={Company.SJC}
            />
          </div>
          <div className='w-1/3'>
            <GoldPriceChart
              name='BTMC SJC'
              company={Company.BTMC_SJC}
            />
          </div>
          <div className='w-1/3'>
            <GoldPriceChart
              name='Phú Qúy SJC'
              company={Company.PhuQuy_SJC}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
