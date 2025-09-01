<template>
    <q-dialog v-model="isVisible" @hide="onClose">
      <q-card class="edit-project-form-card">
        <q-card-section class="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-xl font-bold mb-1">
                <q-icon name="edit" class="mr-2" />
                Edit Project
              </h3>
              <p class="text-blue-100 text-sm">
                Update project details and settings
              </p>
            </div>
            <q-btn 
              flat 
              dense 
              round 
              icon="close" 
              color="white"
              @click="onClose"
            />
          </div>
        </q-card-section>
  
        <q-card-section class="p-6">
          <div class="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <div class="flex items-center">
              <q-icon name="info" color="blue-6" class="mr-2" />
              <span class="text-sm text-blue-700">
                Editing: <strong>{{ originalProject?.name }}</strong>
              </span>
            </div>
          </div>
  
          <form @submit.prevent="onSave" class="space-y-5">
            <div class="grid grid-cols-1 gap-5">
              <!-- Project Name -->
              <div class="form-group">
                <label class="form-label">Project Name *</label>
                <q-input
                  v-model="form.name"
                  placeholder="Update project name..."
                  outlined
                  dense
                  :rules="[val => !!val || 'Project name is required']"
                  class="form-input"
                >
                  <template v-slot:prepend>
                    <q-icon name="work" color="blue-6" />
                  </template>
                </q-input>
              </div>
  
              <!-- Description -->
              <div class="form-group">
                <label class="form-label">Project Description</label>
                <q-input
                  v-model="form.description"
                  type="textarea"
                  placeholder="Update project description..."
                  outlined
                  dense
                  rows="4"
                  class="form-input"
                >
                  <template v-slot:prepend>
                    <q-icon name="description" color="blue-6" />
                  </template>
                </q-input>
              </div>
  
              <!-- Status -->
              <div class="form-group">
                <label class="form-label">Project Status</label>
                <q-select
                  v-model="form.status"
                  :options="statusOptions"
                  placeholder="Update project status..."
                  outlined
                  dense
                  class="form-input"
                >
                  <template v-slot:prepend>
                    <q-icon name="track_changes" color="blue-6" />
                  </template>
                </q-select>
              </div>
  
              <!-- Progress -->
              <div class="form-group">
                <label class="form-label">Progress (%)</label>
                <div class="progress-input-container">
                  <q-slider
                    v-model="form.progress"
                    :min="0"
                    :max="100"
                    :step="5"
                    label
                    color="blue-6"
                    class="progress-slider"
                  />
                  <q-input
                    v-model="form.progress"
                    type="number"
                    :min="0"
                    :max="100"
                    suffix="%"
                    outlined
                    dense
                    class="progress-input"
                  >
                    <template v-slot:prepend>
                      <q-icon name="trending_up" color="blue-6" />
                    </template>
                  </q-input>
                </div>
              </div>
  
              <!-- Date Fields -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-group">
                  <label class="form-label">Start Date *</label>
                  <q-input
                    v-model="form.startDate"
                    type="date"
                    outlined
                    dense
                    :rules="[val => !!val || 'Start date is required']"
                    class="form-input"
                  >
                    <template v-slot:prepend>
                      <q-icon name="event" color="green-6" />
                    </template>
                  </q-input>
                </div>
  
                <div class="form-group">
                  <label class="form-label">Due Date *</label>
                  <q-input
                    v-model="form.dueDate"
                    type="date"
                    outlined
                    dense
                    :rules="[val => !!val || 'Due date is required']"
                    :min="form.startDate"
                    class="form-input"
                  >
                    <template v-slot:prepend>
                      <q-icon name="schedule" color="orange-6" />
                    </template>
                  </q-input>
                </div>
              </div>
  
              <!-- Priority and Category -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-group">
                  <label class="form-label">Priority Level</label>
                  <q-select
                    v-model="form.priority"
                    :options="priorityOptions"
                    placeholder="Update priority..."
                    outlined
                    dense
                    class="form-input"
                  >
                    <template v-slot:prepend>
                      <q-icon name="flag" color="blue-6" />
                    </template>
                  </q-select>
                </div>
  
                <div class="form-group">
                  <label class="form-label">Category</label>
                  <q-select
                    v-model="form.category"
                    :options="categoryOptions"
                    placeholder="Update category..."
                    outlined
                    dense
                    class="form-input"
                  >
                    <template v-slot:prepend>
                      <q-icon name="category" color="blue-6" />
                    </template>
                  </q-select>
                </div>
              </div>
  
              <!-- Notes -->
              <div class="form-group">
                <label class="form-label">Additional Notes</label>
                <q-input
                  v-model="form.notes"
                  type="textarea"
                  placeholder="Add any updates or notes about this project..."
                  outlined
                  dense
                  rows="3"
                  class="form-input"
                >
                  <template v-slot:prepend>
                    <q-icon name="notes" color="blue-6" />
                  </template>
                </q-input>
              </div>
            </div>
  
            <!-- Change Summary -->
            <div v-if="hasChanges" class="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div class="flex items-start">
                <q-icon name="warning" color="amber-6" class="mr-2 mt-0.5" />
                <div>
                  <h4 class="text-sm font-semibold text-amber-800 mb-1">Pending Changes</h4>
                  <ul class="text-xs text-amber-700 space-y-1">
                    <li v-for="change in changes" :key="change">{{ change }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </form>
        </q-card-section>
  
        <!-- Actions -->
        <q-card-actions class="p-6 pt-0">
          <div class="flex justify-between w-full">
            <q-btn
              flat
              label="Revert Changes"
              color="grey-6"
              icon="restore"
              @click="revertChanges"
              :disable="!hasChanges"
            />
            <div class="flex space-x-3">
              <q-btn
                flat
                label="Cancel"
                color="grey-6"
                class="px-6"
                @click="onClose"
              />
              <q-btn
                unelevated
                label="Save Changes"
                color="blue-6"
                icon="save"
                class="px-6"
                :loading="saving"
                :disable="!hasChanges"
                @click="onSave"
              />
            </div>
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, computed } from 'vue'
  
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
  
  interface Props {
    modelValue: boolean
    project?: Project |null
    saving?: boolean
  }
  
  interface Emits {
    (e: 'update:modelValue', value: boolean): void
    (e: 'save', project: Project): void
    (e: 'close'): void
  }
  
  const props = withDefaults(defineProps<Props>(), {
    saving: false
  })
  
  const emit = defineEmits<Emits>()
  
  const isVisible = ref(false)
  const originalProject = ref<Project | null>(null)
  const form = ref<Project>({
    id: 0,
    name: '',
    description: '',
    startDate: '',
    dueDate: '',
    status: 'In Progress',
    progress: 0,
    priority: 'Medium',
    category: '',
    notes: ''
  })
  
  const statusOptions = [
    { label: 'Not Started', value: 'Not Started' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'On Hold', value: 'On Hold' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Cancelled', value: 'Cancelled' }
  ]
  
  const priorityOptions = [
    { label: 'High', value: 'High' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' }
  ]
  
  const categoryOptions = [
    'Web Development',
    'Mobile App',
    'Design',
    'Marketing',
    'Research',
    'Infrastructure',
    'Other'
  ]
  
  // Watch for prop changes
  watch(() => props.modelValue, (newVal) => {
    isVisible.value = newVal
  })
  
  watch(() => props.project, (newProject) => {
    if (newProject) {
      originalProject.value = { ...newProject }
      form.value = {
        ...newProject,
        status: newProject.status || 'In Progress',
        progress: newProject.progress || 0,
        priority: newProject.priority || 'Medium',
        category: newProject.category || '',
        notes: newProject.notes || ''
      }
    }
  }, { immediate: true })
  
  const hasChanges = computed(() => {
    if (!originalProject.value) return false
    
    return (
      form.value.name !== originalProject.value.name ||
      form.value.description !== originalProject.value.description ||
      form.value.startDate !== originalProject.value.startDate ||
      form.value.dueDate !== originalProject.value.dueDate ||
      form.value.status !== (originalProject.value.status || 'In Progress') ||
      form.value.progress !== (originalProject.value.progress || 0) ||
      form.value.priority !== (originalProject.value.priority || 'Medium') ||
      form.value.category !== (originalProject.value.category || '') ||
      form.value.notes !== (originalProject.value.notes || '')
    )
  })
  
  const changes = computed(() => {
    if (!originalProject.value) return []
    
    const changeList: string[] = []
    
    if (form.value.name !== originalProject.value.name) {
      changeList.push(`Name: "${originalProject.value.name}" → "${form.value.name}"`)
    }
    if (form.value.description !== originalProject.value.description) {
      changeList.push('Description updated')
    }
    if (form.value.startDate !== originalProject.value.startDate) {
      changeList.push(`Start Date: ${originalProject.value.startDate} → ${form.value.startDate}`)
    }
    if (form.value.dueDate !== originalProject.value.dueDate) {
      changeList.push(`Due Date: ${originalProject.value.dueDate} → ${form.value.dueDate}`)
    }
    if (form.value.status !== (originalProject.value.status || 'In Progress')) {
      changeList.push(`Status: ${originalProject.value.status || 'In Progress'} → ${form.value.status}`)
    }
    if (form.value.progress !== (originalProject.value.progress || 0)) {
      changeList.push(`Progress: ${originalProject.value.progress || 0}% → ${form.value.progress}%`)
    }
    if (form.value.priority !== (originalProject.value.priority || 'Medium')) {
      changeList.push(`Priority: ${originalProject.value.priority || 'Medium'} → ${form.value.priority}`)
    }
    if (form.value.category !== (originalProject.value.category || '')) {
      changeList.push(`Category updated`)
    }
    if (form.value.notes !== (originalProject.value.notes || '')) {
      changeList.push('Notes updated')
    }
    
    return changeList
  })
  
  function onSave() {
    // Basic validation
    if (!form.value.name.trim()) {
      return
    }
    if (!form.value.startDate || !form.value.dueDate) {
      return
    }
  
    // Validate due date is after start date
    if (new Date(form.value.dueDate) <= new Date(form.value.startDate)) {
      return
    }
  
    emit('save', { ...form.value })
  }
  
  function onClose() {
    isVisible.value = false
    emit('update:modelValue', false)
    emit('close')
  }
  
  function revertChanges() {
    if (originalProject.value) {
      form.value = {
        ...originalProject.value,
        status: originalProject.value.status || 'In Progress',
        progress: originalProject.value.progress || 0,
        priority: originalProject.value.priority || 'Medium',
        category: originalProject.value.category || '',
        notes: originalProject.value.notes || ''
      }
    }
  }
  </script>
  
  <style scoped>
  .edit-project-form-card {
    width: 100%;
    max-width: 700px;
    border-radius: 12px;
    overflow: hidden;
  }
  
  .form-group {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
  
  .form-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: #4b5563;
  }
  
  .form-input {
    width: 100%;
  }
  
  .form-input :deep(.q-field__control) {
    border-radius: 8px;
  }
  
  .form-input :deep(.q-field__outlined .q-field__control) {
    border-color: #e5e7eb;
  }
  
  .form-input :deep(.q-field__outlined .q-field__control):hover {
    border-color: #3b82f6;
  }
  
  .form-input :deep(.q-field__outlined.q-field--focused .q-field__control) {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  .progress-input-container {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 1rem;
    align-items: center;
  }
  
  .progress-slider {
    padding: 1rem 0;
  }
  
  .progress-input {
    width: 120px;
  }
  </style>
  