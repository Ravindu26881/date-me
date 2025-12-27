<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1 class="logo">{{ t('app.logoPrefix') }}<span class="accent">{{ t('app.logoSuffix') }}</span></h1>
        <p class="tagline">{{ t('auth.registerTagline') }}</p>
      </div>

      <form @submit.prevent="handleRegister" class="auth-form">
        <!-- Step indicator -->
        <div class="step-indicator">
          <div :class="['step', { active: step === 1, completed: step > 1 }]">
            <span class="step-number">1</span>
            <span class="step-label">{{ t('auth.stepAccount') }}</span>
          </div>
          <div class="step-line" :class="{ filled: step > 1 }"></div>
          <div :class="['step', { active: step === 2, completed: step > 2 }]">
            <span class="step-number">2</span>
            <span class="step-label">{{ t('auth.stepProfile') }}</span>
          </div>
        </div>

        <!-- Step 1: Account Info -->
        <div v-if="step === 1" class="form-step" key="step1">
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
                :placeholder="t('auth.emailPlaceholder')"
                required
                autocomplete="email"
              />
            </div>
          </div>

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
                :placeholder="t('auth.usernamePlaceholder')"
                required
                autocomplete="username"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="password">{{ t('auth.password') }}</label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input 
                id="password"
                v-model="formData.password" 
                :type="showPassword ? 'text' : 'password'"
                :placeholder="t('auth.passwordPlaceholder')"
                required
                minlength="6"
                autocomplete="new-password"
              />
              <button 
                type="button" 
                class="password-toggle"
                @click="showPassword = !showPassword"
              >
                <svg v-if="!showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
            <div class="password-strength" v-if="formData.password">
              <div class="strength-bar">
                <div :class="['strength-fill', passwordStrength.class]" :style="{ width: passwordStrength.width }"></div>
              </div>
              <span :class="['strength-text', passwordStrength.class]">{{ passwordStrength.text }}</span>
            </div>
          </div>

          <button type="button" class="btn-primary" @click="nextStep" :disabled="!isStep1Valid">
            {{ t('auth.continue') }}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        <!-- Step 2: Profile Info -->
        <div v-if="step === 2" class="form-step" key="step2">
          <div class="form-row">
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
                  :placeholder="t('auth.agePlaceholder')"
                  required
                  min="18"
                  max="120"
                />
              </div>
            </div>
          </div>

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
                  required
                />
                <span class="option-icon">{{ option.icon }}</span>
                <span class="option-label">{{ option.label }}</span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label>{{ t('auth.orientation') }}</label>
            <div class="select-wrapper">
              <select v-model="formData.sexualOrientation" required>
                <option value="" disabled>{{ t('auth.selectOrientation') }}</option>
                <option v-for="option in orientationOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <svg class="select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
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

          <div class="button-row">
            <button type="button" class="btn-secondary" @click="prevStep">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              {{ t('auth.back') }}
            </button>
            <button type="submit" class="btn-primary" :disabled="isLoading || !isStep2Valid">
              <span v-if="isLoading" class="loader"></span>
              <span v-else>{{ t('auth.createAccount') }}</span>
            </button>
          </div>
        </div>
      </form>

      <div class="auth-footer">
        <p>{{ t('auth.haveAccount') }} 
          <a href="#" @click.prevent="$emit('switch-to-login')">{{ t('auth.signIn') }}</a>
        </p>
      </div>

      <div class="decorative-hearts">
        <span class="heart heart-1">✨</span>
        <span class="heart heart-2">💝</span>
        <span class="heart heart-3">💫</span>
      </div>
    </div>
  </div>
</template>

<script>
import { t } from '@/lang';
import { register } from '@/services/authService';

export default {
  name: 'UserRegister',
  data() {
    return {
      step: 1,
      formData: {
        email: '',
        username: '',
        password: '',
        age: null,
        sex: '',
        sexualOrientation: ''
      },
      showPassword: false,
      isLoading: false,
      error: null,
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
    passwordStrength() {
      const password = this.formData.password;
      if (!password) return { text: '', class: '', width: '0%' };
      
      let score = 0;
      if (password.length >= 6) score++;
      if (password.length >= 10) score++;
      if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
      if (/\d/.test(password)) score++;
      if (/[^a-zA-Z0-9]/.test(password)) score++;

      const levels = [
        { text: this.t('auth.weak'), class: 'weak', width: '20%' },
        { text: this.t('auth.fair'), class: 'fair', width: '40%' },
        { text: this.t('auth.good'), class: 'good', width: '60%' },
        { text: this.t('auth.strong'), class: 'strong', width: '80%' },
        { text: this.t('auth.veryStrong'), class: 'very-strong', width: '100%' }
      ];

      return levels[Math.min(score, levels.length - 1)];
    },
    isStep1Valid() {
      return this.formData.email && this.formData.username && this.formData.password.length >= 6;
    },
    isStep2Valid() {
      return this.formData.age >= 18 && this.formData.sex && this.formData.sexualOrientation;
    }
  },
  methods: {
    t,
    nextStep() {
      if (this.isStep1Valid) {
        this.step = 2;
      }
    },
    prevStep() {
      this.step = 1;
      this.error = null;
    },
    async handleRegister() {
      this.error = null;
      this.isLoading = true;

      try {
        const user = await register(this.formData);
        this.$emit('register-success', user);
      } catch (err) {
        this.error = err.message || this.t('auth.registerError');
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
}

.auth-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 24px;
  padding: 2.5rem;
  width: 100%;
  max-width: 480px;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  animation: cardAppear 0.6s ease-out;
}

@keyframes cardAppear {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.auth-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--accent-purple), var(--accent-pink), var(--accent-coral));
  border-radius: 24px 24px 0 0;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.5px;
  margin-bottom: 0.5rem;
}

.logo .accent {
  background: linear-gradient(135deg, var(--accent-pink) 0%, var(--accent-coral) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.tagline {
  color: var(--text-muted);
  font-size: 0.95rem;
  font-weight: 400;
}

/* Step Indicator */
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 0.5rem;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-muted);
  transition: all 0.3s ease;
}

.step.active .step-number {
  background: linear-gradient(135deg, var(--accent-pink), var(--accent-coral));
  border-color: transparent;
  color: white;
}

.step.completed .step-number {
  background: var(--color-like);
  border-color: transparent;
  color: white;
}

.step-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  transition: color 0.3s ease;
}

.step.active .step-label {
  color: var(--text-primary);
}

.step-line {
  width: 60px;
  height: 2px;
  background: rgba(255, 255, 255, 0.15);
  margin-bottom: 1.2rem;
  transition: background 0.3s ease;
}

.step-line.filled {
  background: linear-gradient(90deg, var(--color-like), var(--accent-pink));
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-step {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  animation: fadeSlide 0.3s ease;
}

@keyframes fadeSlide {
  from {
    opacity: 0;
    transform: translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  padding-left: 0.25rem;
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

.form-group input[type="email"],
.form-group input[type="text"],
.form-group input[type="password"],
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

.form-group input::placeholder {
  color: var(--text-faded);
}

.form-group input:focus {
  outline: none;
  border-color: var(--accent-pink);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(240, 147, 251, 0.15);
}

/* Password strength */
.password-strength {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.25rem;
}

.strength-bar {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease, background 0.3s ease;
}

.strength-fill.weak { background: #ff6b6b; }
.strength-fill.fair { background: #ffa94d; }
.strength-fill.good { background: #ffd43b; }
.strength-fill.strong { background: #69db7c; }
.strength-fill.very-strong { background: var(--color-like); }

.strength-text {
  font-size: 0.75rem;
  font-weight: 500;
  min-width: 70px;
}

.strength-text.weak { color: #ff6b6b; }
.strength-text.fair { color: #ffa94d; }
.strength-text.good { color: #ffd43b; }
.strength-text.strong { color: #69db7c; }
.strength-text.very-strong { color: var(--color-like); }

.password-toggle {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle svg {
  width: 20px;
  height: 20px;
  color: var(--text-muted);
  transition: color 0.2s ease;
}

.password-toggle:hover svg {
  color: var(--text-primary);
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

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  background: rgba(255, 107, 107, 0.15);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 10px;
  color: #ff8a8a;
  font-size: 0.875rem;
  animation: shake 0.4s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.error-message svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.button-row {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.btn-primary {
  flex: 1;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, var(--accent-pink) 0%, var(--accent-coral) 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.btn-primary:hover:not(:disabled)::before {
  left: 100%;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(240, 147, 251, 0.4);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.25);
}

.loader {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.auth-footer {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.auth-footer p {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.auth-footer a {
  color: var(--accent-pink);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.auth-footer a:hover {
  color: var(--accent-coral);
  text-decoration: underline;
}

.decorative-hearts {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.heart {
  position: absolute;
  font-size: 1.25rem;
  opacity: 0.12;
  animation: float 6s ease-in-out infinite;
}

.heart-1 {
  top: 8%;
  right: 8%;
  animation-delay: 0s;
}

.heart-2 {
  bottom: 12%;
  left: 6%;
  animation-delay: 2s;
}

.heart-3 {
  top: 45%;
  right: 4%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(5deg); }
}

@media (max-width: 480px) {
  .auth-card {
    padding: 1.75rem 1.25rem;
    margin: 1rem;
  }
  
  .logo {
    font-size: 1.85rem;
  }
  
  .option-group {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }
  
  .option-card {
    padding: 0.75rem 0.35rem;
  }
}
</style>

