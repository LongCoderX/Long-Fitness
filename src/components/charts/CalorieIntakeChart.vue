<template>
  <div class="calorie-intake-chart">
    <div class="chart-header">
      <h3>今日热量摄入</h3>
      <div class="chart-actions">
        <button class="action-btn" @click="refreshData">
          <span>🔄</span>
        </button>
      </div>
    </div>
    <div class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>
    <div class="chart-footer">
      <div class="nutrient-distribution">
        <div class="nutrient-item">
          <span class="nutrient-color protein"></span>
          <span class="nutrient-label">蛋白质: {{ protein }}g</span>
        </div>
        <div class="nutrient-item">
          <span class="nutrient-color carbs"></span>
          <span class="nutrient-label">碳水: {{ carbs }}g</span>
        </div>
        <div class="nutrient-item">
          <span class="nutrient-color fat"></span>
          <span class="nutrient-label">脂肪: {{ fat }}g</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { 
  Chart, 
  BarController, 
  BarElement, 
  CategoryScale, 
  LinearScale, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js'

// 注册Chart.js组件
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend)

interface CalorieData {
  bmr: number
  intake: number
  target: number
  protein: number
  carbs: number
  fat: number
}

const props = withDefaults(defineProps<{
  data?: CalorieData
}>(), {
  data: () => ({
    bmr: 1500,
    intake: 1800,
    target: 2000,
    protein: 45,
    carbs: 150,
    fat: 40
  })
})

const chartCanvas = ref<HTMLCanvasElement | null>(null)
const chartInstance = ref<Chart | null>(null)
const protein = ref(props.data.protein)
const carbs = ref(props.data.carbs)
const fat = ref(props.data.fat)

// 模拟数据更新
const refreshData = () => {
  const randomFactor = 0.8 + Math.random() * 0.4
  protein.value = Math.round(props.data.protein * randomFactor)
  carbs.value = Math.round(props.data.carbs * randomFactor)
  fat.value = Math.round(props.data.fat * randomFactor)
  
  if (chartInstance.value) {
    updateChart()
  }
}

const updateChart = () => {
  if (!chartInstance.value) return

  const intakeStatus = props.data.intake <= props.data.target ? 'good' : 
                       props.data.intake <= props.data.target * 1.2 ? 'warning' : 'danger'
  
  chartInstance.value.data.datasets[0].data = [props.data.bmr]
  chartInstance.value.data.datasets[1].data = [props.data.intake]
  
  // 更新颜色基于摄入状态
  chartInstance.value.data.datasets[1].backgroundColor = 
    intakeStatus === 'good' ? '#4ECDC4' : 
    intakeStatus === 'warning' ? '#ECC94B' : '#F56565'
  
  chartInstance.value.update()
}

const initChart = () => {
  if (!chartCanvas.value) return

  const intakeStatus = props.data.intake <= props.data.target ? 'good' : 
                       props.data.intake <= props.data.target * 1.2 ? 'warning' : 'danger'

  chartInstance.value = new Chart(chartCanvas.value, {
    type: 'bar',
    data: {
      labels: ['热量摄入'],
      datasets: [
        {
          label: '基础代谢率 (BMR)',
          data: [props.data.bmr],
          backgroundColor: '#E2E8F0',
          borderColor: '#E2E8F0',
          borderWidth: 1,
          barPercentage: 0.6,
          categoryPercentage: 0.8
        },
        {
          label: '实际摄入',
          data: [props.data.intake],
          backgroundColor: intakeStatus === 'good' ? '#4ECDC4' : 
                          intakeStatus === 'warning' ? '#ECC94B' : '#F56565',
          borderColor: intakeStatus === 'good' ? '#4ECDC4' : 
                      intakeStatus === 'warning' ? '#ECC94B' : '#F56565',
          borderWidth: 1,
          barPercentage: 0.6,
          categoryPercentage: 0.8
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
              const value = context.parsed.y
              return `${datasetLabel}: ${value} kcal`
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: '热量 (kcal)'
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
        x: {
          grid: {
            display: false
          }
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
</script>

<style scoped>
.calorie-intake-chart {
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

.chart-actions {
  display: flex;
  gap: 8px;
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

.nutrient-distribution {
  display: flex;
  justify-content: space-around;
  gap: 16px;
}

.nutrient-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nutrient-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.nutrient-color.protein {
  background-color: #FF6B35;
}

.nutrient-color.carbs {
  background-color: #45B7D1;
}

.nutrient-color.fat {
  background-color: #4ECDC4;
}

.nutrient-label {
  font-size: 14px;
  color: #718096;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .nutrient-distribution {
    flex-direction: column;
    gap: 8px;
  }
  
  .calorie-intake-chart {
    height: 450px;
  }
}
</style>
