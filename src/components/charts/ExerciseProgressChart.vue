<template>
  <div class="exercise-progress-chart">
    <div class="chart-header">
      <h3>运动能力进步</h3>
      <div class="chart-controls">
        <select v-model="selectedPeriod" class="period-select">
          <option value="week">本周</option>
          <option value="month">本月</option>
          <option value="quarter">本季度</option>
        </select>
        <button class="action-btn" @click="refreshData">
          <span>🔄</span>
        </button>
      </div>
    </div>
    <div class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>
    <div class="chart-footer">
      <div class="exercise-legend">
        <div 
          v-for="exercise in exercises" 
          :key="exercise.id" 
          class="legend-item"
          :class="{ active: activeExercise === exercise.id }"
          @click="toggleExercise(exercise.id)"
        >
          <span class="legend-color" :style="{ backgroundColor: exercise.color }"></span>
          <span class="legend-label">{{ exercise.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { 
  Chart, 
  LineController, 
  LineElement, 
  PointElement, 
  CategoryScale, 
  LinearScale, 
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js'

// 注册Chart.js组件
Chart.register(
  LineController, 
  LineElement, 
  PointElement, 
  CategoryScale, 
  LinearScale, 
  Title, 
  Tooltip, 
  Legend,
  Filler
)

interface ExerciseData {
  id: string
  name: string
  color: string
  data: number[]
}

interface ExerciseProgressData {
  labels: string[]
  exercises: ExerciseData[]
}

const props = withDefaults(defineProps<{
  data?: ExerciseProgressData
}>(), {
  data: () => ({
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
  })
})

const chartCanvas = ref<HTMLCanvasElement | null>(null)
const chartInstance = ref<Chart | null>(null)
const selectedPeriod = ref<'week' | 'month' | 'quarter'>('week')
const activeExercise = ref<string | null>(null)

const exercises = computed(() => props.data.exercises)
const filteredExercises = computed(() => {
  if (!activeExercise.value) return props.data.exercises
  return props.data.exercises.filter(ex => ex.id === activeExercise.value)
})

// 模拟数据更新
const refreshData = () => {
  if (chartInstance.value) {
    updateChart()
  }
}

const toggleExercise = (exerciseId: string) => {
  if (activeExercise.value === exerciseId) {
    activeExercise.value = null
  } else {
    activeExercise.value = exerciseId
  }
}

const updateChart = () => {
  if (!chartInstance.value) return

  chartInstance.value.data.labels = props.data.labels
  chartInstance.value.data.datasets = filteredExercises.value.map(exercise => ({
    label: exercise.name,
    data: exercise.data,
    borderColor: exercise.color,
    backgroundColor: `${exercise.color}20`,
    borderWidth: 3,
    pointBackgroundColor: exercise.color,
    pointBorderColor: '#fff',
    pointBorderWidth: 2,
    pointRadius: 6,
    pointHoverRadius: 8,
    fill: true,
    tension: 0.3
  }))

  chartInstance.value.update()
}

const initChart = () => {
  if (!chartCanvas.value) return

  chartInstance.value = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels: props.data.labels,
      datasets: filteredExercises.value.map(exercise => ({
        label: exercise.name,
        data: exercise.data,
        borderColor: exercise.color,
        backgroundColor: `${exercise.color}20`,
        borderWidth: 3,
        pointBackgroundColor: exercise.color,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        fill: true,
        tension: 0.3
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: (context) => {
              const label = context.dataset.label || ''
              const value = context.parsed.y
              return `${label}: ${value} kg`
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: '运动容量 (kg)'
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
        x: {
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        }
      },
      interaction: {
        mode: 'index',
        intersect: false
      }
    }
  })
}

onMounted(() => {
  initChart()
})

onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.destroy()
  }
})

watch([() => props.data, filteredExercises], () => {
  if (chartInstance.value) {
    updateChart()
  }
}, { deep: true })

watch(selectedPeriod, () => {
  // 这里可以添加根据时间范围筛选数据的逻辑
  if (chartInstance.value) {
    updateChart()
  }
})
</script>

<style scoped>
.exercise-progress-chart {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 400px;
  display: flex;
  flex-direction: column;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2D3748;
}

.chart-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.period-select {
  padding: 6px 12px;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  color: #2D3748;
}

.period-select:focus {
  outline: none;
  border-color: #45B7D1;
}

.action-btn {
  background: none;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  padding: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #F7FAFC;
  border-color: #CBD5E0;
}

.chart-container {
  flex: 1;
  min-height: 250px;
  position: relative;
}

.chart-footer {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #E2E8F0;
}

.exercise-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.legend-item:hover {
  background: #F7FAFC;
}

.legend-item.active {
  background: #F7FAFC;
  border-color: #E2E8F0;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.legend-label {
  font-size: 14px;
  color: #718096;
  font-weight: 500;
}

.legend-item.active .legend-label {
  color: #2D3748;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .exercise-legend {
    gap: 12px;
  }
  
  .exercise-progress-chart {
    height: 450px;
  }
}

@media (max-width: 768px) {
  .chart-controls {
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
  }
  
  .exercise-legend {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
