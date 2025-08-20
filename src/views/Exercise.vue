<script setup lang="ts">
const pageTitle = '运动模块'
</script>

<template>
  <div class="exercise-page">
    <h1>{{ pageTitle }}</h1>
    <p>运动模块正在开发中，敬请期待...</p>
    <div class="placeholder-content">
      <div class="placeholder-card">
        <h3>🏋️ 动作库</h3>
        <p>包含功能性训练、自重训练、体态纠正等各类动作</p>
      </div>
      <div class="placeholder-card">
        <h3>📅 训练计划</h3>
        <p>个性化周计划安排和进度跟踪</p>
      </div>
      <div class="placeholder-card">
        <h3>📊 运动记录</h3>
        <p>记录每次训练的时长、强度和消耗</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.exercise-page {
  padding: var(--spacing-xl);
  max-width: 1200px;
  margin: 0 auto;
}

.exercise-page h1 {
  color: var(--color-primary);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.exercise-page p {
  text-align: center;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xl);
}

.placeholder-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  margin-top: var(--spacing-xl);
}

.placeholder-card {
  background: var(--color-white);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  text-align: center;
  border: 1px solid var(--color-gray-200);
}

.placeholder-card h3 {
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-h3);
}

.placeholder-card p {
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .exercise-page {
    padding: var(--spacing-md);
  }
  
  .placeholder-content {
    grid-template-columns: 1fr;
  }
}
</style>
