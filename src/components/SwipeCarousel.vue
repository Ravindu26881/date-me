<template>
  <div class="swipe-carousel">
    <div class="cards-container">
      <div v-if="noMoreUsers" class="no-more-users">
        <div class="empty-state">
          <h2>{{ texts.noMoreProfiles }}</h2>
          <p>{{ texts.checkBackLater }}</p>
          <button class="reset-btn" @click="resetUsers">{{ texts.startOver }}</button>
        </div>
      </div>
      
      <template v-else>
        <!-- Background card (next user preview) -->
        <div v-if="nextUser" class="card-wrapper background-card">
          <UserCard :user="nextUser" />
        </div>
        
        <!-- Active card -->
        <div 
          v-if="currentUser" 
          class="card-wrapper active-card"
          @mousedown="startDrag"
          @mousemove="onDrag"
          @mouseup="endDrag"
          @mouseleave="endDrag"
          @touchstart="startDrag"
          @touchmove="onDrag"
          @touchend="endDrag"
          :style="dragStyle"
        >
          <UserCard :user="currentUser" :swipe-direction="swipeDirection" />
        </div>
      </template>
    </div>
    <div v-if="!noMoreUsers" class="action-buttons">
      <button class="action-btn dislike" @click="swipeLeft">
        <span class="btn-icon">&#x2715;</span>
      </button>
      <button class="action-btn super-like" @click="superLike">
        <span class="btn-icon">&#x2B50;</span>
      </button>
      <button class="action-btn like" @click="swipeRight">
        <span class="btn-icon">&#x2665;</span>
      </button>
    </div>

    <div class="progress-indicator">
      <span class="current">{{ currentIndex + 1 }}</span>
      <span class="separator">/</span>
      <span class="total">{{ users.length }}</span>
    </div>
  </div>
</template>

<script>
import UserCard from './UserCard.vue';
import { getUsers } from '@/services/userService';
import { t } from '@/lang';

export default {
  name: 'SwipeCarousel',
  components: {
    UserCard
  },
  data() {
    return {
      users: [],
      currentIndex: 0,
      swipeDirection: null,
      isDragging: false,
      dragStartX: 0,
      dragCurrentX: 0,
      dragOffset: 0
    };
  },
  computed: {
    texts() {
      return {
        noMoreProfiles: t('carousel.noMoreProfiles'),
        checkBackLater: t('carousel.checkBackLater'),
        startOver: t('carousel.startOver')
      };
    },
    currentUser() {
      return this.users[this.currentIndex] || null;
    },
    nextUser() {
      return this.users[this.currentIndex + 1] || null;
    },
    noMoreUsers() {
      return this.currentIndex >= this.users.length;
    },
    dragStyle() {
      if (!this.isDragging) return {};
      const rotate = this.dragOffset * 0.05;
      return {
        transform: `translateX(${this.dragOffset}px) rotate(${rotate}deg)`,
        transition: 'none'
      };
    }
  },
  async mounted() {
    await this.loadUsers();
  },
  methods: {
    async loadUsers() {
      this.users = await getUsers();
    },
    startDrag(event) {
      this.isDragging = true;
      const clientX = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX;
      this.dragStartX = clientX;
    },
    onDrag(event) {
      if (!this.isDragging) return;
      const clientX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
      this.dragCurrentX = clientX;
      this.dragOffset = this.dragCurrentX - this.dragStartX;
      
      if (this.dragOffset > 50) {
        this.swipeDirection = 'right';
      } else if (this.dragOffset < -50) {
        this.swipeDirection = 'left';
      } else {
        this.swipeDirection = null;
      }
    },
    endDrag() {
      if (!this.isDragging) return;
      this.isDragging = false;
      
      if (this.dragOffset > 100) {
        this.swipeRight();
      } else if (this.dragOffset < -100) {
        this.swipeLeft();
      } else {
        this.dragOffset = 0;
        this.swipeDirection = null;
      }
    },
    swipeLeft() {
      this.swipeDirection = 'left';
      setTimeout(() => {
        this.nextCard();
      }, 300);
    },
    swipeRight() {
      this.swipeDirection = 'right';
      setTimeout(() => {
        this.nextCard();
      }, 300);
    },
    superLike() {
      this.swipeDirection = 'right';
      setTimeout(() => {
        this.nextCard();
      }, 300);
    },
    nextCard() {
      this.currentIndex++;
      this.swipeDirection = null;
      this.dragOffset = 0;
    },
    resetUsers() {
      this.currentIndex = 0;
      this.swipeDirection = null;
    }
  }
};
</script>

<style scoped>
.swipe-carousel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.cards-container {
  position: relative;
  width: 100%;
  max-width: 380px;
  height: 520px;
  margin-bottom: 2rem;
}

.card-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  cursor: grab;
  user-select: none;
}

.card-wrapper:active {
  cursor: grabbing;
}

.background-card {
  transform: scale(0.95) translateY(10px);
  opacity: 0.7;
  z-index: 1;
}

.active-card {
  z-index: 2;
  transition: transform 0.15s ease;
}

.action-buttons {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.action-btn {
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 4px 20px var(--shadow-light);
}

.action-btn:hover {
  transform: scale(1.1);
}

.action-btn:active {
  transform: scale(0.95);
}

.action-btn.dislike {
  width: 60px;
  height: 60px;
  background: var(--btn-light-bg);
  border: 2px solid var(--color-dislike);
}

.action-btn.dislike .btn-icon {
  color: var(--color-dislike);
  font-size: 1.5rem;
  font-weight: bold;
}

.action-btn.like {
  width: 60px;
  height: 60px;
  background: var(--btn-like-bg);
  border: none;
}

.action-btn.like .btn-icon {
  color: var(--text-primary);
  font-size: 1.5rem;
}

.action-btn.super-like {
  width: 50px;
  height: 50px;
  background: var(--btn-super-like-bg);
  border: none;
}

.action-btn.super-like .btn-icon {
  color: var(--text-primary);
  font-size: 1.2rem;
}

.progress-indicator {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: var(--text-faded);
}

.progress-indicator .current {
  color: var(--text-primary);
  font-weight: 600;
}

.progress-indicator .separator {
  margin: 0 0.25rem;
}

.no-more-users {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state {
  text-align: center;
  color: var(--text-primary);
}

.heart-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
}

.empty-state h2 {
  font-family: 'Playfair Display', serif;
  font-size: 1.75rem;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  opacity: 0.7;
  margin: 0 0 2rem 0;
}

.reset-btn {
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  background: var(--btn-reset-bg);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 20px var(--shadow-accent);
}

.reset-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 30px var(--shadow-accent-hover);
}
</style>
