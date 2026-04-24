import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: (() => {
    try {
      const stored = localStorage.getItem('petcare_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      localStorage.removeItem('petcare_user');
      return null;
    }
  })(),
  token: localStorage.getItem('petcare_token') || null,
  
  login: (userData, token) => {
    localStorage.setItem('petcare_user', JSON.stringify(userData));
    localStorage.setItem('petcare_token', token);
    set({ user: userData, token });
  },
  
  logout: () => {
    localStorage.removeItem('petcare_user');
    localStorage.removeItem('petcare_token');
    set({ user: null, token: null });
  }
}));

export default useAuthStore;
