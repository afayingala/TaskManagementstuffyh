<template>
    <q-dialog v-model="isVisible" @hide="onClose">
      <q-card class="add-project-form-card"
      style="max-height: 90vh; overflow-y: auto;" 
      >
        <div class="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 " 
    
        >
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-xl font-bold mb-1">
                <q-icon name="add_circle" class="mr-2" />
                Create New Project
              </h3>
              <p class="text-green-100 text-sm">
                Start a new project and set it up for success
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
        </div>
  
        <q-card-section class="p-6" >
          <q-form ref="projectForm" @submit.prevent="onSave" class="space-y-5">
            <div class="grid grid-cols-1 gap-5">
              <!-- Project Name -->
              <div class="form-group">
                <label class="form-label">Project Name *</label>
                <q-input
                  v-model="form.name"
                  placeholder="Enter a compelling project name..."
                  outlined
                  dense
                  :rules="[val => !!val || 'Project name is required']"
                  class="form-input"
                >
                  <template v-slot:prepend>
                    <q-icon name="work" color="green-6" />
                  </template>
                </q-input>
              </div>
  
              <!-- Description -->
              <div class="form-group">
                <label class="form-label">Project Description</label>
                <q-input
                  v-model="form.description"
                  type="textarea"
                  placeholder="Describe what this project aims to achieve..."
                  outlined
                  dense
                  rows="4"
                  class="form-input"
                >
                  <template v-slot:prepend>
                    <q-icon name="description" color="green-6" />
                  </template>
                </q-input>
              </div>
  
              <!-- Project Category -->
              <div class="form-group">
                <label class="form-label">Project Category</label>
                <q-select
                  v-model="form.category"
                  :options="categoryOptions"
                  placeholder="Select project category..."
                  outlined
                  dense
                  class="form-input"
                >
                  <template v-slot:prepend>
                    <q-icon name="category" color="green-6" />
                  </template>
                </q-select>
              </div>
  
              <!-- Priority Level -->
              <div class="form-group">
                <label class="form-label">Priority Level</label>
                <q-select
                  v-model="form.priority"
                  :options="priorityOptions"
                  placeholder="Set project priority..."
                  outlined
                  dense
                  class="form-input"
                >
                  <template v-slot:prepend>
                    <q-icon name="flag" color="green-6" />
                  </template>
                </q-select>
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
                    :min="today"
                    class="form-input"
                  >
                    <template v-slot:prepend>
                      <q-icon name="event" color="blue-6" />
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
                    :rules="[
                      val => !!val || 'Due date is required',
                      val => {
                        if (!form.startDate) return true; // Pass validation if start date is not set yet
                        return new Date(val) > new Date(form.startDate) || 'Due date must be after the start date';
                      }
                    ]"
                    :min="form.startDate || today"
                    class="form-input"
                  >
                    <template v-slot:prepend>
                      <q-icon name="schedule" color="orange-6" />
                    </template>
                  </q-input>
                </div>
              </div>
  
              <!-- Budget (Optional) -->
              <div class="form-group">
                <label class="form-label">Budget (Optional)</label>
                <q-input
                  v-model="form.budget"
                  type="number"
                  placeholder="Enter project budget..."
                  outlined
                  dense
                  prefix="$"
                  class="form-input"
                >
                  <template v-slot:prepend>
                    <q-icon name="attach_money" color="green-6" />
                  </template>
                </q-input>
              </div>
            </div>
          </q-form>
        </q-card-section>
  
        <!-- Actions -->
        <q-card-actions class="p-6 pt-0">
          <div class="flex justify-end space-x-3 w-full">
            <q-btn
              flat
              label="Cancel"
              color="grey-6"
              class="px-6"
              @click="onClose"
            />
            <q-btn
              unelevated
              label="Create Project"
              color="green-6"
              icon="add"
              class="px-6"
              :loading="saving"
              @click="onSave"
            />
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, computed } from 'vue'
  import { QForm } from 'quasar'
  
  interface ProjectData {
    name: string
    description: string | null | undefined
    category: string | null | undefined
    priority: string | null | undefined
    startDate: string | null | undefined
    dueDate: string | null | undefined
    budget: number | null | undefined
  }
  
  interface Props {
    modelValue: boolean
    saving?: boolean
  }
  
  interface Emits {
    (e: 'update:modelValue', value: boolean): void
    (e: 'save', project: ProjectData): void
    (e: 'close'): void
  }
  
  const props = withDefaults(defineProps<Props>(), {
    saving: false
  })
  
  const emit = defineEmits<Emits>()
  
  const isVisible = ref(false)
  const projectForm = ref<QForm | null>(null) // Explicitly type the ref
  const form = ref<ProjectData>({
    name: '',
    description: null,
    category: null,
    priority: 'Medium',
    startDate: null,
    dueDate: null,
    budget: null
  })
  
  const categoryOptions = [
    'Web Development',
    'Mobile App',
    'Design',
    'Marketing',
    'Research',
    'Infrastructure',
    'Other'
  ]
  
  const priorityOptions = [
    { label: 'High', value: 'High' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' }
  ]
  
  const today = computed(() => {
    return new Date().toISOString().split('T')[0]
  })
  
  // Watch for prop changes
  watch(() => props.modelValue, (newVal) => {
    isVisible.value = newVal
    if (newVal) {
      // Set default start date to today when opening
      form.value.startDate = today.value
    }
  })
  
  async function onSave() {
    if (projectForm.value) {
      const isValid = await projectForm.value.validate()
      if (isValid) {
        emit('save', { ...form.value })
      }
    }
  }
  
  function onClose() {
    isVisible.value = false
    emit('update:modelValue', false)
    emit('close')
    resetForm()
  }
  
  function resetForm() {
    form.value = {
      name: '',
      description: null,
      category: null,
      priority: 'Medium',
      startDate: null,
      dueDate: null,
      budget: null
    }
    // Reset validation state
    if (projectForm.value) {
      projectForm.value.resetValidation()
    }
  }
  </script>
  
  <style scoped>
  .add-project-form-card {
    width: 100%;
    max-width: 650px;
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
    border-color: #16a34a;
  }
  
  .form-input :deep(.q-field__outlined.q-field--focused .q-field__control) {
    border-color: #16a34a;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
  }
  </style>
  