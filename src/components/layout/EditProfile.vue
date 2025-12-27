<template>
  <div class="edit-profile-container">
    <div class="edit-header">
      <button class="back-btn" @click="$emit('go-back')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>
      <h1 class="edit-title">{{ t('profile.editTitle') }}</h1>
      <button 
        class="save-btn" 
        @click="handleSave" 
        :disabled="isSaving || !hasChanges"
      >
        <span v-if="isSaving" class="loader"></span>
        <span v-else>{{ t('profile.save') }}</span>
      </button>
    </div>

    <div class="edit-content">
      <!-- Avatar Section -->
      <div class="avatar-section">
        <div class="avatar-wrapper">
          <div class="avatar">
            {{ userInitial }}
          </div>
          <button class="avatar-edit-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </button>
        </div>
        <p class="avatar-hint">{{ t('profile.photoHint') }}</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSave" class="edit-form">
        <div class="form-section">
          <h2 class="form-section-title">{{ t('profile.basicInfo') }}</h2>
          
          <div class="form-group">
            <label for="username">{{ t('auth.username') }}</label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <input 
                id="username"
                v-model="formData.username" 
                type="text" 
                :placeholder="t('profile.usernamePlaceholder')"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="email">{{ t('auth.email') }}</label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <input 
                id="email"
                v-model="formData.email" 
                type="email" 
                :placeholder="t('profile.emailPlaceholder')"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="age">{{ t('auth.age') }}</label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <input 
                id="age"
                v-model.number="formData.age" 
                type="number" 
                min="18"
                max="120"
                required
              />
            </div>
          </div>
        </div>

        <div class="form-section">
          <h2 class="form-section-title">{{ t('profile.aboutMe') }}</h2>
          
          <div class="form-group">
            <label for="bio">{{ t('profile.bio') }}</label>
            <textarea 
              id="bio"
              v-model="formData.bio" 
              :placeholder="t('profile.bioPlaceholder')"
              rows="4"
              maxlength="500"
            ></textarea>
            <span class="char-count">{{ formData.bio?.length || 0 }}/500</span>
          </div>
        </div>

        <div class="form-section">
          <h2 class="form-section-title">{{ t('profile.identity') }}</h2>
          
          <div class="form-group">
            <label>{{ t('auth.sex') }}</label>
            <div class="option-group">
              <label 
                v-for="option in sexOptions" 
                :key="option.value"
                :class="['option-card', { selected: formData.sex === option.value }]"
              >
                <input 
                  type="radio" 
                  v-model="formData.sex" 
                  :value="option.value"
                />
                <span class="option-icon">{{ option.icon }}</span>
                <span class="option-label">{{ option.label }}</span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label>{{ t('auth.orientation') }}</label>
            <div class="select-wrapper">
              <select v-model="formData.sexualOrientation">
                <option v-for="option in orientationOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <svg class="select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
          </div>
        </div>

        <div v-if="error" class="error-message">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {{ error }}
        </div>

        <div v-if="success" class="success-message">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          {{ t('profile.saveSuccess') }}
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { t } from '@/lang';
import { updateUser } from '@/services/userService';

export default {
  name: 'EditProfile',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      formData: {
        username: '',
        email: '',
        age: null,
        bio: '',
        sex: '',
        sexualOrientation: ''
      },
      originalData: null,
      isSaving: false,
      error: null,
      success: false,
      sexOptions: [
        { value: 'male', label: t('auth.male'), icon: '👨' },
        { value: 'female', label: t('auth.female'), icon: '👩' },
        { value: 'other', label: t('auth.other'), icon: '🧑' }
      ],
      orientationOptions: [
        { value: 'heterosexual', label: t('auth.heterosexual') },
        { value: 'homosexual', label: t('auth.homosexual') },
        { value: 'bisexual', label: t('auth.bisexual') },
        { value: 'pansexual', label: t('auth.pansexual') },
        { value: 'asexual', label: t('auth.asexual') },
        { value: 'other', label: t('auth.otherOrientation') }
      ]
    };
  },
  computed: {
    userInitial() {
      return (this.formData.username || 'U').charAt(0).toUpperCase();
    },
    hasChanges() {
      if (!this.originalData) return false;
      return JSON.stringify(this.formData) !== JSON.stringify(this.originalData);
    }
  },
  created() {
    this.loadUserData();
  },
  watch: {
    user: {
      handler() {
        this.loadUserData();
      },
      deep: true
    }
  },
  methods: {
    t,
    loadUserData() {
      if (this.user) {
        this.formData = {
          username: this.user.username || '',
          email: this.user.email || '',
          age: this.user.age || null,
          bio: this.user.bio || '',
          sex: this.user.sex || '',
          sexualOrientation: this.user.sexualOrientation || ''
        };
        this.originalData = { ...this.formData };
      }
    },
    async handleSave() {
      if (!this.hasChanges) return;
      
      this.error = null;
      this.success = false;
      this.isSaving = true;

      try {
        const updatedUser = await updateUser(this.user._id || this.user.id, this.formData);
        
        if (updatedUser) {
          this.originalData = { ...this.formData };
          this.success = true;
          this.$emit('profile-updated', updatedUser);
          
          // Hide success message after 3 seconds
          setTimeout(() => {
            this.success = false;
          }, 3000);
        }
      } catch (err) {
        this.error = err.message || this.t('profile.saveError');
      } finally {
        this.isSaving = false;
      }
    }
  }
};
</script>

<style scoped>
.edit-profile-container {
  min-height: 100vh;
  padding-top: 80px;
  position: relative;
  z-index: 1;
}

.edit-header {
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

.edit-title {
  flex: 1;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.save-btn {
  background: linear-gradient(135deg, var(--accent-pink), var(--accent-coral));
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  color: white;
  font-size: 0.95rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(240, 147, 251, 0.35);
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.edit-content {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 1.5rem 3rem;
}

/* Avatar Section */
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.avatar-wrapper {
  position: relative;
  margin-bottom: 0.75rem;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-pink), var(--accent-coral));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
}

.avatar-edit-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--bg-primary);
  border: 2px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.avatar-edit-btn:hover {
  background: var(--bg-secondary);
  transform: scale(1.1);
}

.avatar-edit-btn svg {
  width: 18px;
  height: 18px;
  color: var(--text-primary);
}

.avatar-hint {
  font-size: 0.85rem;
  color: var(--text-muted);
}

/* Form */
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
}

.form-section-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.form-group {
  margin-bottom: 1.25rem;
  position: relative;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  width: 20px;
  height: 20px;
  color: var(--text-muted);
  pointer-events: none;
  transition: color 0.2s ease;
}

.input-wrapper:focus-within .input-icon {
  color: var(--accent-pink);
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="number"] {
  width: 100%;
  padding: 0.9rem 1rem 0.9rem 3rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: var(--text-primary);
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--accent-pink);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(240, 147, 251, 0.15);
}

.form-group textarea {
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: var(--text-primary);
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s ease;
}

.form-group textarea:focus {
  outline: none;
  border-color: var(--accent-pink);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(240, 147, 251, 0.15);
}

.char-count {
  position: absolute;
  bottom: 0.75rem;
  right: 1rem;
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* Option cards (sex selection) */
.option-group {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.option-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 1rem 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option-card input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.option-card:hover {
  border-color: rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.08);
}

.option-card.selected {
  border-color: var(--accent-pink);
  background: rgba(240, 147, 251, 0.15);
}

.option-icon {
  font-size: 1.5rem;
}

.option-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* Select dropdown */
.select-wrapper {
  position: relative;
}

.select-wrapper select {
  width: 100%;
  padding: 0.9rem 2.5rem 0.9rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: var(--text-primary);
  font-size: 1rem;
  font-family: inherit;
  cursor: pointer;
  appearance: none;
  transition: all 0.2s ease;
}

.select-wrapper select:focus {
  outline: none;
  border-color: var(--accent-pink);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(240, 147, 251, 0.15);
}

.select-wrapper select option {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.select-arrow {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: var(--text-muted);
  pointer-events: none;
}

/* Messages */
.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(255, 107, 107, 0.15);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 12px;
  color: #ff8a8a;
  font-size: 0.9rem;
}

.error-message svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.success-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(81, 207, 102, 0.15);
  border: 1px solid rgba(81, 207, 102, 0.3);
  border-radius: 12px;
  color: #69db7c;
  font-size: 0.9rem;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.success-message svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.loader {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 480px) {
  .edit-header {
    padding: 1rem;
  }
  
  .edit-content {
    padding: 0 1rem 2rem;
  }
  
  .edit-title {
    font-size: 1.25rem;
  }
  
  .form-section {
    padding: 1.25rem;
  }
  
  .option-group {
    gap: 0.5rem;
  }
}
</style>

