<template>
  <div class="nutrition-view">
    <div class="page-header">
      <h1>🍎 饮食记录</h1>
      <p class="subtitle">记录您的每日饮食，追踪营养摄入</p>
    </div>

    <div class="content-grid">
      <!-- 快速记录卡片 -->
      <Card title="快速记录" class="quick-record-card">
        <div class="quick-actions">
          <Button variant="primary" icon="🍳" @click="recordBreakfast">
            记录早餐
          </Button>
          <Button variant="primary" icon="🍲" @click="recordLunch">
            记录午餐
          </Button>
          <Button variant="primary" icon="🍽️" @click="recordDinner">
            记录晚餐
          </Button>
          <Button variant="secondary" icon="🍎" @click="recordSnack">
            记录加餐
          </Button>
        </div>
      </Card>

      <!-- 今日营养概览 -->
      <Card class="nutrition-overview">
        <template #header>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin: 0;">今日营养摄入</h3>
            <span class="date">{{ currentDate }}</span>
          </div>
        </template>
        <div class="nutrition-stats">
          <div class="stat-item">
            <div class="stat-label">总热量</div>
            <div class="stat-value">1200/1800</div>
            <div class="stat-unit">千卡</div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: 66%"></div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-label">蛋白质</div>
            <div class="stat-value">45/90</div>
            <div class="stat-unit">克</div>
            <div class="progress-bar">
              <div class="progress-fill protein" style="width: 50%"></div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-label">碳水</div>
            <div class="stat-value">150/225</div>
            <div class="stat-unit">克</div>
            <div class="progress-bar">
              <div class="progress-fill carbs" style="width: 66%"></div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-label">脂肪</div>
            <div class="stat-value">40/60</div>
            <div class="stat-unit">克</div>
            <div class="progress-bar">
              <div class="progress-fill fat" style="width: 66%"></div>
            </div>
          </div>
        </div>
      </Card>

      <!-- 饮食记录列表 -->
      <Card title="今日饮食记录" class="meal-list">
        <div class="meal-items">
          <div class="meal-item">
            <div class="meal-icon">🍳</div>
            <div class="meal-info">
              <div class="meal-name">早餐：燕麦粥 + 鸡蛋</div>
              <div class="meal-details">350千卡 · 蛋白质20g</div>
            </div>
            <div class="meal-time">08:00</div>
          </div>
          <div class="meal-item">
            <div class="meal-icon">🍲</div>
            <div class="meal-info">
              <div class="meal-name">午餐：鸡胸肉沙拉</div>
              <div class="meal-details">450千卡 · 蛋白质35g</div>
            </div>
            <div class="meal-time">12:30</div>
          </div>
          <div class="meal-item">
            <div class="meal-icon">🍎</div>
            <div class="meal-info">
              <div class="meal-name">加餐：苹果 + 坚果</div>
              <div class="meal-details">200千卡 · 蛋白质5g</div>
            </div>
            <div class="meal-time">16:00</div>
          </div>
        </div>
      </Card>

      <!-- 饮食建议 -->
      <Card title="饮食建议" class="nutrition-tips">
        <ul class="tips-list">
          <li>✅ 晚餐建议增加蔬菜摄入</li>
          <li>✅ 蛋白质摄入接近目标，继续保持</li>
          <li>⚠️ 注意控制晚餐的碳水摄入量</li>
        </ul>
      </Card>

      <!-- 食物数据库入口 -->
      <Card title="食物数据库" class="food-database-card">
        <div class="food-database-content">
          <p>探索丰富的食物营养信息，管理您的饮食记录</p>
          <Button 
            variant="primary" 
            icon="🍎" 
            @click="showFoodDatabase = true"
            class="food-database-btn"
          >
            查看食物数据库
          </Button>
        </div>
      </Card>
    </div>

    <!-- 食物数据库模态框 -->
    <div v-if="showFoodDatabase" class="modal-overlay" @click="showFoodDatabase = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>🍎 食物数据库</h2>
          <button class="close-btn" @click="showFoodDatabase = false">✕</button>
        </div>
        <div class="modal-body">
          <FoodDatabase />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import FoodDatabase from '@/components/nutrition/FoodDatabase.vue'

const currentDate = computed(() => {
  return new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const recordBreakfast = () => {
  console.log('记录早餐')
  // 实现记录早餐逻辑
}

const recordLunch = () => {
  console.log('记录午餐')
  // 实现记录午餐逻辑
}

const recordDinner = () => {
  console.log('记录晚餐')
  // 实现记录晚餐逻辑
}

const recordSnack = () => {
  console.log('记录加餐')
  // 实现记录加餐逻辑
}

const showFoodDatabase = ref(false)
</script>

<style scoped>
.nutrition-view {
  padding: var(--spacing-lg);
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.page-header h1 {
  font-size: 2.5rem;
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
}

.subtitle {
  font-size: 1.1rem;
  color: var(--color-text-secondary);
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.quick-record-card .quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.nutrition-overview .nutrition-stats {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.stat-item {
  display: grid;
  grid-template-columns: 80px 1fr auto;
  grid-template-rows: auto auto;
  gap: var(--spacing-xs) var(--spacing-sm);
  align-items: center;
}

.stat-label {
  grid-column: 1;
  grid-row: 1;
  font-weight: 600;
  color: var(--color-text-primary);
}

.stat-value {
  grid-column: 2;
  grid-row: 1;
  font-weight: bold;
  color: var(--color-primary);
}

.stat-unit {
  grid-column: 3;
  grid-row: 1;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.progress-bar {
  grid-column: 1 / -1;
  grid-row: 2;
  height: 8px;
  background-color: var(--color-border);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--color-success);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-fill.protein {
  background-color: var(--color-info);
}

.progress-fill.carbs {
  background-color: var(--color-warning);
}

.progress-fill.fat {
  background-color: var(--color-error);
}

.meal-list .meal-items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.meal-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-md);
  background-color: var(--color-background-secondary);
  border-radius: var(--border-radius-md);
  gap: var(--spacing-md);
}

.meal-icon {
  font-size: 1.5rem;
  width: 40px;
  text-align: center;
}

.meal-info {
  flex: 1;
}

.meal-name {
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.meal-details {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.meal-time {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.nutrition-tips .tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips-list li {
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid var(--color-border);
}

.tips-list li:last-child {
  border-bottom: none;
}

/* 食物数据库卡片样式 */
.food-database-card {
  text-align: center;
}

.food-database-content p {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
}

.food-database-btn {
  width: 100%;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-index-modal);
  padding: var(--spacing-lg);
}

.modal-content {
  background: var(--color-background-primary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-xl);
  max-width: 90vw;
  max-height: 90vh;
  width: 1200px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border-primary);
  background: var(--color-background-secondary);
}

.modal-header h2 {
  margin: 0;
  color: var(--color-primary);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: var(--spacing-xs);
  color: var(--color-text-secondary);
  border-radius: var(--border-radius-full);
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: var(--color-gray-100);
  color: var(--color-text-primary);
}

.modal-body {
  flex: 1;
  overflow: auto;
  max-height: calc(90vh - 80px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nutrition-view {
    padding: var(--spacing-md);
  }
  
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .quick-record-card .quick-actions {
    grid-template-columns: 1fr;
  }
  
  .stat-item {
    grid-template-columns: 70px 1fr;
  }
  
  .stat-unit {
    display: none;
  }

  .modal-overlay {
    padding: var(--spacing-sm);
  }
  
  .modal-content {
    width: 100%;
    max-width: 100%;
    max-height: 100%;
    border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
  }
  
  .modal-header {
    padding: var(--spacing-md);
  }
}
</style>
