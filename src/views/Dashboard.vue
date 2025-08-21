<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.store'
import { useExerciseStore } from '@/stores/exercise.store'
import { useNutritionStore } from '@/stores/nutrition.store'
import { useSleepStore } from '@/stores/sleep.store'
import { usePlatform } from '@/composables/usePlatform'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import CalorieIntakeChart from '@/components/charts/CalorieIntakeChart.vue'
import ExerciseProgressChart from '@/components/charts/ExerciseProgressChart.vue'
import SleepQualityChart from '@/components/charts/SleepQualityChart.vue'
import StressTrendChart from '@/components/charts/StressTrendChart.vue'

const router = useRouter()
const userStore = useUserStore()
const exerciseStore = useExerciseStore()
const nutritionStore = useNutritionStore()
const sleepStore = useSleepStore()
const platform = usePlatform()

const isLoading = ref(true)

// 模拟数据 - 在实际应用中这些数据应该从store中获取
const todayStats = ref({
  exercise: {
    duration: 15,
    target: 30,
    progress: 50,
    completed: false
  },
  nutrition: {
    calories: 1200,
    target: 1800,
    protein: 45,
    carbs: 150,
    fat: 40,
    progress: 67
  },
  sleep: {
    duration: 6.5,
    quality: 82,
    target: 8,
    progress: 81
  }
})

const dailyGoals = ref([
  { id: 1, title: '完成碎片化训练15分钟', completed: false, type: 'exercise' },
  { id: 2, title: '记录午餐饮食', completed: true, type: 'nutrition' },
  { id: 3, title: '完成压力测评', completed: false, type: 'stress' }
])

const recommendations = ref([
  { id: 1, title: '尝试新的自重训练动作', description: '桥式训练可以增强臀部和核心力量', type: 'exercise' },
  { id: 2, title: '改善睡眠质量的建议', description: '保持规律的睡眠时间，避免睡前使用电子设备', type: 'sleep' }
])

const completionRate = computed(() => {
  const completed = dailyGoals.value.filter(goal => goal.completed).length
  return Math.round((completed / dailyGoals.value.length) * 100)
})

// 图表数据
const chartData = ref({
  calorieIntake: {
    bmr: 1500,
    intake: 1200,
    target: 1800,
    protein: 45,
    carbs: 150,
    fat: 40
  },
  exerciseProgress: {
    labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    exercises: [
      {
        id: 'squat',
        name: '深蹲',
        color: '#FF6B35',
        data: [40, 45, 50, 55, 60, 65, 70]
      },
      {
        id: 'pushup',
        name: '俯卧撑',
        color: '#45B7D1',
        data: [20, 25, 30, 35, 40, 45, 50]
      },
      {
        id: 'plank',
        name: '平板支撑',
        color: '#4ECDC4',
        data: [60, 70, 80, 90, 100, 110, 120]
      }
    ]
  },
  sleepQuality: {
    dimensions: [
      { dimension: '入睡时间', current: 85, previous: 70, max: 100 },
      { dimension: '睡眠时长', current: 90, previous: 80, max: 100 },
      { dimension: '深度睡眠', current: 75, previous: 65, max: 100 },
      { dimension: '醒来次数', current: 60, previous: 50, max: 100 },
      { dimension: '主观感受', current: 80, previous: 75, max: 100 }
    ],
    overallScore: 78,
    sleepDuration: 7.2,
    deepSleepPercent: 25
  },
  stressTrend: {
    data: [
      { date: '周一', value: 3, events: ['项目会议'] },
      { date: '周二', value: 5, events: ['deadline'] },
      { date: '周三', value: 4, events: [] },
      { date: '周四', value: 6, events: ['客户演示'] },
      { date: '周五', value: 2, events: ['周末开始'] },
      { date: '周六', value: 1, events: [] },
      { date: '周日', value: 2, events: ['准备下周'] }
    ],
    average: 3.3,
    peak: 6,
    trend: -15
  }
})

onMounted(async () => {
  try {
    // 加载用户数据
    await userStore.loadUserProfile()
    // 加载今日数据
    await Promise.all([
      exerciseStore.loadTodayExercise(),
      nutritionStore.loadTodayNutrition(),
      sleepStore.loadLastNightSleep()
    ])
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  } finally {
    isLoading.value = false
  }
})

const handleQuickAction = (action: string) => {
  console.log('Quick action:', action)
  
  // 根据action类型跳转到相应的页面
  switch (action) {
    case 'exercise':
      router.push('/exercise')
      break
    case 'nutrition':
      router.push('/nutrition')
      break
    case 'sleep':
      router.push('/sleep')
      break
    case 'stress':
      router.push('/stress')
      break
    default:
      console.warn('Unknown action:', action)
  }
}

const toggleGoalCompletion = (goalId: number) => {
  const goal = dailyGoals.value.find(g => g.id === goalId)
  if (goal) {
    goal.completed = !goal.completed
  }
}
</script>

<template>
  <div class="dashboard desktop-view">
    <!-- 顶部欢迎区域 -->
    <Card class="welcome-card" shadow="md">
      <h2>欢迎回来，{{ userStore.currentUser?.username || '用户' }}!</h2>
      <p class="date">今天是 {{ new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
    </Card>

    <!-- 主内容网格布局 -->
    <div class="dashboard-grid">
      <!-- 左侧列 - 数据概览和图表 -->
      <div class="left-column">
        <!-- 健康数据概览 -->
        <div class="stats-grid">
          <Card class="stat-card" shadow="md">
            <div class="stat-header">
              <span class="stat-icon">🏃</span>
              <h3>运动</h3>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ todayStats.exercise.duration }}/{{ todayStats.exercise.target }}分钟</div>
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: `${todayStats.exercise.progress}%` }"
                  :class="{ completed: todayStats.exercise.progress >= 100 }"
                ></div>
              </div>
              <div class="stat-progress">{{ todayStats.exercise.progress }}% 完成</div>
            </div>
          </Card>

          <Card class="stat-card" shadow="md">
            <div class="stat-header">
              <span class="stat-icon">🍎</span>
              <h3>饮食</h3>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ todayStats.nutrition.calories }}/{{ todayStats.nutrition.target }}卡</div>
              <div class="progress-bar">
                <div 
                  class="progress-fill nutrition" 
                  :style="{ width: `${todayStats.nutrition.progress}%` }"
                  :class="{ completed: todayStats.nutrition.progress >= 100 }"
                ></div>
              </div>
              <div class="stat-progress">{{ todayStats.nutrition.progress }}% 完成</div>
            </div>
          </Card>

          <Card class="stat-card" shadow="md">
            <div class="stat-header">
              <span class="stat-icon">😴</span>
              <h3>睡眠</h3>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ todayStats.sleep.duration }}/{{ todayStats.sleep.target }}小时</div>
              <div class="progress-bar">
                <div 
                  class="progress-fill sleep" 
                  :style="{ width: `${todayStats.sleep.progress}%` }"
                  :class="{ completed: todayStats.sleep.progress >= 100 }"
                ></div>
              </div>
              <div class="stat-progress">质量: {{ todayStats.sleep.quality }}%</div>
            </div>
          </Card>
        </div>

        <!-- 图表网格 -->
        <div class="charts-grid">
          <!-- 热量摄入图表 -->
          <Card class="chart-card" shadow="md">
            <CalorieIntakeChart :data="chartData.calorieIntake" />
          </Card>

          <!-- 运动进步图表 -->
          <Card class="chart-card" shadow="md">
            <ExerciseProgressChart :data="chartData.exerciseProgress" />
          </Card>

          <!-- 睡眠质量图表 -->
          <Card class="chart-card" shadow="md">
            <SleepQualityChart :data="chartData.sleepQuality" />
          </Card>

          <!-- 压力趋势图表 -->
          <Card class="chart-card" shadow="md">
            <StressTrendChart :data="chartData.stressTrend" />
          </Card>
        </div>
      </div>

      <!-- 右侧列 - 目标和推荐 -->
      <div class="right-column">
        <!-- 今日目标 -->
        <Card class="goals-card" shadow="md">
          <div class="card-header">
            <h3>今日健康目标</h3>
            <div class="completion-rate">{{ completionRate }}% 完成</div>
          </div>
          <div class="goals-list">
            <div 
              v-for="goal in dailyGoals" 
              :key="goal.id" 
              class="goal-item"
              :class="{ completed: goal.completed }"
              @click="toggleGoalCompletion(goal.id)"
            >
              <div class="goal-checkbox">
                <div class="checkbox" :class="{ checked: goal.completed }">
                  <span v-if="goal.completed">✓</span>
                </div>
              </div>
              <div class="goal-content">
                <div class="goal-title">{{ goal.title }}</div>
                <div class="goal-type">{{ goal.type }}</div>
              </div>
            </div>
          </div>
        </Card>

        <!-- 个性化推荐 -->
        <Card class="recommendations-card" shadow="md">
          <h3>个性化推荐</h3>
          <div class="recommendations-list">
            <div v-for="recommendation in recommendations" :key="recommendation.id" class="recommendation-item">
              <div class="recommendation-icon">
                <span v-if="recommendation.type === 'exercise'">💡</span>
                <span v-else-if="recommendation.type === 'sleep'">🌙</span>
                <span v-else>📋</span>
              </div>
              <div class="recommendation-content">
                <div class="recommendation-title">{{ recommendation.title }}</div>
                <div class="recommendation-description">{{ recommendation.description }}</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: var(--spacing-lg);
  max-width: 1400px;
  margin: 0 auto;
}

.welcome-card {
  margin-bottom: var(--spacing-xl);
  text-align: center;
}

.welcome-card h2 {
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--color-text-primary);
  font-size: var(--font-size-h2);
}

.date {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-body);
}

/* 主网格布局 */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: var(--spacing-xl);
  align-items: start;
}

/* 左侧列样式 */
.left-column {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

/* 健康数据概览网格 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);
}

.stat-card {
  padding: var(--spacing-lg);
}

.stat-header {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.stat-icon {
  font-size: 24px;
  margin-right: var(--spacing-sm);
}

.stat-header h3 {
  margin: 0;
  font-size: var(--font-size-h3);
  color: var(--color-text-primary);
}

.stat-content {
  text-align: center;
}

.stat-value {
  font-size: var(--font-size-h2);
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: var(--color-gray-200);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: var(--spacing-sm);
}

.progress-fill {
  height: 100%;
  background-color: var(--color-primary);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-fill.nutrition {
  background-color: var(--color-success);
}

.progress-fill.sleep {
  background-color: var(--color-info);
}

.progress-fill.completed {
  background-color: var(--color-success);
}

.stat-progress {
  font-size: var(--font-size-caption);
  color: var(--color-text-secondary);
}

/* 图表网格 */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
}

.chart-card {
  padding: 0;
  overflow: hidden;
}

/* 右侧列样式 */
.right-column {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  position: sticky;
  top: var(--spacing-xl);
}

.goals-card,
.recommendations-card {
  padding: var(--spacing-lg);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.card-header h3 {
  margin: 0;
  font-size: var(--font-size-h3);
  color: var(--color-text-primary);
}

.completion-rate {
  font-size: var(--font-size-body);
  font-weight: 600;
  color: var(--color-primary);
}

.goals-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.goal-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  background-color: var(--color-gray-100);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.goal-item:hover {
  background-color: var(--color-gray-200);
}

.goal-item.completed {
  background-color: var(--color-success-light);
}

.goal-checkbox {
  margin-right: var(--spacing-md);
}

.checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-gray-400);
  border-radius: var(--border-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.checkbox.checked {
  background-color: var(--color-success);
  border-color: var(--color-success);
  color: white;
}

.goal-content {
  flex: 1;
}

.goal-title {
  font-size: var(--font-size-body);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.goal-item.completed .goal-title {
  text-decoration: line-through;
  color: var(--color-text-secondary);
}

.goal-type {
  font-size: var(--font-size-caption);
  color: var(--color-text-tertiary);
  text-transform: capitalize;
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.recommendation-item {
  display: flex;
  align-items: flex-start;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  background-color: var(--color-gray-100);
}

.recommendation-icon {
  font-size: 20px;
  margin-right: var(--spacing-md);
  margin-top: 2px;
}

.recommendation-content {
  flex: 1;
}

.recommendation-title {
  font-size: var(--font-size-body);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.recommendation-description {
  font-size: var(--font-size-caption);
  color: var(--color-text-secondary);
  line-height: 1.4;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
  
  .right-column {
    position: static;
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard {
    padding: var(--spacing-md);
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-gray-300);
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
