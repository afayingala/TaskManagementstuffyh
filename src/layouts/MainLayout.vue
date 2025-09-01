<template>
  <q-layout view="hHh LpR fFf">
    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat round dense icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" />
        
        <q-toolbar-title class="row items-center q-gutter-sm">
          <q-avatar size="28px" color="white" text-color="primary">TM</q-avatar>
          <q-icon name="" class="q-mr-sm" /> TaskManager
        </q-toolbar-title>

        <div class="text-h5 q-mx-auto">{{ currentPageTitle }}</div>

        <q-space />

        <q-btn flat round icon="notifications" class="q-mr-md">
          <q-badge color="red" floating>{{ notifications }}</q-badge>
        </q-btn>

        <q-btn flat round>
          <q-avatar size="32px" color="orange" text-color="white">
            {{ userName?.charAt(0).toUpperCase() || 'A' }}
          </q-avatar>
          <div class="q-ml-sm text-body2">{{ userName || 'User' }}</div>
          
          <q-menu anchor="bottom right" self="top right">
            <q-list style="min-width: 180px">
              <q-item clickable v-ripple to="/profile"><q-item-section>Profile</q-item-section></q-item>
              <q-separator />
              <q-item clickable v-ripple @click="logout"><q-item-section>Logout</q-item-section></q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :mini="isSubpage"
      show-if-above
      bordered
      :width="240"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <template v-for="item in navItems" :key="item.to">
            <q-item v-if="item.to === '/logout'" clickable v-ripple @click="logout">
              <q-item-section avatar><q-icon :name="item.icon" /></q-item-section>
              <q-item-section>{{ item.label }}</q-item-section>
            </q-item>
            <q-item v-else :to="item.to" clickable v-ripple>
              <q-item-section avatar><q-icon :name="item.icon" /></q-item-section>
              <q-item-section>{{ item.label }}</q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth.store'

const auth = useAuthStore()
auth.loadFromStorage()
const route = useRoute()
const router = useRouter()
//const auth = useAuthStore()
const notifications = ref(3)
const email = ref(route.query.user as string || 'guest@example.com')
const userName = ref(email.value.split('@')[0]) // take everything before @



if (!auth.session) {
  auth.session = {
    email: route.query.email as string,
    role: route.query.role as 'Employee' | 'Administrator',
    remember: route.query.remember === 'true'
  }
}

const leftDrawerOpen = ref(true)

// Sidebar collapsed on subpages (anything not exactly /dashboard)
const isSubpage = computed(() => route.path !== '/dashboard')

const initials = computed(() => {
  const email = auth.session?.email || 'U'
  return email.charAt(0).toUpperCase()
})

// Role-based nav
const adminNav = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/adtasks', label: 'Task Manager', icon: 'checklist' },
  { to: '/dashboard/project-manager', label: 'Project Management', icon: 'folder' },
  { to: '/employees', label: 'Employees', icon: 'groups' },
  { to: '/reports', label: 'Reports', icon: 'insights' },
  { to: '/profile', label: 'Profile', icon: 'person' },
  { to: '/logout', label: 'Logout', icon: 'logout' }
]

const employeeNav = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/dashboard/tasks', label: 'My Tasks', icon: 'checklist' },
  { to: '/dashboard/plan-week', label: 'Weekly Planner', icon: 'event' },
  { to: '/dashboard/performance', label: 'My Performance', icon: 'show_chart' },
  { to: '/dashboard/profile', label: 'Profile', icon: 'person' },
  { to: '/logout', label: 'Logout', icon: 'logout' }
]

const navItems = computed(() => (auth.role === 'Administrator' ? adminNav : employeeNav))

// Dynamic page title based on current route
const currentPageTitle = computed(() => {
  const allNavItems = [...adminNav, ...employeeNav]
  const currentItem = allNavItems.find(item => item.to === route.path)
  return currentItem?.label || 'Dashboard'
})

function logout () {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
/* Header styling to match the image */
.q-header {
  background: linear-gradient(135deg, #4d50ff 0%, #536dfe 100%) !important;
  box-shadow: 0 2px 12px rgba(124, 77, 255, 0.3);
}

.q-toolbar {
  min-height: 64px;
  padding: 0 24px;
}

/* Sidebar styling */
.q-drawer {
  background: #fafafa;
  border-right: 1px solid rgba(0, 0, 0, 0.06);
}

.q-drawer .q-list {
  padding: 16px 8px;
}

.q-item {
  border-radius: 12px;
  margin: 4px 0;
  min-height: 48px;
  padding: 8px 16px;
  transition: all 0.2s ease;
}

.q-item:hover {
  background: rgba(25, 118, 210, 0.08);
  transform: translateX(4px);
}

.q-item.router-link-active {
  background: linear-gradient(135deg, #1976d2 0%, #1e88e5 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
}

.q-item.router-link-active .q-icon {
  color: white;
}

.q-item-section.avatar {
  min-width: 40px;
}

.q-icon {
  color: #666;
  transition: color 0.2s ease;
}

.q-item:hover .q-icon {
  color: #1976d2;
}

.q-avatar {
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.q-btn {
  border-radius: 8px;
  transition: all 0.2s ease;
}

.q-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.q-toolbar-title {
  font-size: 18px;
  letter-spacing: -0.025em;
  font-weight: 600;
}

.q-menu {
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.q-menu .q-item {
  margin: 0;
  border-radius: 8px;
  padding: 12px 16px;
}

.q-page-container {
  background: #f8f9fa;
}

/* Smooth transitions */
* {
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

/* Mini drawer styling */
.q-drawer--mini .q-item {
  justify-content: center;
  padding: 8px;
}

.q-drawer--mini .q-item-section + .q-item-section {
  display: none;
}
</style>