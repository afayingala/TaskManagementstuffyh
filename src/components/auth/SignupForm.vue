<script setup lang="ts">
import { ref } from 'vue'
import { z, ZodError } from 'zod'

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password is required')
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
  
})

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: '',       
  remember: false 
})

const errors = ref<{ name: string | undefined; email: string | undefined; password: string | undefined; confirmPassword: string | undefined }>({
    name: undefined,
    email: undefined,
    password: undefined,
    confirmPassword: undefined,
});

const handleSubmit = () => {
    try {
        // Validate form data
        signupSchema.parse(form.value);
        errors.value = {
            name: undefined,
            email: undefined,
            password: undefined,
            confirmPassword: undefined,
        };
        console.log('Signup successful', form.value);
    } catch (err) {
        if (err instanceof ZodError) {
            const zodErrors: Record<string, string[]> = err.flatten().fieldErrors;
            errors.value = {
                name: zodErrors.name?.[0],
                email: zodErrors.email?.[0],
                password: zodErrors.password?.[0],
                confirmPassword: zodErrors.confirmPassword?.[0],
            };
        } else {
            console.error('Unexpected error:', err);
        }
    }
};
</script>
<template>
    <div class="q-pa-xl flex flex-center">
      <q-card class="q-pa-lg" style="max-width: 400px; width: 100%;">
        <!-- Title -->
        <div class="text-h5 text-center q-mb-md q-pa-md">Task Management Platform</div>
  
        <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
          <!-- Name -->
          <div class="text-h10 q-mb-md">Full name 
          <q-input
            filled
            v-model="form.name"
            label="Enter your name"
            :error="!!errors.name"
            :error-message="errors.name"
          />
          </div>
  
          <!-- Email -->
          <div class="text-h10  q-mb-md">Email
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
          <div class="text-h10  q-mb-md">Password
          <q-input
            filled
            v-model="form.password"
            label="Enter your Password"
            type="password"
            :error="!!errors.password"
            :error-message="errors.password"
          />
        </div>
  
          <!-- Confirm Password -->
          <div class="text-h10  q-mb-md">Confirm Password
          <q-input
            filled
            v-model="form.confirmPassword"
            label="Confirm Password"
            type="password"
            :error="!!errors.confirmPassword"
            :error-message="errors.confirmPassword"
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
  
          <!-- Remember Me -->
          <q-checkbox v-model="form.remember" label="Remember Me" />
  
          <!-- Centered button -->
          <div class="flex flex-center">
            <q-btn type="submit" label="Signup" color="primary" class="q-mt-md" />
          </div>
  
          <!-- Login link -->
          <div class="text-center q-mt-md">
            Have an account already?
            <q-btn
              flat
              color="primary"
              label="Login"
              to="/login"
              class="q-ml-xs"
            />
          </div>
        </q-form>
      </q-card>
    </div>
  </template>
  