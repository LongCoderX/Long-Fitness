<template>
  <div class="stress-view">
    <div class="header">
      <h1>😌 压力管理</h1>
      <p class="subtitle">监测压力水平，学习减压技巧</p>
    </div>

    <div class="content">
      <!-- 压力测评卡片 -->
      <Card class="assessment-card">
        <template #header>
          <h2>快速压力测评</h2>
        </template>
        <div class="assessment-form">
          <div class="form-group">
            <label>当前压力水平 (0-10分)</label>
            <div class="slider-container">
              <input 
                type="range" 
                min="0" 
                max="10" 
                step="1"
                v-model="stressAssessment.level"
                class="stress-slider"
              >
              <div class="slider-labels">
                <span>轻微压力</span>
                <span class="current-level">{{ stressAssessment.level }}</span>
                <span>极大压力</span>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>主要压力来源（多选）</label>
            <div class="checkbox-group">
              <label v-for="source in stressSources" :key="source.value" class="checkbox-label">
                <input 
                  type="checkbox" 
                  :value="source.value" 
                  v-model="stressAssessment.sources"
                >
                {{ source.label }}
              </label>
            </div>
          </div>

          <div class="form-group">
            <label>身体症状（多选）</label>
            <div class="checkbox-group">
              <label v-for="symptom in physicalSymptoms" :key="symptom.value" class="checkbox-label">
                <input 
                  type="checkbox" 
                  :value="symptom.value" 
                  v-model="stressAssessment.symptoms"
                >
                {{ symptom.label }}
              </label>
            </div>
          </div>

          <div class="form-group">
            <label>压力描述</label>
            <Input 
              type="textarea" 
              v-model="stressAssessment.description" 
              placeholder="描述你当前的压力感受..."
              rows="3"
            />
          </div>

          <Button type="primary" @click="submitAssessment" :loading="isSubmitting">
            查看减压建议
          </Button>
        </div>
      </Card>

      <!-- 减压建议卡片 -->
      <Card class="advice-card" v-if="showAdvice">
        <template #header>
          <h2>个性化减压建议</h2>
        </template>
        <div class="advice-content">
          <div class="advice-section" v-for="(advice, index) in stressAdvice" :key="index">
            <h3>{{ advice.title }}</h3>
            <p>{{ advice.description }}</p>
            <ul v-if="advice.tips">
              <li v-for="(tip, tipIndex) in advice.tips" :key="tipIndex">{{ tip }}</li>
            </ul>
          </div>
        </div>
      </Card>

      <!-- 减压训练卡片 -->
      <Card class="training-card">
        <template #header>
          <h2>快速减压训练</h2>
        </template>
        <div class="training-content">
          <div class="training-item" v-for="(training, index) in quickRelaxationTechniques" :key="index">
            <div class="training-icon">{{ training.emoji }}</div>
            <div class="training-info">
              <h4>{{ training.title }}</h4>
              <p>{{ training.description }}</p>
              <Button size="small" @click="startTraining(training)">
                开始训练
              </Button>
            </div>
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

interface StressAssessment {
  level: number
  sources: string[]
  symptoms: string[]
  description: string
}

interface StressAdvice {
  title: string
  description: string
  tips?: string[]
}

interface RelaxationTraining {
  emoji: string
  title: string
  description: string
  duration: number
}

const stressAssessment = reactive<StressAssessment>({
  level: 5,
  sources: [],
  symptoms: [],
  description: ''
})

const isSubmitting = ref(false)
const showAdvice = ref(false)

const stressSources = [
  { value: 'work', label: '工作压力' },
  { value: 'relationships', label: '人际关系' },
  { value: 'financial', label: '经济压力' },
  { value: 'health', label: '健康问题' },
  { value: 'family', label: '家庭事务' },
  { value: 'academic', label: '学业压力' },
  { value: 'uncertainty', label: '不确定性' }
]

const physicalSymptoms = [
  { value: 'headache', label: '头痛' },
  { value: 'muscle_tension', label: '肌肉紧张' },
  { value: 'stomach', label: '胃部不适' },
  { value: 'sleep', label: '睡眠问题' },
  { value: 'concentration', label: '注意力不集中' },
  { value: 'fatigue', label: '疲劳乏力' },
  { value: 'appetite', label: '食欲变化' }
]

const stressAdvice = ref<StressAdvice[]>([])

const quickRelaxationTechniques: RelaxationTraining[] = [
  {
    emoji: '🧘',
    title: '深呼吸练习',
    description: '4-7-8呼吸法，快速平静身心',
    duration: 5
  },
  {
    emoji: '💆',
    title: '渐进式肌肉放松',
    description: '逐步放松全身肌肉群',
    duration: 10
  },
  {
    emoji: '🌿',
    title: '正念冥想',
    description: '关注当下，减少焦虑',
    duration: 8
  },
  {
    emoji: '🚶',
    title: '快速散步',
    description: '5分钟户外散步，释放压力',
    duration: 5
  }
]

const submitAssessment = async () => {
  isSubmitting.value = true
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 根据压力水平生成建议
    generateAdvice()
    showAdvice.value = true
  } catch (error) {
    console.error('提交失败:', error)
  } finally {
    isSubmitting.value = false
  }
}

const generateAdvice = () => {
  const level = stressAssessment.level
  const advice: StressAdvice[] = []

  if (level >= 8) {
    advice.push({
      title: '高压力警报',
      description: '您的压力水平较高，建议立即采取减压措施',
      tips: [
        '立即进行5分钟深呼吸练习',
        '暂时离开压力环境',
        '联系朋友或家人寻求支持',
        '考虑咨询专业心理咨询师'
      ]
    })
  } else if (level >= 5) {
    advice.push({
      title: '中度压力',
      description: '您处于中等压力水平，需要关注压力管理',
      tips: [
        '每天进行10-15分钟放松训练',
        '保持规律的运动习惯',
        '确保充足的睡眠时间',
        '学习时间管理技巧'
      ]
    })
  } else {
    advice.push({
      title: '轻度压力',
      description: '您的压力水平在正常范围内，继续保持良好的压力管理习惯',
      tips: [
        '坚持日常放松练习',
        '保持工作生活平衡',
        '定期进行压力自评',
        '培养积极的应对策略'
      ]
    })
  }

  // 根据压力来源添加特定建议
  if (stressAssessment.sources.includes('work')) {
    advice.push({
      title: '工作压力管理',
      description: '针对工作压力的专业建议',
      tips: [
        '设定合理的工作目标',
        '学会说"不"，避免过度承诺',
        '定期休息，避免长时间连续工作',
        '与同事沟通，寻求支持'
      ]
    })
  }

  if (stressAssessment.sources.includes('relationships')) {
    advice.push({
      title: '人际关系改善',
      description: '改善人际关系的实用技巧',
      tips: [
        '学习有效沟通技巧',
        '设定健康的人际边界',
        '寻求共同兴趣的活动',
        '必要时寻求专业调解'
      ]
    })
  }

  stressAdvice.value = advice
}

const startTraining = (training: RelaxationTraining) => {
  console.log('开始训练:', training)
  // 这里可以跳转到具体的训练页面或启动计时器
}
</script>

<style scoped>
.stress-view {
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

.assessment-card,
.advice-card,
.training-card {
  margin-bottom: var(--spacing-lg);
}

.assessment-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.slider-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.stress-slider {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: var(--color-border-light);
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.stress-slider:hover {
  opacity: 1;
}

.stress-slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.current-level {
  font-weight: bold;
  color: var(--color-primary);
  font-size: 1.1rem;
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

.advice-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.advice-section {
  padding: var(--spacing-md);
  background: var(--color-background-light);
  border-radius: var(--border-radius-md);
  border-left: 4px solid var(--color-primary);
}

.advice-section h3 {
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--color-primary);
  font-size: 1.1rem;
}

.advice-section p {
  margin: 0 0 var(--spacing-sm) 0;
  line-height: 1.5;
}

.advice-section ul {
  margin: 0;
  padding-left: var(--spacing-lg);
}

.advice-section li {
  margin-bottom: var(--spacing-xs);
  line-height: 1.4;
}

.training-content {
  display: grid;
  gap: var(--spacing-md);
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.training-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-background-light);
  border-radius: var(--border-radius-md);
  transition: transform 0.2s ease;
}

.training-item:hover {
  transform: translateY(-2px);
}

.training-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.training-info {
  flex: 1;
}

.training-info h4 {
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--color-text-primary);
}

.training-info p {
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  line-height: 1.4;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stress-view {
    padding: var(--spacing-md);
  }
  
  .checkbox-group {
    grid-template-columns: 1fr;
  }
  
  .training-content {
    grid-template-columns: 1fr;
  }
  
  .training-item {
    flex-direction: column;
    text-align: center;
  }
  
  .training-icon {
    margin-bottom: var(--spacing-sm);
  }
}
</style>
