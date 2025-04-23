// assets
import { Book1, I24Support, Profile2User, KyberNetwork, Add } from '@wandersonalwes/iconsax-react';
import { NavActionType } from 'config';

// Import custom handlers for each section
import { 
  handleUserDialog, 
  handlePackageDialog, 
  handleSubscriptionDialog 
} from 'api/admin-panel';

// types
import { NavItemType } from 'types/menu';

// icons
const icons = {
  dashboard: Book1,
  applications: KyberNetwork,
  membership: Profile2User,
  helpdesk: I24Support,
  add: Add
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
      type: 'item',
      icon: icons.membership,
      url: '/admin-panel/users/list',
      actions: [
        {
          type: NavActionType.FUNCTION,
          label: 'Add User',
          function: () => handleUserDialog(true),
          icon: icons.add
        }
      ]
    },
    {
      id: 'package',
      title: 'Package',
      type: 'item',
      url: '/admin-panel/packege/list',
      icon: icons.membership,
      actions: [
        {
          type: NavActionType.FUNCTION,
          label: 'Add Package',
          function: () => handlePackageDialog(true),
          icon: icons.add
        }
      ]
    },
    {
      id: 'membership',
      title: 'Subscription',
      type: 'item',
      url: '/admin-panel/membership/list',
      icon: icons.membership,
      actions: [
        {
          type: NavActionType.FUNCTION,
          label: 'Add Subscription',
          function: () => handleSubscriptionDialog(true),
          icon: icons.add
        }
      ]
    },
  ]
};

export default adminPanel;
