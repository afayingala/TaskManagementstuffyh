


<template>
  <q-page class="min-h-screen bg-gray-50">
    <!-- Top Buttons -->
    <div class="flex justify-start space-x-4 mb-6 px-6 pt-6">
      <q-btn
        @click="openAddTaskForm"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        no-caps
        unelevated
        icon="add"
      >
        Add Task
      </q-btn>
      <q-btn
        @click="openPlanWeekForm"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-green-700"
        no-caps
        unelevated
        icon="event"      >
        Plan Week
      </q-btn>
    </div>

    <!-- Filter + Search -->
    <div class="flex justify-between items-center mb-6 px-6">
      <!-- Filter -->
      <div>
        <label class="mr-2 font-medium text-gray-700">Filter by Status:</label>
        <q-select
          v-model="filterStatus"
          :options="['All', 'Pending', 'In Progress', 'Completed']"
          outlined
          dense
          class="filter-select"
          style="min-width: 150px"
        />
      </div>

      <!-- Search -->
      <div class="relative w-1/3">
        <q-input
          v-model="searchQuery"
          outlined
          dense
          placeholder="Search tasks..."
          class="search-input"
        >
          <template v-slot:append>
            <q-icon name="search" class="text-gray-400" />
          </template>
        </q-input>
      </div>
    </div>

  

    <!-- Table -->
    <div class="bg-white shadow rounded-lg overflow-hidden mx-6 mb-6">
      <table class="min-w-full text-left">
        <thead class="bg-gray-100 border-b">
          <tr>
            <th class="px-4 py-3 font-medium text-gray-700">Task Name</th>
            <th class="px-4 py-3 font-medium text-gray-700">Start Date</th>
            <th class="px-4 py-3 font-medium text-gray-700">Due Date</th>
            <th class="px-4 py-3 font-medium text-gray-700">Parent Project</th>
            <th class="px-4 py-3 font-medium text-gray-700">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="task in filteredTasks"
            :key="task.id"
            class="border-b hover:bg-gray-50 cursor-pointer transition-colors"
            @click="goToTaskDetail(task.id)"
          >
            <td class="px-4 py-3 text-blue-600 hover:underline font-medium">
              {{ task.name }}
            </td>
            <td class="px-4 py-3 text-gray-600">{{ task.startDate }}</td>
            <td class="px-4 py-3 text-gray-600">{{ task.dueDate }}</td>
            <td class="px-4 py-3 text-gray-600">{{ task.parentProject || '-' }}</td>
            <td class="px-4 py-3">
              <span
                :class="{
                  'bg-green-100 text-green-800': task.status === 'Completed',
                  'bg-blue-100 text-blue-800': task.status === 'In Progress',
                  'bg-orange-100 text-orange-800': task.status === 'Pending'
                }"
                class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ task.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty state -->
      <div v-if="filteredTasks.length === 0" class="text-center py-8 text-gray-500">
        No tasks found matching your criteria
      </div>
    </div>

    <!-- Modals (you'll need to create these components) -->
    <q-dialog v-model="showAddTaskForm" persistent>
      <add-task-form @add-task="addNewTask" @close="showAddTaskForm = false" />
    </q-dialog>

    <q-dialog v-model="showPlanWeekForm" persistent>
      <plan-week-form 
        @close="showPlanWeekForm = false" 
        @create-weekly-tasks="addNewTasks" 
      />
    </q-dialog>
    
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AddTaskForm from 'src/components/Employee/AddTaskForm.vue' 
import PlanWeekForm from 'src/components/Employee/PlanWeekForm.vue'

// ADDED: The Task interface to define the type of a task object
interface Task {
  id: number;
  name: string;
  startDate: string;
  dueDate: string;
  parentProject: string;
  status: string;
}

const router = useRouter()
const filterStatus = ref('All')
const searchQuery = ref('')
const showAddTaskForm = ref(false)
const showPlanWeekForm = ref(false)

// Mock data for now
const taskSummary = ref({
  total: 3,
  completed: 1,
  pending: 2,
})

// MODIFIED: The tasks array now uses the Task interface for type safety
const tasks = ref<Task[]>([
  {
    id: 1,
    name: 'Design Login Screen',
    startDate: '2025-08-01',
    dueDate: '2025-08-05',
    parentProject: 'Mobile App Redesign',
    status: 'In Progress',
  },
  {
    id: 2,
    name: 'API Integration',
    startDate: '2025-08-06',
    dueDate: '2025-08-10',
    parentProject: 'Mobile App Redesign',
    status: 'Pending',
  },
  {
    id: 3,
    name: 'Testing Module',
    startDate: '2025-08-11',
    dueDate: '2025-08-14',
    parentProject: '',
    status: 'Completed',
  },
])

// MODIFIED: The addNewTask function now has a type annotation for the parameter
function addNewTask(newTask: Task) {
  tasks.value.push(newTask);
  console.log('Task added to list:', newTask);
  // Optional: update the task summary counts
  taskSummary.value.total++;
  taskSummary.value.pending++;
}

// ADDED: A new function to handle the list of new tasks with type annotation
function addNewTasks(newTasks: Task[]) {
  // Use a spread operator to add all tasks from the newTasks array
  tasks.value.push(...newTasks);
  
  // Update task summary
  taskSummary.value.total += newTasks.length;
  taskSummary.value.pending += newTasks.length;
  
  console.log('Weekly tasks added to the main list:', newTasks);
}


// Filter & search
const filteredTasks = computed(() => {
  return tasks.value.filter((task) => {
    const matchesStatus =
      filterStatus.value === 'All' || task.status === filterStatus.value
    const matchesSearch = task.name
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase())
    return matchesStatus && matchesSearch
  })
})

// Navigation
function goToTaskDetail(taskId: number) {
  router.push({ name: 'TaskDetail', params: { id: taskId.toString() } })
}
// Open forms
function openAddTaskForm() {
  showAddTaskForm.value = true
}

function openPlanWeekForm() {
  showPlanWeekForm.value = true
}
</script>

<style scoped>
/* Custom styles for Tailwind-like appearance */
.min-h-screen {
  min-height: 100vh;
}

.bg-gray-50 {
  background-color: #f9fafb;
}

.bg-gray-100 {
  background-color: #f3f4f6;
}

.text-gray-700 {
  color: #374151;
}

.text-gray-600 {
  color: #4b5563;
}

.text-gray-500 {
  color: #6b7280;
}

.text-blue-600 {
  color: #2563eb;
}

.text-green-600 {
  color: #16a34a;
}

.text-orange-600 {
  color: #ea580c;
}

.bg-blue-600 {
  background-color: #2563eb;
}

.bg-green-600 {
  background-color: #16a34a;
}

.hover\:bg-blue-700:hover {
  background-color: #1d4ed8;
}

.hover\:bg-green-700:hover {
  background-color: #15803d;
}

.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
}

.grid {
  display: grid;
}

.grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.gap-4 {
  gap: 1rem;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.shadow {
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.py-6 {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

.pt-6 {
  padding-top: 1.5rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.mr-2 {
  margin-right: 0.5rem;
}

.mx-6 {
  margin-left: 1.5rem;
  margin-right: 1.5rem;
}

.space-x-4 > * + * {
  margin-left: 1rem;
}

.w-1\/3 {
  width: 33.333333%;
}

.min-w-full {
  min-width: 100%;
}

.flex {
  display: flex;
}

.justify-start {
  justify-content: flex-start;
}

.justify-between {
  justify-content: space-between;
}

.items-center {
  align-items: center;
}

.text-left {
  text-align: left;
}

.text-center {
  text-align: center;
}

.font-medium {
  font-weight: 500;
}

.font-bold {
  font-weight: 700;
}

.text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
}

.text-2xl {
  font-size: 1.5rem;
  line-height: 2rem;
}

.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}

.cursor-pointer {
  cursor: pointer;
}

.border-b {
  border-bottom-width: 1px;
}

.overflow-hidden {
  overflow: hidden;
}

.relative {
  position: relative;
}

.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.hover\:underline:hover {
  text-decoration-line: underline;
}

.bg-green-100 {
  background-color: #dcfce7;
}

.text-green-800 {
  color: #166534;
}

.bg-blue-100 {
  background-color: #dbeafe;
}

.text-blue-800 {
  color: #1e40af;
}

.bg-orange-100 {
  background-color: #fed7aa;
}

.text-orange-800 {
  color: #9a3412;
}

.rounded-full {
  border-radius: 9999px;
}

/* Quasar component overrides */
.filter-select .q-field__control {
  border-radius: 0.5rem;
}

.search-input .q-field__control {
  border-radius: 0.5rem;
}
</style>