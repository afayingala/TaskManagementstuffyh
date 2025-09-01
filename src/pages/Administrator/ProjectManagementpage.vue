<template>
    <q-page class="project-management-page">
      <div class="hero-section">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">Project Management</h1>
            <p class="hero-subtitle">
              Organize, track, and manage all your projects in one place
            </p>
            <div class="hero-stats">
              <div class="stat-item">
                <span class="stat-number">{{ projects.length }}</span>
                <span class="stat-label">Total Projects</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ activeProjects }}</span>
                <span class="stat-label">Active</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ completedProjects }}</span>
                <span class="stat-label">Completed</span>
              </div>
            </div>
          </div>
          <div class="hero-actions">
            <q-btn
              unelevated
              size="lg"
              icon="add"
              label="New Project"
              color="white"
              text-color="blue-6"
              class="hero-btn"
              @click="showAddProject"
            />
          </div>
        </div>
      </div>
  
      <div class="main-content">
        <div class="toolbar">
          <div class="toolbar-left">
            <q-input
              v-model="searchQuery"
              placeholder="Search projects..."
              outlined
              dense
              class="search-input"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="toolbar-right">
            <q-btn-toggle
              v-model="viewMode"
              :options="[
                { label: 'Table', value: 'table', icon: 'table_rows' },
                { label: 'Grid', value: 'grid', icon: 'grid_view' }
              ]"
              outlined
              color="blue-6"
              class="view-toggle"
            />
          </div>
        </div>
  
        <div v-if="viewMode === 'table'" class="projects-table-container">
          <q-table
            :rows="filteredProjects"
            :columns="columns"
            row-key="id"
            flat
            class="projects-table"
            :pagination="{ rowsPerPage: 10 }"
          >
            <template v-slot:body-cell-name="props">
              <q-td :props="props">
                <div class="project-name-cell">
                  <q-icon name="work" color="blue-6" class="mr-2" />
                  <span class="font-semibold">{{ props.value }}</span>
                </div>
              </q-td>
            </template>
  
            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-chip
                  :color="getStatusColor(props.row)"
                  text-color="white"
                  size="sm"
                  :label="getStatus(props.row)"
                />
              </q-td>
            </template>
  
            <template v-slot:body-cell-progress="props">
              <q-td :props="props">
                <div class="progress-cell">
                  <q-linear-progress
                    :value="getProgress(props.row)"
                    color="blue-6"
                    class="progress-bar"
                  />
                  <span class="progress-text">{{ Math.round(getProgress(props.row) * 100) }}%</span>
                </div>
              </q-td>
            </template>
  
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <div class="action-buttons">
                  <q-btn
                    dense
                    flat
                    round
                    icon="visibility"
                    color="blue-6"
                    @click="viewProject(props.row)"
                    class="action-btn"
                  >
                    <q-tooltip>View Details</q-tooltip>
                  </q-btn>
                  <q-btn
                    dense
                    flat
                    round
                    icon="edit"
                    color="orange-6"
                    @click="editProject(props.row)"
                    class="action-btn"
                  >
                    <q-tooltip>Edit Project</q-tooltip>
                  </q-btn>
                  <q-btn
                    dense
                    flat
                    round
                    icon="delete"
                    color="red-6"
                    @click="confirmDelete(props.row)"
                    class="action-btn"
                  >
                    <q-tooltip>Delete Project</q-tooltip>
                  </q-btn>
                </div>
              </q-td>
            </template>
          </q-table>
        </div>
  
        <div v-else class="projects-grid">
          <div
            v-for="project in filteredProjects"
            :key="project.id"
            class="project-card"
          >
            <div class="project-card-header">
              <div class="project-icon">
                <q-icon name="work" size="24px" color="blue-6" />
              </div>
              <q-chip
                :color="getStatusColor(project)"
                text-color="white"
                size="sm"
                :label="getStatus(project)"
                class="status-chip"
              />
            </div>
            
            <div class="project-card-body">
              <h3 class="project-title">{{ project.name }}</h3>
              <p class="project-description">{{ project.description || 'No description provided' }}</p>
              
              <div class="project-dates">
                <div class="date-item">
                  <q-icon name="event" size="16px" color="green-6" />
                  <span>{{ formatDate(project.startDate) }}</span>
                </div>
                <div class="date-item">
                  <q-icon name="schedule" size="16px" color="orange-6" />
                  <span>{{ formatDate(project.dueDate) }}</span>
                </div>
              </div>
  
              <div class="progress-section">
                <div class="progress-header">
                  <span class="progress-label">Progress</span>
                  <span class="progress-value">{{ Math.round(getProgress(project) * 100) }}%</span>
                </div>
                <q-linear-progress
                  :value="getProgress(project)"
                  color="blue-6"
                  class="project-progress"
                />
              </div>
            </div>
  
            <div class="project-card-actions">
              <q-btn flat dense icon="visibility" color="blue-6" @click="viewProject(project)">
                <q-tooltip>View</q-tooltip>
              </q-btn>
              <q-btn flat dense icon="edit" color="orange-6" @click="editProject(project)">
                <q-tooltip>Edit</q-tooltip>
              </q-btn>
              <q-btn flat dense icon="delete" color="red-6" @click="confirmDelete(project)">
                <q-tooltip>Delete</q-tooltip>
              </q-btn>
            </div>
          </div>
        </div>
  
        <div v-if="projects.length === 0" class="empty-state">
          <q-icon name="work_off" size="80px" color="grey-4" />
          <h3 class="empty-title">No Projects Yet</h3>
          <p class="empty-subtitle">Create your first project to get started</p>
          <q-btn
            unelevated
            color="blue-6"
            icon="add"
            label="Create Project"
            @click="showAddProject"
          />
        </div>
      </div>
  
      <AddProjectForm
  v-model="showAddProjectForm"
  :saving="saving"
  @save="saveNewProject"
  @close="closeAddForm"
/>
  
      <EditProjectForm
       
        v-model="showEditProjectForm"
        :project="selectedProject"
        :saving="saving"
        @save="saveEditedProject"
        @close="closeEditForm"
      />
  
      <q-dialog v-model="showDeleteDialog">
        <q-card class="delete-dialog">
          <q-card-section class="delete-header">
            <q-icon name="warning" color="red" size="32px" />
            <h3 class="delete-title">Delete Project</h3>
          </q-card-section>
          
          <q-card-section>
            <p class="delete-message">
              Are you sure you want to delete <strong>{{ projectToDelete?.name }}</strong>?
              This action cannot be undone.
            </p>
          </q-card-section>
  
          <q-card-actions align="right">
            <q-btn flat label="Cancel" @click="showDeleteDialog = false" />
            <q-btn
              unelevated
              label="Delete"
              color="red"
              @click="deleteProject"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { QTableProps, useQuasar } from 'quasar'
  import AddProjectForm from 'src/components/Administrator/AddProjectForm.vue'
  import EditProjectForm from 'src/components/Administrator/EditProjectForm.vue'
  
  // Main Project interface - handle exactOptionalPropertyTypes
  interface Project {
    id: number
    name: string
    description: string | null | undefined
    startDate: string | null | undefined
    dueDate: string | null | undefined
    status?: string | undefined
    progress?: number | undefined
    priority?: string | undefined
    category?: string | undefined
    notes?: string | undefined
    budget?: number | undefined
  }
  
  // This matches EXACTLY what your AddProjectForm component emits
  interface ProjectData {
    name: string
    description: string | null | undefined
    category: string | null | undefined
    priority: string | null | undefined
    startDate: string | null | undefined
    dueDate: string | null | undefined
    budget: number | null | undefined
  }
  
  const $q = useQuasar()
  
  const projects = ref<Project[]>([
    {
      id: 1,
      name: 'Mobile App Redesign',
      description: 'Complete redesign of the mobile application with modern UI/UX principles',
      startDate: '2025-08-01',
      dueDate: '2025-08-31',
      status: 'In Progress',
      progress: 65,
      priority: 'High',
      category: 'Mobile App',
      budget: 50000
    },
    {
      id: 2,
      name: 'Website Revamp',
      description: 'Overhaul company website with new branding and improved performance',
      startDate: '2025-09-01',
      dueDate: '2025-09-30',
      status: 'Not Started',
      progress: 0,
      priority: 'Medium',
      category: 'Web Development',
      budget: 30000
    },
    {
      id: 3,
      name: 'Database Migration',
      description: 'Migrate legacy database to cloud infrastructure',
      startDate: '2025-07-15',
      dueDate: '2025-08-15',
      status: 'Completed',
      progress: 100,
      priority: 'High',
      category: 'Infrastructure',
      budget: 25000
    },
    {
      id: 4,
      name: 'API Documentation',
      description: 'Create comprehensive API documentation for developers',
      startDate: '2025-08-15',
      dueDate: '2025-09-15',
      status: 'In Progress',
      progress: 30,
      priority: 'Low',
      category: 'Documentation',
      budget: 10000
    }
  ])
  
  const searchQuery = ref('')
  const viewMode = ref('table')
  const showAddProjectForm = ref(false)
  const showEditProjectForm = ref(false)
  const selectedProject = ref<Project | null>(null)
  const saving = ref(false)
  const showDeleteDialog = ref(false)
  const projectToDelete = ref<Project | null>(null)
  
  const columns: QTableProps['columns'] = [
    { name: 'name', label: 'Project Name', field: 'name', sortable: true, align: 'left' },
    { name: 'description', label: 'Description', field: 'description', sortable: false, align: 'left' },
    { name: 'startDate', label: 'Start Date', field: 'startDate', sortable: true, align: 'center' },
    { name: 'dueDate', label: 'Due Date', field: 'dueDate', sortable: true, align: 'center' },
    { name: 'status', label: 'Status', field: 'status', sortable: false, align: 'center' },
    { name: 'progress', label: 'Progress', field: 'progress', sortable: false, align: 'center' },
    { name: 'actions', label: 'Actions', field: 'actions', sortable: false, align: 'right' }
  ]
  
  const filteredProjects = computed(() => {
    if (!searchQuery.value) return projects.value
    
    const query = searchQuery.value.toLowerCase()
    return projects.value.filter(project =>
      project.name.toLowerCase().includes(query) ||
      (project.description && project.description.toLowerCase().includes(query))
    )
  })
  
  const activeProjects = computed(() => {
    return projects.value.filter(project => project.progress !== undefined && project.progress < 100).length;
  })
  
  const completedProjects = computed(() => {
    return projects.value.filter(project => project.progress === 100).length;
  })
  
  function showAddProject() {
    selectedProject.value = null
    showAddProjectForm.value = true
  }
  
  function editProject(project: Project) {
    // Create a deep copy to prevent direct mutation and ensure type compatibility
    selectedProject.value = { ...project }
    showEditProjectForm.value = true
  }
  
  function viewProject(project: Project) {
    $q.dialog({
      title: project.name,
      message: project.description || 'No description available',
      ok: 'Close'
    })
  }
  
  function confirmDelete(project: Project) {
    projectToDelete.value = project
    showDeleteDialog.value = true
  }
  
  async function saveNewProject(projectData: ProjectData) {
    saving.value = true
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    try {
      const newId = projects.value.length ? Math.max(...projects.value.map(p => p.id)) + 1 : 1
      const newProject: Project = { 
        id: newId,
        name: projectData.name,
        description: projectData.description ?? undefined,
        startDate: projectData.startDate ?? undefined,
        dueDate: projectData.dueDate ?? undefined,
        priority: projectData.priority ?? undefined,
        category: projectData.category ?? undefined,
        budget: projectData.budget ?? undefined,
        status: 'Not Started',
        progress: 0,
      }
      projects.value.push(newProject)
      $q.notify({
        type: 'positive',
        message: 'Project created successfully',
        position: 'top'
      })
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Error creating project',
        position: 'top'
      })
    } finally {
      saving.value = false
      closeAddForm()
    }
  }
  
  async function saveEditedProject(projectData: Project) {
    saving.value = true
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
  
    try {
      const index = projects.value.findIndex(p => p.id === projectData.id)
      if (index !== -1) {
        // Ensure the object being saved matches the Project interface
        const updatedProject: Project = {
          ...projectData,
          description: projectData.description ?? undefined,
          startDate: projectData.startDate ?? undefined,
          dueDate: projectData.dueDate ?? undefined,
          status: projectData.status ?? undefined,
          progress: projectData.progress ?? undefined,
          priority: projectData.priority ?? undefined,
          category: projectData.category ?? undefined,
          notes: projectData.notes ?? undefined,
          budget: projectData.budget ?? undefined,
        };
        projects.value[index] = updatedProject
      }
      $q.notify({
        type: 'positive',
        message: 'Project updated successfully',
        position: 'top'
      })
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Error updating project',
        position: 'top'
      })
    } finally {
      saving.value = false
      closeEditForm()
    }
  }
  
  function deleteProject() {
    if (projectToDelete.value) {
      projects.value = projects.value.filter(p => p.id !== projectToDelete.value!.id)
      $q.notify({
        type: 'positive',
        message: 'Project deleted successfully',
        position: 'top'
      })
    }
    showDeleteDialog.value = false
    projectToDelete.value = null
  }
  
  function closeAddForm() {
    showAddProjectForm.value = false
  }
  
  function closeEditForm() {
    showEditProjectForm.value = false
    selectedProject.value = null
  }
  
  function getStatus(project: Project): string {
    if (project.progress === 100) return 'Completed';
  
    const today = new Date()
    const startDate = new Date(project.startDate ?? '')
    const dueDate = new Date(project.dueDate ?? '')
    
    if (today < startDate) return 'Upcoming'
    if (today > dueDate) return 'Overdue'
    if (project.progress !== undefined && project.progress > 0) return 'In Progress'
    
    return 'Not Started'
  }
  
  function getStatusColor(project: Project): string {
    const status = getStatus(project)
    switch (status) {
      case 'In Progress': return 'blue-6'
      case 'Completed': return 'green'
      case 'Upcoming': return 'grey'
      case 'Overdue': return 'red'
      case 'Not Started': return 'orange'
      default: return 'grey'
    }
  }
  
  function getProgress(project: Project): number {
    if (project.progress !== undefined) return project.progress / 100;
    
    const today = new Date()
    const startDate = new Date(project.startDate ?? '')
    const dueDate = new Date(project.dueDate ?? '')
    
    if (today < startDate) return 0
    if (today > dueDate) return 1
    
    const totalDuration = dueDate.getTime() - startDate.getTime()
    const elapsed = today.getTime() - startDate.getTime()
    
    return Math.min(Math.max(elapsed / totalDuration, 0), 1)
  }
  
  function formatDate(dateString: string | null | undefined): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }
  </script>
  
  <style scoped>
  .project-management-page {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
  }
  
  .hero-section {
    padding: 1.5rem 1.5rem;
    color: white;
  }
  
  .hero-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
  }
  
  .hero-title {
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 0.25rem;
    background: linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .hero-subtitle {
    font-size: 1rem;
    opacity: 0.9;
    margin-bottom: 1rem;
  }
  
  .hero-stats {
    display: flex;
    gap: 1.5rem;
  }
  
  .stat-item {
    text-align: center;
  }
  
  .stat-number {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
  }
  
  .stat-label {
    display: block;
    font-size: 0.75rem;
    opacity: 0.8;
  }
  
  .hero-btn {
    padding: 0.75rem 1.5rem;
    border-radius: 12px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .main-content {
    background: #f8fafc;
    border-radius: 24px 24px 0 0;
    margin-top: -1rem;
    padding: 2rem;
    min-height: calc(100vh - 150px);
  }
  
  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    gap: 1rem;
  }
  
  .search-input {
    min-width: 300px;
  }
  
  .search-input :deep(.q-field__control) {
    border-radius: 12px;
    background: white;
  }
  
  .view-toggle {
    border-radius: 12px;
  }
  
  .projects-table-container {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }
  
  .projects-table :deep(.q-table__top) {
    display: none;
  }
  
  .project-name-cell {
    display: flex;
    align-items: center;
  }
  
  .progress-cell {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 120px;
  }
  
  .progress-bar {
    flex: 1;
    height: 8px;
    border-radius: 4px;
  }
  
  .progress-text {
    font-size: 0.75rem;
    font-weight: 600;
    color: #64748b;
    min-width: 35px;
  }
  
  .action-buttons {
    display: flex;
    gap: 0.25rem;
  }
  
  .action-btn {
    width: 32px;
    height: 32px;
  }
  
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
  }
  
  .project-card {
    background: white;
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .project-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
  
  .project-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .project-icon {
    width: 48px;
    height: 48px;
    background: #eff6ff;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .status-chip {
    border-radius: 8px;
  }
  
  .project-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }
  
  .project-description {
    color: #64748b;
    font-size: 0.875rem;
    line-height: 1.5;
    margin-bottom: 1rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-clamp: 2;
  }
  
  .project-dates {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .date-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: #64748b;
  }
  
  .progress-section {
    margin-bottom: 1rem;
  }
  
  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .progress-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #64748b;
  }
  
  .progress-value {
    font-size: 0.75rem;
    font-weight: 700;
    color: #3b82f6;
  }
  
  .project-progress {
    height: 6px;
    border-radius: 3px;
  }
  
  .project-card-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.25rem;
    border-top: 1px solid #f1f5f9;
    padding-top: 1rem;
  }
  
  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
  }
  
  .empty-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #64748b;
    margin: 1rem 0 0.5rem;
  }
  
  .empty-subtitle {
    color: #94a3b8;
    margin-bottom: 2rem;
  }
  
  .delete-dialog {
    min-width: 400px;
    border-radius: 16px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
  
  .delete-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding-bottom: 0;
  }
  
  .delete-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
  }
  
  .delete-message {
    color: #64748b;
  }
  </style>