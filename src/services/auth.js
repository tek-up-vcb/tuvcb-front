const AUTH_API_BASE = `${import.meta.env.VITE_AUTH_API_URL || 'http://auth.localhost'}/auth`

class AuthService {
  async checkAuth() {
    try {
      const response = await fetch(`${AUTH_API_BASE}/check`, {
        credentials: 'include',
      })
      return response.ok
    } catch (error) {
      console.error('Auth check failed:', error)
      return false
    }
  }

  async getProfile() {
    try {
      const response = await fetch(`${AUTH_API_BASE}/profile`, {
        credentials: 'include',
      })
      if (response.ok) {
        return await response.json()
      }
      return null
    } catch (error) {
      console.error('Get profile failed:', error)
      return null
    }
  }

  async logout() {
    try {
      const response = await fetch(`${AUTH_API_BASE}/logout`, {
        method: 'POST',
        credentials: 'include',
      })
      return response.ok
    } catch (error) {
      console.error('Logout failed:', error)
      return false
    }
  }
}

export const authService = new AuthService()
