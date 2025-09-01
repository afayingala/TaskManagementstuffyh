import type { RouteRecordRaw } from 'vue-router';
import LoginView from 'src/pages/LoginView.vue';
import SignupView from 'src/pages/SignupView.vue';
import { useAuthStore } from 'src/stores/auth.store';

const routes: RouteRecordRaw[] = [
  { path: '/login', component: LoginView },
  { path: '/signup', component: SignupView },
  { path: '/', redirect: '/login' },
  
    {
      path: '/dashboard',
      component: () => import('layouts/MainLayout.vue'),
      children: [
        { path: '', component: () => import('pages/DashboardPage.vue') },
       // { path: 'task-manager', component: () => import('pages\Administrator\ProjectManagementpage.vue') },
        { path: 'project-manager', component: () => import('pages/Administrator/ProjectManagementpage.vue') },
        //{ path: 'employees', component: () => import('pages\AdministratorEmployeesPage.vue') },
        { path: 'tasks', component: () => import('pages/Employee/TaskPage.vue') },
         //{
        //   path: 'tasks/:id',
        //   name: 'TaskDetail',
        //   component: () => import( 'pages/TaskDetailPage.vue'),
        //    props: true, // allows route params as props if needed
        // },
        {path: 'tasks/:id', name:   'TaskDetail', component: () => import('pages/Employee/TaskDetailPage.vue'), props: true},
        //{ path: 'weekly-planner', component: () => import('pages/WeeklyPlannerPage.vue') },
        { path: 'performance', component: () => import('src/pages/Employee/MyPerformancePage.vue') },
        {
          path: 'profile',
          component: () => import('src/pages/Employee/ProfilePage.vue'),
          beforeEnter: async (to, from, next) => {
            const auth = useAuthStore();
            // Ensure the session is loaded before entering the route
            if (!auth.isAuthenticated) {
              auth.loadFromStorage();
            }
            next();
          }
        },
        
        //{ path: 'settings', component: () => import('pages/SettingsPage.vue') },
        {path: 'plan-week', component: () => import('pages/Employee/PlanWeekPage.vue')},
      ]
    }
    
];

export default routes;