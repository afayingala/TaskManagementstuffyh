<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
const authStore= useAuthStore()
const route = useRoute()

// Simulate getting the logged-in user's role (replace with actual auth later)
const role = computed(() => authStore.role)

// Notifications & profile data (placeholder)
const notifications = ref(3)
const userName = computed(() => authStore.email?.split('@')[0] || 'Guest')

// Example data for each dashboard
const employeeMetrics = ref({
  weeklyScore: 0,
  tasksCompleted: { completed: 0, total: 2 },
  onTimeRate: 0
})

const employeeRecentTasks = ref([
  { title: 'Complete UI Design', due: 'Aug 20', status: 'in-progress' },
  { title: 'Code Review', due: 'Aug 21', status: 'pending' },
])

const adminMetrics = ref({
  totalProjects: 2,
  totalTasks: { total: 2, completedThisMonth: 1 },
  averageProductivity: 85,
  companyScore: 90
})

const adminRecentActivity = ref([
  { task: 'Design Homepage Mockup', assignedTo: 'Sarah Johnson', status: 'in-progress' },
  { task: 'Setup Development Environment', assignedTo: 'Mike Chen', status: 'done' },
])
</script>

<template>
  <div>
    <!-- Navbar -->
    <!----<q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-icon name="dashboard" class="q-mr-sm" /> TaskManager
        </q-toolbar-title>
        <div class="text-h4">Dashboard</div>
        <q-space />
        <q-btn flat round icon="notifications">
          <q-badge color="red" floating>{{ notifications }}</q-badge>
        </q-btn>
        <q-avatar class="q-ml-md">{{ userName.charAt(0).toUpperCase() }}</q-avatar>
        <div class="q-ml-sm">{{ userName }}</div>
      </q-toolbar>
    </q-header>
  -->
    <q-page padding>
      <!-- Employee Dashboard -->
      <div v-if="role === 'Employee'">
        <!-- Key Metrics -->
        <div class="metric-cards q-mb-md">
          
          <q-card  class="col">
            <q-card-section class="text-center">
              <div class="row no-wrap items-center justify-center">
              <span class="text-h6">Weekly Score</span>
              <q-icon name="star" size ="24px" class="q-ml-sm" />
            </div>
              <div class="text-h5">{{ employeeMetrics.weeklyScore }}%</div>
            </q-card-section>
          </q-card>
        
          <q-card class="col">
            <q-card-section class="text-center">
              <div class="row no-wrap items-center justify-center">
              <span class="text-h6">Tasks Completed</span>
              <q-icon name="check_circle" size="24px" class ="q-ml-sm" />
            </div>
              <div class="text-h5">{{ employeeMetrics.tasksCompleted.completed }} / {{ employeeMetrics.tasksCompleted.total }}</div>
            </q-card-section>
          </q-card>
          <q-card class="col">
            <q-card-section class="text-center">
              <div class=" row no-wrap items center justify-center">
              <span class="text-h6">On-Time Rate</span>
              <q-icon name ="schedule" size ="24px" class="q-ml-sm" />
            </div>
              <div class="text-h5">{{ employeeMetrics.onTimeRate }}%</div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Recent Activity -->
        <q-card>
          <q-card-section>
            <div class="text-h6">Recent Activity</div>
          </q-card-section>
          <q-separator />
          <q-list>
            <q-item v-for="(task, index) in employeeRecentTasks" :key="index">
              <q-item-section>
                <q-item-label>{{ task.title }}</q-item-label>
                <q-item-label caption>Due: {{ task.due }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-chip color="blue" text-color="white" size="sm">{{ task.status }}</q-chip>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <!-- Administrator Dashboard -->
      <div v-else-if="role === 'Administrator'">
        <!-- Top-Level Metrics -->
        <div class="metric-cards q-mb-md">
          <q-card class="col">
            <q-card-section class="text-center">
              <div class="row no-wrap items-center justify-center">
      <span class="text-h6">Total Projects</span>
      <q-icon name="folder" size="24px" class="q-ml-sm" />
    </div>
              <div class="text-h5">{{ adminMetrics.totalProjects }}</div>
            </q-card-section>
          </q-card>
          <q-card class="col">
            <q-card-section class="text-center">
              <div class="row no-wrap items-center justify-center">
      <span class="text-h6">Total Tasks</span>
      <q-icon name="check_circle" size="24px" class="q-ml-sm" />
    </div>

              <div class="text-h5">{{ adminMetrics.totalTasks.total }}</div>
              <!----<div class="text-caption">{{ adminMetrics.totalTasks.completedThisMonth }} completed this month</div> -->
            </q-card-section>
          </q-card>
        </div>

        <!-- Company Performance -->
        <div class="metric-cards q-mb-md">
          <q-card class="col">
            <q-card-section class="text-center">

              <div class="row no-wrap items-center justify-center">
              <span class="text-h6">Average Productivity</span>
              <q-icon name="insights" size="24px" class="q-ml-sm" />
              </div>
              <div class="text-h5">{{ adminMetrics.averageProductivity }}%</div>
            </q-card-section>
          </q-card>
          <q-card class="col">
            <q-card-section class="text-center">
              <div class="row no-wrap items-center justify-center">
              <span class="text-h6">Overall Company Score</span>
              <q-icon name="star" size ="24px" class="q-ml-sm" />
            </div>
              <div class="text-h5">{{ adminMetrics.companyScore }}</div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Recent Activity -->
        <q-card>
          <q-card-section>
            <div class="text-h6">Recent Activity</div>
            <div class="text-caption">Latest updates from your team</div>
          </q-card-section>
          <q-separator />
          <q-list>
            <q-item v-for="(activity, index) in adminRecentActivity" :key="index">
              <q-item-section>
                <q-item-label>{{ activity.task }}</q-item-label>
                <q-item-label caption>Assigned to: {{ activity.assignedTo }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-chip :color="activity.status === 'done' ? 'green' : 'blue'" text-color="white" size="sm">
                  {{ activity.status }}
                </q-chip>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </q-page>
  </div>
</template>
<style scoped>
/* Modern Dashboard Styling */
.q-page {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  padding: 24px;
}

.q-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.q-toolbar {
  padding: 12px 24px;
  min-height: 70px;
}

.q-toolbar-title {
  font-weight: 700;
  font-size: 20px;
  letter-spacing: -0.025em;
  /*color:#c3cfe2;
  */
}

.q-card {
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  transition: all 0.3s ease;
  overflow: hidden;
}

.q-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.q-card-section {
  padding: 24px;
}

.text-h5 {
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 8px 0;
}

.text-h6 {
  font-weight: 600;
  color: #3c4654;
  margin-bottom: 8px;
  font-size: 16px;
}
.text-h4 {
  font-weight: 600;
  color: #3f4a5a;
  margin-bottom: 8px;
  font-size: 23px;
}

.text-caption {
  color: #94a3b8;
  font-weight: 500;
}

.q-icon {
  color: #667eea;
  filter: drop-shadow(0 2px 4px rgba(102, 126, 234, 0.2));
}

.q-list {
  padding: 0;
}

.q-item {
  padding: 16px 24px;
  border-radius: 0;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
}

.q-item:last-child {
  border-bottom: none;
}

.q-item:hover {
  background: rgba(102, 126, 234, 0.04);
  transform: translateX(4px);
}

.q-item-label {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.q-item-label--caption {
  color: #64748b;
  font-size: 13px;
}

.q-chip {
  border-radius: 20px;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 0.5px;
  padding: 8px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.q-separator {
  background: rgba(0, 0, 0, 0.06);
}

.q-avatar {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

.q-btn {
  border-radius: 12px;
  transition: all 0.2s ease;
}

.q-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.05);
}

.q-badge {
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(244, 67, 54, 0.4);
}

/* Metric card special styling */
.col .q-card-section.text-center {
  position: relative;
  overflow: hidden;
}

.col .q-card-section.text-center::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

/* New CSS to control card size and spacing */
.metric-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px; /* Spacing between cards */
}

.metric-cards .col .q-card {
  flex: 1 1 200px; /* Reduces card size and allows wrapping */
}

/* Fix for existing Quasar gutter classes (optional, but good practice) */
.row.q-col-gutter-md {
  margin-left: -12px;
  margin-right: -12px;
}

.row.q-col-gutter-md > .col {
  padding-left: 12px;
  padding-right: 12px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .q-page {
    padding: 16px;
  }
  
  .q-card-section {
    padding: 20px;
  }
  
  .metric-cards {
    gap: 12px;
  }

  .metric-cards .q-card {
    flex: 1 1 100%; /* Stack on small screens */
  }
}

/* Animation for cards */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.q-card {
  animation: slideInUp 0.4s ease-out;
}

.q-card:nth-child(2) {
  animation-delay: 0.1s;
}

.q-card:nth-child(3) {
  animation-delay: 0.2s;
}

.q-card:nth-child(4) {
  animation-delay: 0.3s;
}
</style>