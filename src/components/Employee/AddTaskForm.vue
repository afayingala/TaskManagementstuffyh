<template>
    <q-card style="min-width: 400px">
      <q-card-section class="bg-primary text-white">
        <div class="flex justify-between items-center">
          <div class="text-h6">Add New Task</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </div>
        <p class="text-subtitle2 q-mt-xs">Create a new task for yourself, optionally as a subtask of admin assignments</p>
      </q-card-section>
  
      <q-card-section class="q-pt-md">
        <q-input
          v-model="taskTitle"
          label="Task Title"
          dense
          outlined
          class="q-mb-md"
          :rules="[val => !!val || 'Task Title is required']"
        />
  
        <q-input
          v-model="description"
          label="Description"
          type="textarea"
          outlined
          autogrow
          class="q-mb-md"
        />
  
        <q-select
          v-model="parentTask"
          :options="parentTaskOptions"
          label="Parent Task (Optional)"
          dense
          outlined
          clearable
          class="q-mb-md"
        />
  
        <q-input
          v-model.number="taskWeight"
          label="Task Weight (1-10)"
          dense
          outlined
          type="number"
          :rules="[
            val => (val > 0 && val <= 10) || 'Please enter a number between 1 and 10'
          ]"
        />
  
        <q-input
          v-model="deadline"
          label="Deadline"
          dense
          outlined
          mask="date"
          class="q-mt-md"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="deadline" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-card-section>
  
      <q-card-actions align="right" class="text-primary q-pa-md">
        <q-btn flat label="Cancel" @click="$emit('close')" />
        <q-btn label="Add Task" color="primary" @click="submitForm" />
      </q-card-actions>
    </q-card>
  </template>
  
  <script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useQuasar } from 'quasar';
import moment from 'moment';

// Emits for closing the modal
const emit = defineEmits(['close', 'add-task']);

const props = defineProps({
  initialDate: {
    type: String,
    default: null,
  },
});

// Reactive form data
const taskTitle = ref('');
const description = ref('');
const parentTask = ref(null);
const taskWeight = ref(5);
const deadline = ref<string | null>(null);

const $q = useQuasar();
let startDate = new Date().toISOString().slice(0, 10);
// ADDED: This watchEffect block will pre-fill the deadline
watchEffect(() => {
   
  if (props.initialDate) {
    const today = moment();
    const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(props.initialDate);
    const targetDate = today.day(dayIndex);
    startDate = targetDate.format('YYYY/MM/DD');
  }
});

// Mock data for the parent task dropdown
const parentTaskOptions = [
  'Admin Assignment 1',
  'Admin Assignment 2',
  'Admin Assignment 3'
];

// Form submission logic
function submitForm() {
  // Simple validation to ensure required fields are not empty
  if (!taskTitle.value || !deadline.value) {
    $q.notify({
      message: 'Task Title and Deadline are required.',
      color: 'negative',
      position: 'top',
    });
    return;
  }

  const newTask = {
    // Generate a unique ID to use as a key in the list
    id: Date.now(),
    name: taskTitle.value,
    description: description.value,
    parentProject: parentTask.value || 'N/A', // Use 'N/A' for consistency
    weight: taskWeight.value,
    dueDate: deadline.value,
    startDate: startDate, // Add a start date
    status: 'Pending',
  };

  // Emit the new task data to the parent component
  emit('add-task', newTask);

  console.log('New task created and emitted:', newTask);

  // Here, you would typically dispatch this data to a Pinia store or an API
  // For this example, we will just log it.
  console.log('New task created:', newTask);

  // Show a success notification
  $q.notify({
    message: 'Task added successfully!',
    color: 'positive',
    position: 'top',
  });

  // Reset form fields
  taskTitle.value = '';
  description.value = '';
  parentTask.value = null;
  taskWeight.value = 5;
  deadline.value = null;

  // Close the modal
  emit('close');
}
</script>