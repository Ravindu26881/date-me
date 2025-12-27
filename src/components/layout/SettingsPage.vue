<template>
  <div class="settings-container">
    <div class="settings-header">
      <button class="back-btn" @click="$emit('go-back')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>
      <h1 class="settings-title">{{ t('settings.title') }}</h1>
    </div>

    <div class="settings-content">
      <div class="settings-section">
        <h2 class="section-title">{{ t('settings.account') }}</h2>
        
        <div class="settings-list">
          <button class="settings-item" @click="$emit('edit-profile')">
            <div class="item-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div class="item-content">
              <span class="item-title">{{ t('settings.editProfile') }}</span>
              <span class="item-subtitle">{{ t('settings.editProfileDesc') }}</span>
            </div>
            <svg class="item-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>

          <button class="settings-item" @click="$emit('change-password')">
            <div class="item-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <div class="item-content">
              <span class="item-title">{{ t('settings.changePassword') }}</span>
              <span class="item-subtitle">{{ t('settings.changePasswordDesc') }}</span>
            </div>
            <svg class="item-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="settings-section">
        <h2 class="section-title">{{ t('settings.preferences') }}</h2>
        
        <div class="settings-list">
          <div class="settings-item">
            <div class="item-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            </div>
            <div class="item-content">
              <span class="item-title">{{ t('settings.notifications') }}</span>
              <span class="item-subtitle">{{ t('settings.notificationsDesc') }}</span>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="notifications">
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div class="settings-section danger-zone">
        <h2 class="section-title">{{ t('settings.dangerZone') }}</h2>
        
        <div class="settings-list">
          <button class="settings-item danger" @click="handleLogout">
            <div class="item-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </div>
            <div class="item-content">
              <span class="item-title">{{ t('settings.logout') }}</span>
              <span class="item-subtitle">{{ t('settings.logoutDesc') }}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { t } from '@/lang';

export default {
  name: 'SettingsPage',
  data() {
    return {
      notifications: true
    };
  },
  methods: {
    t,
    handleLogout() {
      this.$emit('logout');
    }
  }
};
</script>

<style scoped>
.settings-container {
  min-height: 100vh;
  padding-top: 80px;
  position: relative;
  z-index: 1;
}

.settings-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  margin-bottom: 1rem;
}

.back-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(-2px);
}

.back-btn svg {
  width: 22px;
  height: 22px;
  color: var(--text-primary);
}

.settings-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
}

.settings-content {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 1.5rem 2rem;
}

.settings-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.75rem;
  padding-left: 0.5rem;
}

.settings-list {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
}

.settings-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 1rem 1.25rem;
  background: none;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.settings-item:last-child {
  border-bottom: none;
}

.settings-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.settings-item.danger:hover {
  background: rgba(255, 107, 107, 0.1);
}

.item-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.item-icon svg {
  width: 22px;
  height: 22px;
  color: var(--accent-pink);
}

.settings-item.danger .item-icon {
  background: rgba(255, 107, 107, 0.15);
}

.settings-item.danger .item-icon svg {
  color: #ff8a8a;
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.item-title {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-primary);
}

.settings-item.danger .item-title {
  color: #ff8a8a;
}

.item-subtitle {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.item-arrow {
  width: 20px;
  height: 20px;
  color: var(--text-muted);
  flex-shrink: 0;
}

/* Toggle Switch */
.toggle {
  position: relative;
  display: inline-block;
  width: 52px;
  height: 28px;
  flex-shrink: 0;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 28px;
  transition: all 0.3s ease;
}

.toggle-slider::before {
  position: absolute;
  content: '';
  height: 22px;
  width: 22px;
  left: 3px;
  bottom: 3px;
  background: white;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle input:checked + .toggle-slider {
  background: linear-gradient(135deg, var(--accent-pink), var(--accent-coral));
}

.toggle input:checked + .toggle-slider::before {
  transform: translateX(24px);
}

.danger-zone .section-title {
  color: #ff8a8a;
}

@media (max-width: 480px) {
  .settings-header {
    padding: 1rem;
  }
  
  .settings-content {
    padding: 0 1rem 2rem;
  }
  
  .settings-title {
    font-size: 1.5rem;
  }
}
</style>

