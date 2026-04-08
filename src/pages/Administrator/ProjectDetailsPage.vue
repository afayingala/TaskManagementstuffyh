<template>
  <div class="project-details-page">
    <!-- Header -->
    <div class="global-page">
      <div class="header-left">
        <h1>{{ project?.name || 'Project Details' }}</h1>
        <p>View, update and track every aspect of this project</p>
      </div>

      <div class="header-right">
        <div class="metrics">
          <div class="metric">
            <span class="number">{{ project?.progress ?? 0 }}%</span>
            <span class="label">Progress</span>
          </div>
          <div class="metric">
            <span class="number">{{ project?.status || '—' }}</span>
            <span class="label">Status</span>
          </div>
          <div class="metric">
            <span class="number">{{ teamCount }}</span>
            <span class="label">Team</span>
          </div>
        </div>

        <div class="actions">
          <button class="btn btn-back" @click="$router.back()">
            <svg class="icon" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Back
          </button>
          <button class="btn btn-edit">
            <svg class="icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 20H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16.5 3.5L19.5 6.5L11 15L8 15L8 12L16.5 3.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Edit
          </button>
        </div>
      </div>
    </div>

    <!-- Main -->
    <div class="main">
      <!-- Overview -->
      <div class="overview card">
        <div class="card-header">
          <svg class="icon" viewBox="0 0 24 24" fill="none">
            <path d="M3 3H10C10.5523 3 11 3.44772 11 4V11C11 11.5523 10.5523 12 10 12H3C2.44772 12 2 11.5523 2 11V4C2 3.44772 2.44772 3 3 3Z"/>
            <path d="M13 3H20C20.5523 3 21 3.44772 21 4V11C21 11.5523 20.5523 12 20 12H13C12.4477 12 12 11.5523 12 11V4C12 3.44772 12.4477 3 13 3Z"/>
            <path d="M13 13H20C20.5523 13 21 13.4477 21 14V21C21 21.5523 20.5523 22 20 22H13C12.4477 22 12 21.5523 12 21V14C12 13.4477 12.4477 13 13 13Z"/>
            <path d="M3 13H10C10.5523 13 11 13.4477 11 14V21C11 21.5523 10.5523 22 10 22H3C2.44772 22 2 21.5523 2 21V14C2 13.4477 2.44772 13 3 13Z"/>
          </svg>
          <h3>Overview</h3>
        </div>

        <div class="card-body">
          <div class="row">
            <div class="label">
              <svg class="icon" viewBox="0 0 24 24" fill="none">
                <path d="M8 6H21M8 12H21M8 18H21M3 6H3.01M3 12H3.01M3 18H3.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Description</span>
            </div>
            <div class="value">{{ project?.description || 'No description provided' }}</div>
          </div>

          <div class="row">
            <div class="label">
              <svg class="icon" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
                <path d="M12 6V12L16.5 14.25" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Status</span>
            </div>
            <div class="value">
              <span :class="['badge', `badge--${project?.status?.toLowerCase().replace(' ', '-')}`]">
                {{ project?.status }}
              </span>
            </div>
          </div>

          <div class="row">
            <div class="label">
              <svg class="icon" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                <path d="M16 2V6M8 2V6M3 10H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Timeline</span>
            </div>
            <div class="value">
              {{ formatDate(project?.startDate) }} → {{ formatDate(project?.endDate) }}
            </div>
          </div>

          <div class="row">
            <div class="label">
              <svg class="icon" viewBox="0 0 24 24" fill="none">
                <path d="M12 1V23M17 5H9.5C8.03154 5 6.94273 6.64504 7.2343 8.07727L8.2343 13.0773C8.52587 14.5095 9.87588 15.5 11.3759 15.5H12C13.6569 15.5 15 14.1569 15 12.5C15 10.8431 13.6569 9.5 12 9.5H7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Budget</span>
            </div>
            <div class="value">
              ${{ project?.budget?.toLocaleString() || '—' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Team -->
      <div class="team card">
        <div class="card-header">
          <svg class="icon" viewBox="0 0 24 24" fill="none">
            <path d="M16 21V19C16 17.8954 15.1046 17 14 17H10C8.89543 17 8 17.8954 8 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <h3>Assigned Team</h3>
        </div>

        <div class="card-body team-grid">
          <div
            class="member"
            v-for="member in project?.team"
            :key="member.name"
          >
            <img
              :src="`https://ui-avatars.com/api/?name=${member.name}&background=7d49ff&color=fff`"
              alt="avatar"
              class="avatar"
            />
            <div class="info">
              <span class="name">{{ member.name }}</span>
              <span class="role">{{ member.role }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  <script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

interface Member {
  id: number
  name: string
  role: string
}

interface Project {
  id: string | number
  name: string
  description?: string | null
  status?: string
  startDate?: string
  endDate?: string
  budget?: number
  progress?: number
  team: Member[]
}

const route = useRoute()
const projectId = route.params.id as string

// Sample projects data - replace with your actual data source
const projects = ref<Project[]>([
  {
    id: 1,
    name: 'Website Redesign',
    description: 'Revamp the UI/UX of the corporate site with modern design principles.',
    status: 'In Progress',
    startDate: '2025-01-10',
    endDate: '2025-03-15',
    budget: 42500,
    progress: 65,
    team: [
      { id: 1, name: 'Jane Doe', role: 'Frontend Dev' },
      { id: 2, name: 'John Smith', role: 'Backend Dev' },
      { id: 3, name: 'Ava Green', role: 'UX Designer' }
    ]
  },
  {
    id: 2,
    name: 'Mobile App Development',
    description: 'Build a cross-platform mobile application.',
    status: 'Not Started',
    startDate: '2025-02-01',
    endDate: '2025-05-01',
    budget: 75000,
    progress: 0,
    team: [
      { id: 4, name: 'Mike Johnson', role: 'Mobile Dev' },
      { id: 5, name: 'Sarah Wilson', role: 'UI Designer' }
    ]
  }
])

const project = ref<Project | null>(null)

onMounted(() => {
  const id = Number(projectId) // Use the variable instead
  project.value = projects.value.find(p => Number(p.id) === id) || null
})

const teamCount = computed(() => project.value?.team?.length || 0)

function formatDate(date?: string) {
  return date
    ? new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : '—'
}

function getStatusColor(p?: Project | null) {
  if (!p) return 'grey' // Handle null/undefined case
  switch (p.status) {
    case 'Completed': return 'green'
    case 'In Progress': return 'blue-6'
    case 'Overdue': return 'red'
    default: return 'grey'
  }
}

</script>
  
<style scoped>
/* page shell */
.project-details-page {
  /* background: linear-gradient(135deg, #e6e9f0 0%, #d4e3f3 100%); */
  padding: 4rem;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, .05);
  padding: 2rem;
}

/* header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
}
.header-left h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 0.5rem 0;
}
.header-left p {
  color: #666;
  margin: 0;
}
.metrics {
  display: flex;
  gap: 2rem;
}
.metric {
  text-align: center;
}
.metric .number {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  display: block;
}
.metric .label {
  font-size: 0.8rem;
  color: #888;
}
.actions {
  display: flex;
  gap: 1rem;
}
.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  border: none;
  transition: transform 0.2s, box-shadow 0.2s;
}
.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}
.btn-back {
  background: #f0f4f9;
  color: #666;
}
.btn-edit {
  background: linear-gradient(45deg, #a4f4e7, #7acaff);
  color: #fff;
}
.icon {
  width: 1rem;
  height: 1rem;
  stroke: currentColor;
}

/* main grid */
.main {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  margin-top: 2rem;
}
.overview {
  flex: 2;
}
.team {
  flex: 1;
}

/* cards */
.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
}
.card-header h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}
.card-body {
  padding: 0;
}

/* rows */
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
  font-size: 0.95rem;
}
.row:last-child {
  border-bottom: none;
}
.label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-weight: 500;
}
.value {
  font-weight: 600;
  color: #333;
}

/* badge */
.badge {
  padding: 0.4rem 1rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #fff;
  background: #7d49ff;
}

/* team grid */
.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1.5rem;
}
.member {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 0.5rem;
}
.name {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}
.role {
  font-size: 0.75rem;
  color: #888;
}
</style>