<script setup lang="ts">
import { ref } from 'vue'
import { z, ZodError } from 'zod'
import { useRouter } from 'vue-router'
import { useAuthStore } from "src/stores/auth.store";
const router = useRouter()

//valiation schema with zod 
const loginSchema = z.object ({
    email: z.string().email('Invalid Email address'),
    password: z.string().min(6, 'Password must be atleast six characters'),
    role: z.string().min(1, 'Please select a role'),
    remember: z.boolean()
})
// Define the form data type
type LoginFormData = z.infer<typeof loginSchema>

// Creating reactive form data
const form = ref<LoginFormData>({
  email: '',
  password: '',
  role: '',       
  remember: false 

})
// Reactive error messages
const errors = ref<{ email: string | undefined; password: string | undefined }>({
    email: undefined,
    password: undefined,
});

const handleSubmit = () => {
    try {
        // Validate form data
        loginSchema.parse(form.value);
        errors.value = {
        
            email: undefined,
            password: undefined,
            
        };
        const auth = useAuthStore();
        auth.setSession({
            email: form.value.email,           // Full email
            role: form.value.role as 'Employee' | 'Administrator',
            remember: form.value.remember
        });

        console.log('Login successful - Session set:', auth.session);
        console.log('Email in session:', auth.session?.email);

        // UI-first: just log success for now
        const username = form.value.email.split('@')[0]
router.push({ 
  path: '/dashboard', 
  query: { role: form.value.role, user: username } 
})

        console.log('Login successful', form.value);
    } catch (err) {
        if (err instanceof ZodError) {
            const zodErrors: Record<string, string[]> = err.flatten().fieldErrors;
            errors.value = {
                email: zodErrors.email?.[0],
                password: zodErrors.password?.[0],
            };
        } else {
            // Handle unexpected errors
            console.error('Unexpected error:', err);
        }
    }
};
      


</script>


<template>
  <div class="q-pa-xl flex flex-center">
    <q-card class="q-pa-lg" style="max-width: 400px; width: 100%;">
      <!-- Welcome text -->
      <div class="text-h5 text-center q-mb-md q-pa-md">Welcome Back</div>

      <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
        <!-- Email -->
        <div class="text-h10 q-mb-md">Email
        <q-input
          filled
          v-model="form.email"
          label="Enter your Email"
          type="email"
          :error="!!errors.email"
          :error-message="errors.email"
        />
      </div>

        <!-- Password -->
        <div class="text-h10  q-mb-md">Enter your password
        <q-input
          filled
          v-model="form.password"
          label="Password"
          type="password"
          :error="!!errors.password"
          :error-message="errors.password"
        />
      </div>

        <!-- Role dropdown -->
        <div class="text-h10  q-mb-md">Role
        <q-select
          filled
          v-model="form.role"
          label="Role"
          :options="['Employee', 'Administrator']"
        />
        </div>

        <!-- Remember me checkbox -->
        <q-checkbox v-model="form.remember" label="Remember Me" />

        <!-- Login button centered -->
        <div class="flex flex-center">
          <q-btn type="submit" label="Login" color="primary" class="q-mt-md" />
        </div>

        <!-- Signup link -->
        <div class="text-center q-mt-md">
          Don't have an account?
          <q-btn
            flat
            color="primary"
            label="Signup"
            to="/signup"
            class="q-ml-xs"
          />
        </div>
      </q-form>
    </q-card>
  </div>
</template>
