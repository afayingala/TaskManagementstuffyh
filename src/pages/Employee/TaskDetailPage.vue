<template>
    <q-page class="p-6 bg-gray-50 min-h-screen">
      <div class="bg-white shadow rounded-lg p-6 mb-6">
        <div class="flex justify-between items-center mb-4 header-container">
          <div>
            <h1 class="task-name">{{ task?.name }}</h1>
            <p class="text-gray-600 text-lg">{{ task?.description }}</p>
          </div>
          <div class="button-group">
            <q-btn
              class="bg-yellow-500 text-white"
              no-caps
              icon="event"
              label="Reschedule"
              @click="showRescheduleForm = true"
            />
            <q-btn
              class="bg-green-600 text-white"
              no-caps
              icon="check"
              label="Complete"
              @click="markComplete"
            />
            <q-btn
              class="bg-red-600 text-white"
              no-caps
              icon="delete"
              label="Delete"
              @click="deleteTask"
            />
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <h2 class="text-lg font-medium mb-2">Details</h2>
            <div class="bg-gray-100 rounded-lg p-4">
              <ul class="space-y-2 text-gray-700">
                <li><strong>Parent Project:</strong> {{ task?.parentProject || '-' }}</li>
                <li><strong>Start Date:</strong> {{ task?.startDate }}</li>
                <li><strong>Due Date:</strong> {{ task?.dueDate }}</li>
                <li><strong>Status:</strong> <span class="px-2 py-1 rounded-full text-xs font-medium" :class="{'bg-green-100 text-green-800': task?.status === 'Completed', 'bg-blue-100 text-blue-800': task?.status === 'In Progress', 'bg-orange-100 text-orange-800': task?.status === 'Pending'}">{{ task?.status }}</span></li>
                <li><strong>Weight:</strong> {{ task?.weight || '-' }}</li>
              </ul>
            </div>
          </div>
          
          <div>
            <h2 class="text-lg font-medium mb-2">Subtasks</h2>
            <div class="bg-gray-100 rounded-lg p-4">
              <ul v-if="task?.subtasks?.length" class="list-disc pl-5 space-y-1">
                <li v-for="(sub, idx) in task.subtasks" :key="idx">
                  {{ sub }}
                </li>
              
              </ul>
              <p v-else class="text-gray-500">No subtasks</p>
            </div>
          </div>
        </div>
      </div>
      
      <q-dialog v-model="showRescheduleForm" persistent>
        <q-card class="p-6 max-w-md">
          <h3 class="text-lg font-bold mb-4">Reschedule Task</h3>
          <q-input
            v-model="rescheduleDate"
            type="date"
            label="New Date"
            outlined
            dense
            class="mb-4"
          />
          <q-input
            v-model="rescheduleReason"
            type="textarea"
            label="Reason"
            outlined
            dense
            class="mb-4"
          />
          <div class="flex justify-end space-x-2">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn
              class="bg-blue-600 text-white"
              label="Save"
              @click="saveReschedule"
            />
          </div>
        </q-card>
      </q-dialog>
    </q-page>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  const emit = defineEmits(['update-task']);
  
  // Mock tasks array (same as your TasksPage)
  const tasks = [
    {
      id: 1,
      name: 'Design Login Screen',
      startDate: '2025-08-19',
      dueDate: '2025-08-25',
      parentProject: 'Mobile App Redesign',
      parentTask: null,
      status: 'In Progress',
      weight: '10',
      subtasks: ['Wireframe', 'Mockup', 'Prototype'],
      description: 'Create the user interface for the login screen, focusing on user experience and accessibility.'
    },
    {
      id: 2,
      name: 'API Integration',
      startDate: '2025-08-18',
      dueDate: '2025-08-31',
      parentProject: 'Mobile App Redesign',
      parentTask: null,
      status: 'Pending',
      weight: '7',
      subtasks: [],
      description: 'Integrate the user authentication and data retrieval APIs with the front-end application.'
    },
  ];
  
  const route = useRoute();
  const router = useRouter();
  const taskId = Number(route.params.id);
  const task = ref(tasks.find(t => t.id === taskId) || null);
  
  // Reschedule form
  const showRescheduleForm = ref(false);
  const rescheduleDate = ref('');
  const rescheduleReason = ref('');
  
  function saveReschedule() {
    console.log('Rescheduled to', rescheduleDate.value, 'reason:', rescheduleReason.value);
    showRescheduleForm.value = false;
  }
  
  function markComplete() {
  if (task.value) {
    // We update the local state for a quick UI change
    task.value.status = 'Completed';
    console.log('Task marked complete:', task.value);

    // And then we emit an event with the updated task
    emit('update-task', { ...task.value });
  }
}
  
  function deleteTask() {
    console.log('Task deleted:', task.value);
    router.push({ name: 'Tasks' }); // go back to TasksPage
  }
  </script>
  
  <style lang="scss" scoped>
  /* Page background with gradient */
  .q-page {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    min-height: 100vh;
    position: relative;
    
    &::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 80%, rgba(120, 219, 226, 0.1) 0%, transparent 50%);
      pointer-events: none;
      z-index: 0;
    }
    
    > * {
      position: relative;
      z-index: 1;
    }
  }
  
  /* Enhanced task header styling */
  .task-name {
    font-size: 1.5rem; /* Drastically reduced size */
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    letter-spacing: -0.02em;
     
  }
  
  .button-group {
    display: flex;
    gap: 8px; /* Adds space between buttons */
  }
  
  /* Action buttons enhancement */
  .q-btn {
    border-radius: 12px;
    font-weight: 600;
    letter-spacing: 0.02em;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.5s;
    }
  
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
      
      &::before {
        left: 100%;
      }
    }
  
    &:active {
      transform: translateY(0);
    }
  }
  
  /* Specific button styles for visibility */
  .bg-yellow-500 {
    background-color: #f59e0b !important;
    color: #fff;
  }
  
  .bg-green-600 {
    background-color: #16a34a !important;
    color: #fff;
  }
  
  .bg-red-600 {
    background-color: #dc2626 !important;
    color: #fff;
  }
  
  /* Card styling enhancements */
  .q-card {
    border-radius: 16px;
    border: none;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.9);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c);
      background-size: 300% 100%;
      animation: gradient-slide 3s ease-in-out infinite;
    }
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 16px 40px rgba(0,0,0,0.15);
    }
  }
  
  @keyframes gradient-slide {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  
  /* Card section styling */
  .q-card-section {
    padding: 24px;
    
    .text-lg {
      color: #2d3748;
      font-weight: 700;
      margin-bottom: 20px;
      
      .q-icon {
        color: #667eea;
        filter: drop-shadow(0 2px 4px rgba(102, 126, 234, 0.3));
      }
    }
  }
  
  /* Grid enhancements */
  .grid {
    gap: 20px;
    
    > div {
      padding: 16px;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
      backdrop-filter: blur(5px);
      
      &:hover {
        background: rgba(255, 255, 255, 0.9);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
      
      strong {
        color: #4a5568;
        font-weight: 600;
        display: block;
        margin-bottom: 8px;
        font-size: 0.9em;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      
      p {
        margin: 0;
        color: #2d3748;
        font-weight: 500;
        font-size: 1.1em;
      }
    }
  }
  
  /* Enhanced chip styling */
  .q-chip {
    border-radius: 20px;
    font-weight: 600;
    letter-spacing: 0.02em;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      transition: left 0.6s;
    }
    
    &:hover::before {
      left: 100%;
    }
  }
  
  /* List enhancements */
  .q-list {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(5px);
  }
  
  .q-item {
    transition: all 0.3s ease;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 0;
      background: linear-gradient(135deg, #667eea, #764ba2);
      transition: width 0.3s ease;
    }
    
    &:hover {
      background: rgba(102, 126, 234, 0.05);
      transform: translateX(4px);
      
      &::before {
        width: 4px;
      }
      
      .q-icon {
        color: #667eea !important;
        transform: scale(1.1);
      }
    }
  }
  
  /* Dialog enhancements */
  .q-dialog .q-card {
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    backdrop-filter: blur(20px);
    background: rgba(255, 255, 255, 0.95);
    
    h3 {
      color: #2d3748;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 12px;
      margin-bottom: 24px;
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 60px;
        height: 2px;
        background: linear-gradient(90deg, #667eea, #764ba2);
        border-radius: 1px;
      }
    }
  }
  
  /* Input field enhancements */
  .q-field {
    .q-field__control {
      border-radius: 12px;
      
      &::before {
        border-radius: 12px;
      }
    }
    
    &.q-field--outlined {
      .q-field__control {
        transition: all 0.3s ease;
        
        &:hover::before {
          border-color: #667eea;
        }
      }
      
      &.q-field--focused .q-field__control::before {
        border-color: #667eea;
        border-width: 2px;
      }
    }
  }
  
  /* Responsive enhancements */
  @media (max-width: 768px) {
    .grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
    
    .header-container {
      flex-direction: column;
      gap: 16px;
      align-items: flex-start;
    }
    
    .button-group {
      width: 100%;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
    }
  
    .task-name {
      font-size: 1.2rem;
      margin-bottom: 0.25rem;
      
      
    }
    .description {
  margin-top: 0; /* Removes default top margin */
  font-size: 1rem;
}
.details-content,
.subtasks-content {
  padding-top: 0.75rem; /* Reduced space inside the content box */
}
    .q-card-section {
      padding: 16px;
    }
  }
  
  /* Subtle animations */
  @keyframes fadeInUp {
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
    animation: fadeInUp 0.6s ease-out;
  }
  
  .q-card:nth-child(2) {
    animation-delay: 0.1s;
  }
  
  .q-card:nth-child(3) {
    animation-delay: 0.2s;
  }
  
  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #5a67d8, #6b46c1);
  }
  </style>