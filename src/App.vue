<template>
  <div id="app">
    <!-- Auth views -->
    <template v-if="!isAuthenticated">
      <UserLogin 
        v-if="authView === 'login'"
        @login-success="handleAuthSuccess"
        @switch-to-register="authView = 'register'"
      />
      <UserRegister 
        v-else
        @register-success="handleAuthSuccess"
        @switch-to-login="authView = 'login'"
      />
    </template>

    <!-- Main app view -->
    <template v-else>
      <div class="app-header">
        <h1 class="logo">{{ logoPrefix }}<span class="accent">{{ logoSuffix }}</span></h1>
        
        <!-- User Menu -->
        <div class="user-menu" v-click-outside="closeUserMenu">
          <button class="user-btn" @click="toggleUserMenu" :class="{ active: showUserMenu }">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </button>
          
          <!-- Dropdown Menu -->
          <transition name="dropdown">
            <div v-if="showUserMenu" class="user-dropdown">
              <div class="user-info">
                <div class="user-avatar">
                  {{ userInitial }}
                </div>
                <div class="user-details">
                  <span class="user-name">{{ displayName }}</span>
                  <span class="user-email">{{ currentUser?.email || '' }}</span>
                </div>
              </div>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item logout" @click="handleLogout">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                {{ t('auth.logout') }}
              </button>
            </div>
          </transition>
        </div>
      </div>
      <SwipeCarousel />
    </template>
  </div>
</template>

<script>
import SwipeCarousel from './components/SwipeCarousel.vue'
import UserLogin from './components/layout/auth/login.vue'
import UserRegister from './components/layout/auth/register.vue'
import { t } from '@/lang'
import { isLoggedIn, logout, getCurrentUser } from '@/services/authService'

export default {
  name: 'App',
  components: {
    SwipeCarousel,
    UserLogin,
    UserRegister
  },
  directives: {
    'click-outside': {
      bind(el, binding) {
        el._clickOutsideHandler = (event) => {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value(event);
          }
        };
        document.addEventListener('click', el._clickOutsideHandler);
      },
      unbind(el) {
        document.removeEventListener('click', el._clickOutsideHandler);
      }
    }
  },
  data() {
    return {
      isAuthenticated: false,
      currentUser: null,
      authView: 'login',
      showUserMenu: false
    }
  },
  computed: {
    logoPrefix() {
      return t('app.logoPrefix');
    },
    logoSuffix() {
      return t('app.logoSuffix');
    },
    displayName() {
      return this.currentUser?.username || this.currentUser?.name || 'User';
    },
    userInitial() {
      return this.displayName.charAt(0).toUpperCase();
    }
  },
  created() {
    this.checkAuth();
  },
  methods: {
    t,
    async checkAuth() {
      if (isLoggedIn()) {
        try {
          this.currentUser = await getCurrentUser();
          this.isAuthenticated = true;
        } catch {
          // Token invalid, clear it
          this.isAuthenticated = false;
        }
      }
    },
    handleAuthSuccess(user) {
      this.currentUser = user;
      this.isAuthenticated = true;
    },
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu;
    },
    closeUserMenu() {
      this.showUserMenu = false;
    },
    handleLogout() {
      this.showUserMenu = false;
      logout();
      this.isAuthenticated = false;
      this.currentUser = null;
      this.authView = 'login';
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 50%, var(--bg-tertiary) 100%);
  min-height: 100vh;
}

#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

#app::before {
  content: '';
  position: fixed;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 30% 20%, var(--ambient-pink) 0%, transparent 50%),
              radial-gradient(circle at 70% 80%, var(--ambient-coral) 0%, transparent 40%);
  pointer-events: none;
  z-index: 0;
}

.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 1.5rem 2rem;
  z-index: 100;
  background: var(--header-gradient);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.5px;
}

.logo .accent {
  background: linear-gradient(135deg, var(--accent-pink) 0%, var(--accent-coral) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* User Menu */
.user-menu {
  position: relative;
}

.user-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-btn:hover,
.user-btn.active {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.25);
  transform: scale(1.05);
}

.user-btn.active {
  background: linear-gradient(135deg, var(--accent-pink) 0%, var(--accent-coral) 100%);
  border-color: transparent;
}

.user-btn svg {
  width: 22px;
  height: 22px;
  color: var(--text-primary);
  transition: color 0.2s ease;
}

/* Dropdown */
.user-dropdown {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  background: rgba(30, 30, 50, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  min-width: 260px;
  padding: 0.5rem;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  z-index: 200;
}

.user-dropdown::before {
  content: '';
  position: absolute;
  top: -6px;
  right: 16px;
  width: 12px;
  height: 12px;
  background: rgba(30, 30, 50, 0.95);
  border-left: 1px solid rgba(255, 255, 255, 0.12);
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  transform: rotate(45deg);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem;
  border-radius: 12px;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-pink) 0%, var(--accent-coral) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  flex-shrink: 0;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  overflow: hidden;
}

.user-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: 0.8rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0.25rem 0.5rem;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.875rem;
  background: none;
  border: none;
  border-radius: 10px;
  color: var(--text-secondary);
  font-size: 0.95rem;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.dropdown-item svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.dropdown-item.logout:hover {
  background: rgba(255, 107, 107, 0.15);
  color: #ff8a8a;
}

/* Dropdown Animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.dropdown-enter-to,
.dropdown-leave {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>
