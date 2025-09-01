<template>
    <q-card style="min-width: 400px">
      <q-card-section class="bg-primary text-white">
        <div class="flex justify-between items-center">
          <div class="text-h6">Weekly Task Planner</div>
          <q-btn icon="close" flat round dense v-close-popup/>
        </div>
        <p class="text-subtitle2 q-mt-xs">Plan your tasks for the entire week. Create tasks as subtasks of admin assignments.</p>
      </q-card-section>
      
      <q-card-section>
        <div class="grid grid-cols-2 gap-4">
          <div v-for="day in daysOfWeek" :key="day" class="p-4 bg-gray-100 rounded-lg shadow">
            <div class="text-lg font-bold mb-4">{{ day }}</div>
            
            <div class="mb-2">
              <div v-if="weeklyTasks[day].length > 0">
                <q-list dense>
                  <q-item v-for="task in weeklyTasks[day]" :key="task.id" class="px-0">
                    <q-item-section>
                      <q-item-label>{{ task.name }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
            
            <q-btn 
              flat 
              label="+ Add Task" 
              class="w-full bg-white rounded-lg border border-dashed border-gray-300 hover:bg-gray-50"
              @click="openAddTaskForm(day)"
            />
          </div>
        </div>
      </q-card-section>
  
      <q-card-actions align="right" class="q-mt-md">
        <q-btn flat label="Create Weekly Tasks" color="primary" @click="createWeeklyTasks" />
      </q-card-actions>
    </q-card>
    
    <q-dialog v-model="showAddTaskForm" persistent>
      <add-task-form 
        @close="showAddTaskForm = false" 
        @add-task="handleAddedTask" 
        :initial-date="selectedDay" 
      />
    </q-dialog>
  
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import AddTaskForm from 'src/components/Employee/AddTaskForm.vue';
  
  // MODIFIED: Define the events this component can emit
  const emit = defineEmits(['close', 'create-weekly-tasks']);
  
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const showAddTaskForm = ref(false);
  const selectedDay = ref(null);
  
  // MODIFIED: Use an object to store tasks by day
  const weeklyTasks = ref({
    'Monday': [],
    'Tuesday': [],
    'Wednesday': [],
    'Thursday': [],
    'Friday': [],
    'Saturday': [],
    'Sunday': []
  });
  
  const openAddTaskForm = (day) => {
    selectedDay.value = day;
    showAddTaskForm.value = true;
  };
  
  // MODIFIED: Function to handle the added task and assign it to the correct day
  const handleAddedTask = (newTask) => {
    if (selectedDay.value) {
      weeklyTasks.value[selectedDay.value].push(newTask);
    }
    showAddTaskForm.value = false; // Close the form after adding
    console.log('Task added to weekly planner:', newTask);
  };
  
  // MODIFIED: Function to handle the saving of all tasks
  const createWeeklyTasks = () => {
    // Extract all tasks from the weeklyTasks object into a single array
    const allTasks = Object.values(weeklyTasks.value).flat();
    
    // Emit the combined list of tasks to the parent component
    emit('create-weekly-tasks', allTasks);
  
    // Close the modal after creating the tasks
    emit('close');
  };
  </script>
  
  <style scoped>
  .grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .border-dashed {
    border-style: dashed;
  }
  </style>