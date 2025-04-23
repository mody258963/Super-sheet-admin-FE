// project-imports
import { NavActionType } from 'config';
import { handleCoachDialog } from 'api/admin-panel';

// assets
import {
  Add,
  Link1,
  KyberNetwork,
  Messages2,
  Calendar1,
  Kanban,
  Profile2User,
  Bill,
  UserSquare,
  ShoppingBag
} from '@wandersonalwes/iconsax-react';

// types
import { NavItemType } from 'types/menu';

// icons
const icons = {
  applications: KyberNetwork,
  chat: Messages2,
  calendar: Calendar1,
  kanban: Kanban,
  customer: Profile2User,
  invoice: Bill,
  profile: UserSquare,
  ecommerce: ShoppingBag,
  add: Add,
  link: Link1
};

// ==============================|| MENU ITEMS - APPLICATIONS ||============================== //

const applications: NavItemType = {
  id: 'group-applications',
  title: 'applications',
  icon: icons.applications,
  type: 'group',
  children: [
  
    {
      id: 'customer',
      title: 'Coach',
      type: 'item',
      url: '/apps/customer/customer-list',
      icon: icons.customer,
      actions: [
        {
          type: NavActionType.FUNCTION,
          label: 'Add Coach',
          function: () => handleCoachDialog(true),
          icon: icons.add
        }
      ]
    },
   
  ]
};

export default applications;
