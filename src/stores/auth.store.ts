import { defineStore } from 'pinia'

export type UserSession = {
  email: string
  role: 'Employee' | 'Administrator'
  remember: boolean
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    session: null as UserSession | null
  }),
  getters: {
    isAuthenticated: (s) => !!s.session,
    role: (s) => s.session?.role ?? null,
    email: (s) => s.session?.email ?? null
  },
  actions: {
    setSession(payload: UserSession) {
      this.session = payload
      if (payload.remember) {
        localStorage.setItem('tm_session', JSON.stringify(payload))
      }
    },
    loadFromStorage() {
      const raw = localStorage.getItem('tm_session')
      if (raw) this.session = JSON.parse(raw)
    },
    logout() {
      this.session = null
      localStorage.removeItem('tm_session')
    }
  }
})
