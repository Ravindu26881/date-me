<template>
  <div id="app">
    <div class="app-header">
      <h1 class="logo">{{ logoPrefix }}<span class="accent">{{ logoSuffix }}</span></h1>
    </div>
    <SwipeCarousel />
  </div>
</template>

<script>
import SwipeCarousel from './components/SwipeCarousel.vue'
import { t } from '@/lang'

export default {
  name: 'App',
  components: {
    SwipeCarousel
  },
  computed: {
    logoPrefix() {
      return t('app.logoPrefix');
    },
    logoSuffix() {
      return t('app.logoSuffix');
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
</style>
