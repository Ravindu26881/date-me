<template>
  <div 
    class="user-card" 
    :class="{ 'swiping-left': swipeDirection === 'left', 'swiping-right': swipeDirection === 'right' }"
    :style="cardStyle"
  >
    <div class="card-gradient"></div>
    
    <div class="card-content">
      <div class="user-avatar">
        {{ user.username.charAt(0).toUpperCase() }}
      </div>
      
      <div class="user-info">
        <h2 class="username">{{ user.username }}</h2>
        <p class="age">{{ user.age }} {{ texts.yearsOld }}</p>
        
        <div class="tags">
          <span class="tag sex-tag">{{ formatSex(user.sex) }}</span>
          <span class="tag orientation-tag">{{ formatOrientation(user.sexualOrientation) }}</span>
        </div>
      </div>

      <div class="swipe-indicator left" :class="{ visible: swipeDirection === 'left' }">
        <span>{{ texts.nope }}</span>
      </div>
      <div class="swipe-indicator right" :class="{ visible: swipeDirection === 'right' }">
        <span>{{ texts.like }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { t } from '@/lang';

export default {
  name: 'UserCard',
  props: {
    user: {
      type: Object,
      required: true
    },
    swipeDirection: {
      type: String,
      default: null
    }
  },
  computed: {
    texts() {
      return {
        yearsOld: t('card.yearsOld'),
        nope: t('card.nope'),
        like: t('card.like')
      };
    },
    cardStyle() {
      const gradients = [
        'var(--gradient-1)',
        'var(--gradient-2)',
        'var(--gradient-3)',
        'var(--gradient-4)',
        'var(--gradient-5)',
        'var(--gradient-6)',
        'var(--gradient-7)',
        'var(--gradient-8)'
      ];
      return {
        background: gradients[this.user.id % gradients.length]
      };
    }
  },
  methods: {
    formatSex(sex) {
      return sex.charAt(0).toUpperCase() + sex.slice(1);
    },
    formatOrientation(orientation) {
      return orientation.charAt(0).toUpperCase() + orientation.slice(1);
    }
  }
};
</script>

<style scoped>
.user-card {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px var(--shadow-dark);
  transition: transform 0.3s ease, opacity 0.3s ease;
  will-change: transform;
}

.user-card.swiping-left {
  transform: translateX(-120%) rotate(-20deg);
  opacity: 0;
}

.user-card.swiping-right {
  transform: translateX(120%) rotate(20deg);
  opacity: 0;
}

.card-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: var(--overlay-gradient);
  z-index: 1;
}

.card-content {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  z-index: 2;
}

.user-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 700;
  color: var(--text-primary);
  text-shadow: 0 2px 10px var(--shadow-medium);
  margin-bottom: 1.5rem;
  border: 4px solid var(--glass-border);
}

.user-info {
  text-align: center;
  color: var(--text-primary);
}

.username {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 20px var(--shadow-dark);
  letter-spacing: 0.5px;
}

.age {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin: 0 0 1.5rem 0;
  font-weight: 300;
}

.tags {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

.tag {
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
}

.sex-tag {
  background: var(--glass-bg);
  color: var(--text-primary);
}

.orientation-tag {
  background: var(--glass-bg-light);
  color: var(--text-primary);
  border: 1px solid var(--glass-border-light);
}

.swipe-indicator {
  position: absolute;
  top: 50%;
  transform: translateY(-50%) rotate(-20deg);
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: 3px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.swipe-indicator.left {
  left: 2rem;
  border: 4px solid var(--color-dislike);
  color: var(--color-dislike);
}

.swipe-indicator.right {
  right: 2rem;
  border: 4px solid var(--color-like);
  color: var(--color-like);
  transform: translateY(-50%) rotate(20deg);
}

.swipe-indicator.visible {
  opacity: 1;
}
</style>
