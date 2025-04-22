// assets
import { Book1, I24Support, Profile2User, KyberNetwork } from '@wandersonalwes/iconsax-react';

// types
import { NavItemType } from 'types/menu';

// icons
const icons = {
  dashboard: Book1,
  applications: KyberNetwork,
  membership: Profile2User,
  helpdesk: I24Support
};

// ==============================|| MENU ITEMS - ADMIN PANEL ||============================== //

const adminPanel: NavItemType = {
  id: 'group-admin-panel',
  title: 'admin-panel',
  icon: icons.applications,
  type: 'group',
  children: [
    {
      id: 'users',
      title: 'Users',
      type: 'collapse',
      icon: icons.membership,
      children: [
        {
          id: 'users-list',
          title: 'list',
          type: 'item',
          url: '/admin-panel/users/list',
          breadcrumbs: false
        },
      ]
    },
    {
      id: 'membership',
      title: 'Subscription',
      type: 'collapse',
      icon: icons.membership,
      children: [
        {
          id: 'membership-list',
          title: 'list',
          type: 'item',
          url: '/admin-panel/membership/list',
          breadcrumbs: false
        },
        {
          id: 'membership-pricing',
          title: 'pricing',
          type: 'item',
          url: '/admin-panel/membership/price',
          breadcrumbs: false
        },
        {
          id: 'membership-setting',
          title: 'setting',
          type: 'item',
          url: '/admin-panel/membership/setting',
          breadcrumbs: false
        }
      ]
    },
  ]
};

export default adminPanel;
