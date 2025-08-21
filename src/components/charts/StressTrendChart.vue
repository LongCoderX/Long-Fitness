<template>
  <div class="stress-trend-chart">
    <div class="chart-header">
      <h3>压力水平趋势</h3>
      <div class="chart-controls">
        <select v-model="selectedView" class="view-select">
          <option value="daily">日视图</option>
          <option value="weekly">周视图</option>
          <option value="monthly">月视图</option>
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
      <div class="stress-stats">
        <div class="stat-item">
          <span class="stat-label">平均压力</span>
          <span class="stat-value">{{ averageStress }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">峰值压力</span>
          <span class="stat-value">{{ peakStress }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">改善趋势</span>
          <span class="stat-value" :class="{ positive: trend > 0, negative: trend < 0 }">
            {{ trend > 0 ? '↑' : trend < 0 ? '↓' : '→' }} {{ Math.abs(trend) }}%
          </span>
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
  PointElement, 
  LineElement, 
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
  PointElement, 
  LineElement, 
  CategoryScale, 
  LinearScale, 
  Title, 
  Tooltip, 
  Legend,
  Filler
)

interface StressDataPoint {
  date: string
  value: number
  events?: string[]
}

interface StressTrendData {
  data: StressDataPoint[]
  average: number
  peak: number
  trend: number
}

const props = withDefaults(defineProps<{
  data?: StressTrendData
}>(), {
  data: () => ({
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
  })
})

const chartCanvas = ref<HTMLCanvasElement | null>(null)
const chartInstance = ref<Chart | null>(null)
const selectedView = ref<'daily' | 'weekly' | 'monthly'>('daily')

const averageStress = computed(() => props.data.average.toFixed(1))
const peakStress = computed(() => props.data.peak)
const trend = computed(() => props.data.trend)

// 根据压力值获取颜色
const getStressColor = (value: number) => {
  if (value <= 3) return '#4ECDC4' // 低压 - 绿色
  if (value <= 6) return '#ECC94B' // 中压 - 黄色
  return '#F56565' // 高压 - 红色
}

// 模拟数据更新
const refreshData = () => {
  if (chartInstance.value) {
    updateChart()
  }
}

const updateChart = () => {
  if (!chartInstance.value) return

  const values = props.data.data.map(d => d.value)
  const maxValue = Math.max(...values, 10) // 确保y轴至少到10

  chartInstance.value.data.labels = props.data.data.map(d => d.date)
  chartInstance.value.data.datasets = [{
    label: '压力水平',
    data: values,
    backgroundColor: createGradient(),
    borderColor: '#FF6B35',
    pointBackgroundColor: values.map(v => getStressColor(v)),
    pointBorderColor: '#fff',
    pointBorderWidth: 2,
    pointRadius: 6,
    pointHoverRadius: 8,
    fill: true,
    tension: 0.4
  }]

  chartInstance.value.options.scales!.y!.max = maxValue
  chartInstance.value.update()
}

// 创建渐变背景
const createGradient = () => {
  if (!chartCanvas.value) return '#FF6B35'

  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return '#FF6B35'

  const gradient = ctx.createLinearGradient(0, 0, 0, 400)
  gradient.addColorStop(0, 'rgba(255, 107, 53, 0.6)')
  gradient.addColorStop(0.5, 'rgba(255, 107, 53, 0.3)')
  gradient.addColorStop(1, 'rgba(255, 107, 53, 0.1)')
  
  return gradient
}

const initChart = () => {
  if (!chartCanvas.value) return

  const values = props.data.data.map(d => d.value)
  const maxValue = Math.max(...values, 10)

  chartInstance.value = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels: props.data.data.map(d => d.date),
      datasets: [{
        label: '压力水平',
        data: values,
        backgroundColor: createGradient(),
        borderColor: '#FF6B35',
        pointBackgroundColor: values.map(v => getStressColor(v)),
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.parsed.y
              return `压力水平: ${value}/10`
            },
            afterLabel: (context) => {
              const index = context.dataIndex
              const events = props.data.data[index]?.events
              if (events && events.length > 0) {
                return `事件: ${events.join(', ')}`
              }
              return undefined
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: maxValue,
          title: {
            display: true,
            text: '压力水平 (0-10)'
          },
          ticks: {
            stepSize: 2
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
      elements: {
        line: {
          tension: 0.4
        }
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

watch(() => props.data, () => {
  if (chartInstance.value) {
    updateChart()
  }
}, { deep: true })

watch(selectedView, () => {
  // 这里可以添加根据视图切换数据的逻辑
  if (chartInstance.value) {
    updateChart()
  }
})
</script>

<style scoped>
.stress-trend-chart {
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

.view-select {
  padding: 6px 12px;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  color: #2D3748;
}

.view-select:focus {
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

.stress-stats {
  display: flex;
  justify-content: space-around;
  gap: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  color: #718096;
  font-weight: 500;
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
  color: #2D3748;
}

.stat-value.positive {
  color: #48BB78;
}

.stat-value.negative {
  color: #F56565;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .stress-stats {
    gap: 12px;
  }
  
  .stress-trend-chart {
    height: 450px;
  }
}

@media (max-width: 768px) {
  .chart-controls {
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
  }
  
  .stress-stats {
    flex-direction: column;
    gap: 8px;
  }
  
  .stat-item {
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
