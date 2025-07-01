'use client';

import * as React from 'react';
import { IconChartBar, IconDashboard, IconInnerShadowTop, IconListDetails, IconCoin } from '@tabler/icons-react';

import { NavMain } from '@/components/nav-main';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';

const data = {
  navMain: [
    {
      title: 'Gold Price',
      url: 'gold-price',
      icon: IconCoin,
    },
    {
      title: 'VNDIRECT',
      url: '/',
      icon: IconDashboard,
    },
    {
      title: 'VND/USD',
      url: '/',
      icon: IconListDetails,
    },
    {
      title: 'ETH/BTC',
      url: '/',
      icon: IconChartBar,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible='icon'
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className='data-[slot=sidebar-menu-button]:!p-1.5 cursor-pointer'
            >
              <Link href='/'>
                <IconInnerShadowTop className='!size-5' />
                <span className='text-base font-semibold'>tngb103</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  );
}
