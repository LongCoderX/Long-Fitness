<template>
  <div class="sleep-view">
    <div class="header">
      <h1>😴 睡眠管理</h1>
      <p class="subtitle">记录睡眠情况，改善睡眠质量</p>
    </div>

    <div class="content">
      <!-- 睡眠记录卡片 -->
      <Card class="record-card">
        <template #header>
          <h2>昨晚睡眠记录</h2>
        </template>
        <div class="record-form">
          <div class="form-row">
            <div class="form-group">
              <label>上床时间</label>
              <Input type="time" v-model="sleepRecord.bedTime" placeholder="选择上床时间" />
            </div>
            <div class="form-group">
              <label>起床时间</label>
              <Input type="time" v-model="sleepRecord.wakeTime" placeholder="选择起床时间" />
            </div>
          </div>
          
          <div class="form-group">
            <label>睡眠质量评分</label>
            <div class="rating-stars">
              <span 
                v-for="star in 5" 
                :key="star" 
                class="star"
                :class="{ active: star <= sleepRecord.quality }"
                @click="sleepRecord.quality = star"
              >
                ⭐
              </span>
            </div>
          </div>

          <div class="form-group">
            <label>影响睡眠的因素（多选）</label>
            <div class="checkbox-group">
              <label v-for="factor in sleepFactors" :key="factor.value" class="checkbox-label">
                <input 
                  type="checkbox" 
                  :value="factor.value" 
                  v-model="sleepRecord.factors"
                />
                {{ factor.label }}
              </label>
            </div>
          </div>

          <div class="form-group">
            <label>睡前活动</label>
            <Input 
              type="textarea" 
              v-model="sleepRecord.activities" 
              placeholder="记录睡前活动，如阅读、冥想等"
              rows="3"
            />
          </div>

          <Button type="primary" @click="saveSleepRecord" :loading="isSaving">
            {{ sleepRecord.id ? '更新记录' : '保存记录' }}
          </Button>
        </div>
      </Card>

      <!-- 睡眠统计卡片 -->
      <Card class="stats-card">
        <template #header>
          <h2>睡眠统计</h2>
        </template>
        <div class="stats-content">
          <div class="stat-item">
            <div class="stat-value">7.2</div>
            <div class="stat-label">平均睡眠时长（小时）</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">4.1</div>
            <div class="stat-label">平均质量评分</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">85%</div>
            <div class="stat-label">睡眠一致性</div>
          </div>
        </div>
      </Card>

      <!-- 睡眠建议卡片 -->
      <Card class="advice-card">
        <template #header>
          <h2>睡眠改善建议</h2>
        </template>
        <div class="advice-content">
          <div class="advice-item" v-for="(advice, index) in sleepAdvice" :key="index">
            <span class="advice-icon">💡</span>
            <span class="advice-text">{{ advice }}</span>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'

interface SleepRecord {
  id?: string
  bedTime: string
  wakeTime: string
  quality: number
  factors: string[]
  activities: string
  date: string
}

const sleepRecord = reactive<SleepRecord>({
  bedTime: '',
  wakeTime: '',
  quality: 3,
  factors: [],
  activities: '',
  date: new Date().toISOString().split('T')[0]
})

const isSaving = ref(false)

const sleepFactors = [
  { value: 'caffeine', label: '咖啡因摄入' },
  { value: 'stress', label: '压力过大' },
  { value: 'noise', label: '环境噪音' },
  { value: 'devices', label: '睡前使用电子设备' },
  { value: 'temperature', label: '室温不适' },
  { value: 'light', label: '光线干扰' },
  { value: 'alcohol', label: '酒精摄入' }
]

const sleepAdvice = [
  '保持规律的睡眠时间表，即使在周末也要保持一致',
  '睡前1小时避免使用电子设备，蓝光会抑制褪黑素分泌',
  '保持卧室温度在18-22°C之间，这是最适宜的睡眠温度',
  '尝试睡前冥想或深呼吸练习来放松身心',
  '避免在睡前4小时内摄入咖啡因或大量食物'
]

const saveSleepRecord = async () => {
  isSaving.value = true
  try {
    // 这里调用API保存睡眠记录
    console.log('保存睡眠记录:', sleepRecord)
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 重置表单
    Object.assign(sleepRecord, {
      bedTime: '',
      wakeTime: '',
      quality: 3,
      factors: [],
      activities: '',
      date: new Date().toISOString().split('T')[0]
    })
  } catch (error) {
    console.error('保存失败:', error)
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.sleep-view {
  padding: var(--spacing-lg);
  max-width: 800px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.header h1 {
  font-size: 2.5rem;
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
}

.subtitle {
  font-size: 1.1rem;
  color: var(--color-text-secondary);
}

.content {
  display: grid;
  gap: var(--spacing-lg);
  grid-template-columns: 1fr;
}

.record-card,
.stats-card,
.advice-card {
  margin-bottom: var(--spacing-lg);
}

.record-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.rating-stars {
  display: flex;
  gap: var(--spacing-xs);
}

.star {
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.3;
  transition: opacity 0.2s ease;
}

.star.active {
  opacity: 1;
}

.star:hover {
  opacity: 0.7;
}

.checkbox-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-sm);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 0.9rem;
}

.stats-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);
  text-align: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-primary);
}

.stat-label {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.advice-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.advice-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
}

.advice-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.advice-text {
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sleep-view {
    padding: var(--spacing-md);
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .stats-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .checkbox-group {
    grid-template-columns: 1fr;
  }
}
</style>
