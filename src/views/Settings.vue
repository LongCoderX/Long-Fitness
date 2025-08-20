<template>
  <div class="settings-view">
    <div class="page-header">
      <h1>⚙️ 设置</h1>
      <p class="subtitle">个性化您的健康管理体验</p>
    </div>

    <div class="settings-content">
      <!-- 用户设置 -->
      <Card title="个人设置" class="settings-section">
        <div class="setting-item">
          <label class="setting-label">用户名</label>
          <Input v-model="userSettings.username" placeholder="请输入用户名" />
        </div>
        
        <div class="setting-item">
          <label class="setting-label">邮箱</label>
          <Input v-model="userSettings.email" type="email" placeholder="请输入邮箱地址" />
        </div>
        
        <div class="setting-item">
          <label class="setting-label">主题模式</label>
          <div class="theme-options">
            <label class="theme-option">
              <input 
                type="radio" 
                v-model="userSettings.theme" 
                value="light" 
              />
              <span>浅色模式</span>
            </label>
            <label class="theme-option">
              <input 
                type="radio" 
                v-model="userSettings.theme" 
                value="dark" 
              />
              <span>深色模式</span>
            </label>
            <label class="theme-option">
              <input 
                type="radio" 
                v-model="userSettings.theme" 
                value="auto" 
              />
              <span>跟随系统</span>
            </label>
          </div>
        </div>
      </Card>

      <!-- 通知设置 -->
      <Card title="通知设置" class="settings-section">
        <div class="setting-item">
          <label class="setting-label">运动提醒</label>
          <div class="switch-container">
            <label class="switch">
              <input type="checkbox" v-model="notificationSettings.exerciseReminders" />
              <span class="slider"></span>
            </label>
            <span class="switch-label">{{ notificationSettings.exerciseReminders ? '开启' : '关闭' }}</span>
          </div>
        </div>
        
        <div class="setting-item">
          <label class="setting-label">饮食记录提醒</label>
          <div class="switch-container">
            <label class="switch">
              <input type="checkbox" v-model="notificationSettings.nutritionReminders" />
              <span class="slider"></span>
            </label>
            <span class="switch-label">{{ notificationSettings.nutritionReminders ? '开启' : '关闭' }}</span>
          </div>
        </div>
        
        <div class="setting-item">
          <label class="setting-label">睡眠提醒</label>
          <div class="switch-container">
            <label class="switch">
              <input type="checkbox" v-model="notificationSettings.sleepReminders" />
              <span class="slider"></span>
            </label>
            <span class="switch-label">{{ notificationSettings.sleepReminders ? '开启' : '关闭' }}</span>
          </div>
        </div>
      </Card>

      <!-- 健康目标设置 -->
      <Card title="健康目标" class="settings-section">
        <div class="setting-item">
          <label class="setting-label">每日运动目标 (分钟)</label>
          <Input 
            v-model="healthGoals.dailyExercise" 
            type="number" 
            min="15" 
            max="120" 
          />
        </div>
        
        <div class="setting-item">
          <label class="setting-label">每日热量目标 (千卡)</label>
          <Input 
            v-model="healthGoals.dailyCalories" 
            type="number" 
            min="1200" 
            max="3000" 
          />
        </div>
        
        <div class="setting-item">
          <label class="setting-label">睡眠时长目标 (小时)</label>
          <Input 
            v-model="healthGoals.sleepDuration" 
            type="number" 
            min="6" 
            max="10" 
            step="0.5" 
          />
        </div>
      </Card>

      <!-- 数据与隐私 -->
      <Card title="数据与隐私" class="settings-section">
        <div class="setting-item">
          <label class="setting-label">数据同步</label>
          <div class="switch-container">
            <label class="switch">
              <input type="checkbox" v-model="privacySettings.dataSync" />
              <span class="slider"></span>
            </label>
            <span class="switch-label">{{ privacySettings.dataSync ? '开启' : '关闭' }}</span>
          </div>
        </div>
        
        <div class="setting-item">
          <label class="setting-label">数据分析</label>
          <div class="switch-container">
            <label class="switch">
              <input type="checkbox" v-model="privacySettings.analytics" />
              <span class="slider"></span>
            </label>
            <span class="switch-label">{{ privacySettings.analytics ? '开启' : '关闭' }}</span>
          </div>
        </div>
        
        <div class="setting-item">
          <Button variant="outline" @click="exportData">导出健康数据</Button>
          <Button variant="outline" @click="clearData" class="danger-button">清除所有数据</Button>
        </div>
      </Card>

      <!-- 保存按钮 -->
      <div class="action-buttons">
        <Button @click="saveSettings" :loading="isSaving">保存设置</Button>
        <Button variant="outline" @click="resetSettings">恢复默认</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'

interface UserSettings {
  username: string
  email: string
  theme: 'light' | 'dark' | 'auto'
}

interface NotificationSettings {
  exerciseReminders: boolean
  nutritionReminders: boolean
  sleepReminders: boolean
}

interface HealthGoals {
  dailyExercise: number
  dailyCalories: number
  sleepDuration: number
}

interface PrivacySettings {
  dataSync: boolean
  analytics: boolean
}

const userSettings = reactive<UserSettings>({
  username: '健康达人',
  email: 'user@example.com',
  theme: 'auto'
})

const notificationSettings = reactive<NotificationSettings>({
  exerciseReminders: true,
  nutritionReminders: true,
  sleepReminders: true
})

const healthGoals = reactive<HealthGoals>({
  dailyExercise: 30,
  dailyCalories: 1800,
  sleepDuration: 7.5
})

const privacySettings = reactive<PrivacySettings>({
  dataSync: true,
  analytics: true
})

const isSaving = ref(false)

const saveSettings = async () => {
  isSaving.value = true
  try {
    // 模拟保存设置
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('设置已保存', {
      userSettings,
      notificationSettings,
      healthGoals,
      privacySettings
    })
  } catch (error) {
    console.error('保存设置失败:', error)
  } finally {
    isSaving.value = false
  }
}

const resetSettings = () => {
  Object.assign(userSettings, {
    username: '健康达人',
    email: 'user@example.com',
    theme: 'auto'
  })
  
  Object.assign(notificationSettings, {
    exerciseReminders: true,
    nutritionReminders: true,
    sleepReminders: true
  })
  
  Object.assign(healthGoals, {
    dailyExercise: 30,
    dailyCalories: 1800,
    sleepDuration: 7.5
  })
  
  Object.assign(privacySettings, {
    dataSync: true,
    analytics: true
  })
}

const exportData = () => {
  console.log('导出健康数据')
  // 实现数据导出逻辑
}

const clearData = () => {
  if (confirm('确定要清除所有数据吗？此操作不可恢复。')) {
    console.log('清除所有数据')
    // 实现数据清除逻辑
  }
}
</script>

<style scoped>
.settings-view {
  padding: var(--spacing-lg);
  max-width: 800px;
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

.settings-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.settings-section {
  padding: var(--spacing-lg);
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--color-border);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-label {
  font-weight: 600;
  color: var(--color-text-primary);
  min-width: 120px;
}

.theme-options {
  display: flex;
  gap: var(--spacing-lg);
}

.theme-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  cursor: pointer;
}

.switch-container {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-border);
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--color-primary);
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.switch-label {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.action-buttons {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  margin-top: var(--spacing-xl);
}

.danger-button {
  color: var(--color-error);
  border-color: var(--color-error);
}

.danger-button:hover {
  background-color: var(--color-error);
  color: white;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .settings-view {
    padding: var(--spacing-md);
  }
  
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
  
  .theme-options {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>
