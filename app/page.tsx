import { GoldPriceChart } from './gold-price/components/gold-price-chart';
import { COMPANIES } from '../utils/utils';

export default async function Page() {
  return (
    <div className='flex flex-1 flex-col'>
      <div className='@container/main flex flex-1 flex-col gap-2 mx-4 md:mx-16 lg:mx-52'>
        {/* <div className='flex flex-col md:gap-6 md:py-6'>
          <SectionCards />
        </div> */}
        <div className='px-2 md:px-6 flex gap-4 mb-2 flex-col md:flex-row'>
          <div className='w-full'>
            <GoldPriceChart
              name='SJC'
              company={COMPANIES.SJC}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
