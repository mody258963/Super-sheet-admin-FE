// assets
import { Story, Fatrows, PresentionChart } from '@wandersonalwes/iconsax-react';

// types
import { NavItemType } from 'types/menu';

// icons
const icons = {
  widgets: Story,
  statistics: Story,
  data: Fatrows,
  chart: PresentionChart
};

// ==============================|| MENU ITEMS - WIDGETS ||============================== //

const widget: NavItemType = {
  id: 'group-widget',
  title: 'widgets',
  icon: icons.widgets,
  type: 'group',
  children: [


  ]
};

export default widget;
