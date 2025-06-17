import Contacts from '@/components/pages/Contacts';
import Deals from '@/components/pages/Deals';
import Pipeline from '@/components/pages/Pipeline';
import Analytics from '@/components/pages/Analytics';

export const routes = {
  contacts: {
    id: 'contacts',
    label: 'Contacts',
    path: '/contacts',
    icon: 'Users',
    component: Contacts
  },
  deals: {
    id: 'deals',
    label: 'Deals',
    path: '/deals',
    icon: 'Briefcase',
    component: Deals
  },
  pipeline: {
    id: 'pipeline',
    label: 'Pipeline',
    path: '/pipeline',
    icon: 'BarChart3',
    component: Pipeline
  },
  analytics: {
    id: 'analytics',
    label: 'Analytics',
    path: '/analytics',
    icon: 'TrendingUp',
    component: Analytics
  }
};

export const routeArray = Object.values(routes);
export default routes;