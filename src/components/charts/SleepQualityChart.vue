<template>
  <div class="sleep-quality-chart">
    <div class="chart-header">
      <h3>睡眠质量分析</h3>
      <div class="chart-controls">
        <div class="time-range">
          <button 
            class="range-btn" 
            :class="{ active: currentRange === 'current' }"
            @click="currentRange = 'current'"
          >
            本周
          </button>
          <button 
            class="range-btn" 
            :class="{ active: currentRange === 'previous' }"
            @click="currentRange = 'previous'"
          >
            上周
          </button>
        </div>
        <button class="action-btn" @click="refreshData">
          <span>🔄</span>
        </button>
      </div>
    </div>
    <div class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>
    <div class="chart-footer">
      <div class="sleep-metrics">
        <div class="metric-item">
          <span class="metric-value">{{ overallScore }}</span>
          <span class="metric-label">综合评分</span>
        </div>
        <div class="metric-item">
          <span class="metric-value">{{ sleepDuration }}h</span>
          <span class="metric-label">平均时长</span>
        </div>
        <div class="metric-item">
          <span class="metric-value">{{ deepSleepPercent }}%</span>
          <span class="metric-label">深睡比例</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { 
  Chart, 
  RadarController, 
  PointElement, 
  LineElement, 
  RadialLinearScale, 
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js'

// 注册Chart.js组件
Chart.register(
  RadarController, 
  PointElement, 
  LineElement, 
  RadialLinearScale, 
  Title, 
  Tooltip, 
  Legend,
  Filler
)

interface SleepDimension {
  dimension: string
  current: number
  previous: number
  max: number
}

interface SleepQualityData {
  dimensions: SleepDimension[]
  overallScore: number
  sleepDuration: number
  deepSleepPercent: number
}

const props = withDefaults(defineProps<{
  data?: SleepQualityData
}>(), {
  data: () => ({
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
  })
})

const chartCanvas = ref<HTMLCanvasElement | null>(null)
const chartInstance = ref<Chart | null>(null)
const currentRange = ref<'current' | 'previous'>('current')

const overallScore = computed(() => props.data.overallScore)
const sleepDuration = computed(() => props.data.sleepDuration)
const deepSleepPercent = computed(() => props.data.deepSleepPercent)

// 模拟数据更新
const refreshData = () => {
  if (chartInstance.value) {
    updateChart()
  }
}

const updateChart = () => {
  if (!chartInstance.value) return

  const currentData = props.data.dimensions.map(d => d.current)
  const previousData = props.data.dimensions.map(d => d.previous)
  const labels = props.data.dimensions.map(d => d.dimension)
// maxValues 用于计算图表的最大刻度值
  // const maxValues = props.data.dimensions.map(d => d.max)

  chartInstance.value.data.labels = labels
  chartInstance.value.data.datasets = [
    {
      label: '当前周期',
      data: currentData,
      backgroundColor: 'rgba(79, 205, 196, 0.2)',
      borderColor: '#4ECDC4',
      pointBackgroundColor: '#4ECDC4',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#4ECDC4',
      borderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6
    },
    {
      label: '对比周期',
      data: previousData,
      backgroundColor: 'rgba(255, 107, 53, 0.2)',
      borderColor: '#FF6B35',
      pointBackgroundColor: '#FF6B35',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#FF6B35',
      borderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6
    }
  ]

  // 更新刻度最大值
  const maxValues = props.data.dimensions.map(d => d.max)
  chartInstance.value.options.scales!.r!.max = Math.max(...maxValues)

  chartInstance.value.update()
}

const initChart = () => {
  if (!chartCanvas.value) return

  const currentData = props.data.dimensions.map(d => d.current)
  const previousData = props.data.dimensions.map(d => d.previous)
  const labels = props.data.dimensions.map(d => d.dimension)
  const maxValues = props.data.dimensions.map(d => d.max)

  chartInstance.value = new Chart(chartCanvas.value, {
    type: 'radar',
    data: {
      labels: labels,
      datasets: [
        {
          label: '当前周期',
          data: currentData,
          backgroundColor: 'rgba(79, 205, 196, 0.2)',
          borderColor: '#4ECDC4',
          pointBackgroundColor: '#4ECDC4',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#4ECDC4',
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: '对比周期',
          data: previousData,
          backgroundColor: 'rgba(255, 107, 53, 0.2)',
          borderColor: '#FF6B35',
          pointBackgroundColor: '#FF6B35',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#FF6B35',
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20
          }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const datasetLabel = context.dataset.label || ''
              const value = context.raw as number
              const dimension = labels[context.dataIndex]
              return `${datasetLabel} - ${dimension}: ${value}/100`
            }
          }
        }
      },
      scales: {
        r: {
          angleLines: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          pointLabels: {
            font: {
              size: 12,
              weight: 600
            },
            color: '#2D3748'
          },
          suggestedMin: 0,
          suggestedMax: 100,
          ticks: {
            stepSize: 20,
            backdropColor: 'transparent'
          }
        }
      },
      elements: {
        line: {
          tension: 0.2
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

watch(currentRange, () => {
  // 这里可以添加根据时间范围切换数据的逻辑
  if (chartInstance.value) {
    updateChart()
  }
})
</script>

<style scoped>
.sleep-quality-chart {
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

.time-range {
  display: flex;
  gap: 4px;
  background: #F7FAFC;
  border-radius: 8px;
  padding: 2px;
}

.range-btn {
  padding: 6px 12px;
  border: none;
  background: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: #718096;
  cursor: pointer;
  transition: all 0.2s ease;
}

.range-btn:hover {
  background: #EDF2F7;
}

.range-btn.active {
  background: white;
  color: #2D3748;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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

.sleep-metrics {
  display: flex;
  justify-content: space-around;
  gap: 16px;
}

.metric-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.metric-value {
  font-size: 18px;
  font-weight: 700;
  color: #2D3748;
}

.metric-label {
  font-size: 12px;
  color: #718096;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .sleep-metrics {
    gap: 12px;
  }
  
  .sleep-quality-chart {
    height: 450px;
  }
}

@media (max-width: 768px) {
  .chart-controls {
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
  }
  
  .sleep-metrics {
    flex-direction: column;
    gap: 8px;
  }
  
  .metric-item {
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
