<template>
  <q-page padding>
    <q-card class="q-pa-lg shadow-2 rounded-borders">
      <q-card-section class="row items-center">
        <q-avatar size="100px" class="q-mr-lg bg-primary text-white text-h3">
          {{ userEmail?.charAt(0).toUpperCase() || 'G' }}
        </q-avatar>
        <div>
          <div class="text-h6">{{ displayName }}</div>
          <div class="text-subtitle2 text-grey-7">{{ userEmail }}</div>
          <div class="text-caption text-grey-6" v-if="auth.session?.role">
            Role: {{ auth.session.role }}
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form @submit.prevent="updateProfile">
          <q-input
            v-model="form.fullName"
            label="Full Name"
            outlined
            class="q-mb-md"
          />
          <q-input
            v-model="form.email"
            label="Email"
            type="email"
            outlined
            class="q-mb-md"
            :readonly="true"
            hint="Email cannot be changed"
          />
          <q-input
            v-model="form.phone"
            label="Phone Number"
            outlined
            class="q-mb-md"
          />
          <q-input
            v-model="form.bio"
            label="Bio"
            type="textarea"
            outlined
            class="q-mb-md"
          />
          <div class="row justify-end">
            <q-btn
 
  label="Update Profile"
  color="primary"
  type="submit"
  unelevated
/>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "src/stores/auth.store";
import { useQuasar } from 'quasar'; 
import { URL } from "url";

const auth = useAuthStore();
const $q = useQuasar();

// Load session from localStorage on page load
auth.loadFromStorage();

// Get user data from auth store (clean approach)
const userEmail = computed(() => auth.email || 'guest@example.com');
const displayName = computed(() => generateDisplayNameFromEmail(userEmail.value));

// Form data for editing
const form = ref({
  fullName: '',
  email: '',
  phone: '',
  bio: ''
});

// Function to generate display name from email
const generateDisplayNameFromEmail = (email: string): string => {
  if (!email || email === 'guest@example.com') return 'Guest User';
  
  const username = email.split('@')[0];
  if (!username) return 'Guest User';
  
  return username
    .split(/[._-]/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
};

// Load saved profile data or initialize with session data
onMounted(() => {
  const savedProfile = JSON.parse(localStorage.getItem('userProfile') || 'null');
  
  // Generate full name from email
  const emailBasedName = generateDisplayNameFromEmail(userEmail.value);
  
  // If there's saved profile data, use it; otherwise use email-based name
  form.value = {
    fullName: savedProfile?.fullName || emailBasedName, // 🎯 Now uses the function directly!
    email: userEmail.value, // Always use session email
    phone: savedProfile?.phone || "+237 600 000 000",
    bio: savedProfile?.bio || "Passionate software engineer and problem solver."
  };
});

// Update profile function
function updateProfile() {
  const profileData = {
    fullName: form.value.fullName,
    phone: form.value.phone,
    bio: form.value.bio,
    email: form.value.email,
    lastUpdated: new Date().toISOString()
  };
  
  localStorage.setItem('userProfile', JSON.stringify(profileData));
 
  $q.notify({
    message: 'Profile updated successfully!',
    color: 'positive',
    icon: 'done',
    position: 'bottom-right',
    group: false 
  });
  
  }


</script>
<style scoped>
.rounded-borders {
  border-radius: 16px;
}

.q-page {
  background: linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh; /* Ensure it takes up the full viewport height */
}

.q-card {
  width: 100%; /* Make the card wider */
  max-width: 1500px; /* Set a new, larger max-width */
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.q-card:hover {
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.15);
}

.q-card-section {
  padding: 32px;
}

.q-separator {
  margin: 16px 0;
  background-color: #e0e6ed;
}

.q-avatar {
  border: 5px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.q-avatar:hover {
  transform: scale(1.05);
}

.q-input {
  border-radius: 8px;
  background-color: #fcfdfe;
}

.q-btn.bg-primary {
  padding: 14px 30px;
  font-weight: 600;
  letter-spacing: 0.5px;
  border-radius: 10px;
  text-transform: capitalize;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.q-btn.bg-primary:hover {
  background-color: #1a73e8 !important;
  transform: translateY(-2px);
}
</style>











