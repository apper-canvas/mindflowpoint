import Home from '@/components/pages/Home';
import Sessions from '@/components/pages/Sessions';
import Journal from '@/components/pages/Journal';
import Progress from '@/components/pages/Progress';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/home',
    icon: 'Home',
    component: Home
  },
  sessions: {
    id: 'sessions',
    label: 'Sessions',
    path: '/sessions',
    icon: 'Play',
    component: Sessions
  },
  journal: {
    id: 'journal',
    label: 'Journal',
    path: '/journal',
    icon: 'BookOpen',
    component: Journal
  },
  progress: {
    id: 'progress',
    label: 'Progress',
    path: '/progress',
    icon: 'TrendingUp',
    component: Progress
  }
};

export const routeArray = Object.values(routes);
export default routes;