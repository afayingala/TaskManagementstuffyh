<template>
    <q-card style="min-width: 800px">
      <q-card-section class="bg-primary text-white">
        <div class="flex justify-between items-center">
          <div class="text-h6">Weekly Task Planner</div>
          <!-- <q-btn icon="close" flat round dense v-close-popup/> -->
        </div>
        <p class="text-subtitle2 q-mt-xs">Plan your tasks for the entire week. Create tasks as subtasks of admin assignments.</p>
      </q-card-section>
      
      <q-card-section class="calendar-container">
        <div class="calendar-grid">
          <!-- Calendar Header -->
          <div class="calendar-header">
            <div v-for="day in daysOfWeek" :key="day" class="day-header">
              {{ day }}
            </div>
          </div>
          
          <!-- Calendar Days -->
          <div class="calendar-body">
            <div v-for="day in daysOfWeek" :key="day" class="calendar-day">
              <div class="day-content">
                <div class="tasks-container">
                  <div v-if="weeklyTasks[day].length > 0" class="task-list">
                    <div v-for="task in weeklyTasks[day]" :key="task.id" class="task-item">
                      {{ task.name }}
                    </div>
                  </div>
                  <div v-else class="no-tasks">
                    No tasks scheduled
                  </div>
                </div>
                
                <q-btn 
                  flat 
                  icon="add" 
                  size="sm"
                  class="add-task-btn"
                  @click="openAddTaskForm(day)"
                />
              </div>
            </div>
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
  /* Purple aesthetic overrides */
  .bg-primary {
    background: linear-gradient(135deg, rgb(80, 55, 223) 0%, #313ae2e6 50%, #5246e0 100%) !important;
    box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
  }
  
  .q-card {
    backdrop-filter: blur(10px);
    border: 1px solid rgba(139, 92, 246, 0.1);
    box-shadow: 0 25px 50px rgba(139, 92, 246, 0.15);
  }
  
  .q-btn[color="primary"], .q-btn.text-primary {
    background: linear-gradient(135deg, #5c9af6, #4152d2) !important;
    color: white !important;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
    transition: all 0.3s ease;
  }
  
  .q-btn[color="primary"]:hover, .q-btn.text-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
  }
  
  .q-card-section:first-child::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  }
  
  /* Calendar-specific styles */
  .calendar-container {
    padding: 0 !important;
  }
  
  .calendar-grid {
    display: flex;
    flex-direction: column;
    height: 500px;
  }
  
  .calendar-header {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-bottom: 2px solid rgba(139, 92, 246, 0.1);
  }
  
  .day-header {
    padding: 16px 8px;
    text-align: center;
    font-weight: 600;
    color: #2458ab;
    background: linear-gradient(135deg, #5c9af6, #443bed);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    border-right: 1px solid rgba(139, 92, 246, 0.1);
  }
  
  .day-header:last-child {
    border-right: none;
  }
  
  .calendar-body {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    flex: 1;
  }
  
  .calendar-day {
    border-right: 1px solid rgba(139, 92, 246, 0.1);
    border-bottom: 1px solid rgba(139, 92, 246, 0.1);
    background: linear-gradient(145deg, #fefefe 0%, #f9fafb 100%);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  
  .calendar-day:hover {
    background: linear-gradient(145deg, #faf5ff 0%, #f3e8ff 100%);
    box-shadow: inset 0 0 20px rgba(139, 92, 246, 0.1);
  }
  
  .calendar-day:last-child {
    border-right: none;
  }
  
  .day-content {
    height: 100%;
    padding: 12px;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  
  .tasks-container {
    flex: 1;
    overflow-y: auto;
    margin-bottom: 8px;
  }
  
  .task-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  
  .task-item {
    background: linear-gradient(135deg, #5c80f6, #557bf7);
    color: white;
    padding: 8px 10px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
    transition: all 0.2s ease;
    cursor: pointer;
    word-wrap: break-word;
    hyphens: auto;
  }
  
  .task-item:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
  }
  
  .no-tasks {
    color: #9CA3AF;
    font-size: 11px;
    text-align: center;
    font-style: italic;
    margin-top: 20px;
  }
  
  .add-task-btn {
    position: absolute !important;
    bottom: 8px;
    right: 8px;
    width: 32px !important;
    height: 32px !important;
    min-height: 32px !important;
    border-radius: 50% !important;
    background: rgba(139, 92, 246, 0.1) !important;
    color: #8B5CF6 !important;
    transition: all 0.2s ease !important;
    opacity: 0.7;
  }
  
  .add-task-btn:hover {
    background: rgba(139, 92, 246, 0.2) !important;
    transform: scale(1.1) !important;
    opacity: 1;
  }
  
  .calendar-day:nth-child(1) { animation: fadeInUp 0.6s ease forwards; animation-delay: 0.1s; opacity: 0; }
  .calendar-day:nth-child(2) { animation: fadeInUp 0.6s ease forwards; animation-delay: 0.15s; opacity: 0; }
  .calendar-day:nth-child(3) { animation: fadeInUp 0.6s ease forwards; animation-delay: 0.2s; opacity: 0; }
  .calendar-day:nth-child(4) { animation: fadeInUp 0.6s ease forwards; animation-delay: 0.25s; opacity: 0; }
  .calendar-day:nth-child(5) { animation: fadeInUp 0.6s ease forwards; animation-delay: 0.3s; opacity: 0; }
  .calendar-day:nth-child(6) { animation: fadeInUp 0.6s ease forwards; animation-delay: 0.35s; opacity: 0; }
  .calendar-day:nth-child(7) { animation: fadeInUp 0.6s ease forwards; animation-delay: 0.4s; opacity: 0; }
  
  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Responsive design */
  @media (max-width: 768px) {
    .calendar-grid {
      height: 400px;
    }
    
    .day-header {
      padding: 12px 4px;
      font-size: 12px;
    }
    
    .day-content {
      padding: 8px;
    }
    
    .task-item {
      padding: 6px 8px;
      font-size: 11px;
    }
  }
  </style>