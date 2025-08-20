<template>
  <div class="not-found-view">
    <div class="error-container">
      <div class="error-icon">🔍</div>
      <h1 class="error-title">404</h1>
      <p class="error-message">抱歉，您访问的页面不存在</p>
      <p class="error-description">
        可能是链接地址有误，或者页面已被移除
      </p>
      
      <div class="action-buttons">
        <Button @click="goHome" icon="🏠">返回首页</Button>
        <Button variant="outline" @click="goBack" icon="↩️">返回上一页</Button>
      </div>
      
      <div class="quick-links">
        <h3>快速导航</h3>
        <div class="links-grid">
          <RouterLink to="/" class="quick-link">
            <span class="link-icon">🏠</span>
            <span class="link-text">首页</span>
          </RouterLink>
          <RouterLink to="/exercise" class="quick-link">
            <span class="link-icon">🏃</span>
            <span class="link-text">运动</span>
          </RouterLink>
          <RouterLink to="/nutrition" class="quick-link">
            <span class="link-icon">🍎</span>
            <span class="link-text">饮食</span>
          </RouterLink>
          <RouterLink to="/sleep" class="quick-link">
            <span class="link-icon">😴</span>
            <span class="link-text">睡眠</span>
          </RouterLink>
          <RouterLink to="/stress" class="quick-link">
            <span class="link-icon">😌</span>
            <span class="link-text">压力</span>
          </RouterLink>
          <RouterLink to="/knowledge" class="quick-link">
            <span class="link-icon">📚</span>
            <span class="link-text">知识库</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from '@/components/ui/Button.vue'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
.not-found-view {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: var(--spacing-xl);
}

.error-container {
  text-align: center;
  max-width: 500px;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-lg);
  animation: bounce 2s infinite;
}

.error-title {
  font-size: 6rem;
  font-weight: 800;
  color: var(--color-primary);
  margin: 0 0 var(--spacing-md);
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.error-message {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm);
}

.error-description {
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-xl);
  line-height: 1.6;
}

.action-buttons {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  margin-bottom: var(--spacing-xl);
}

.quick-links {
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--color-border);
}

.quick-links h3 {
  font-size: 1.2rem;
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-lg);
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
}

.quick-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  text-decoration: none;
  color: var(--color-text-primary);
  transition: all 0.2s ease;
  border: 1px solid var(--color-border);
}

.quick-link:hover {
  background-color: var(--color-background-secondary);
  transform: translateY(-2px);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.link-icon {
  font-size: 1.5rem;
  margin-bottom: var(--spacing-xs);
}

.link-text {
  font-size: 0.9rem;
  font-weight: 500;
}

/* 动画效果 */
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .not-found-view {
    padding: var(--spacing-md);
    min-height: 50vh;
  }
  
  .error-title {
    font-size: 4rem;
  }
  
  .error-message {
    font-size: 1.2rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .links-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .links-grid {
    grid-template-columns: 1fr;
  }
  
  .quick-link {
    flex-direction: row;
    justify-content: flex-start;
    gap: var(--spacing-md);
  }
  
  .link-icon {
    margin-bottom: 0;
    font-size: 1.2rem;
  }
}
</style>
