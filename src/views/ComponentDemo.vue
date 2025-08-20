<template>
  <div class="component-demo">
    <header class="demo-header">
      <h1>Long-Fitness 组件演示</h1>
      <p>基于设计系统的跨平台UI组件库</p>
    </header>

    <main class="demo-content">
      <!-- 按钮组件演示 -->
      <section class="demo-section">
        <h2>按钮组件 (Button)</h2>
        <div class="component-grid">
          <Button @click="showNotification('主要按钮点击')">
            主要按钮
          </Button>
          <Button variant="secondary" @click="showNotification('次要按钮点击')">
            次要按钮
          </Button>
          <Button variant="text" @click="showNotification('文字按钮点击')">
            文字按钮
          </Button>
          <Button :disabled="true">
            禁用按钮
          </Button>
          <Button :loading="true">
            加载中
          </Button>
        </div>
      </section>

      <!-- 卡片组件演示 -->
      <section class="demo-section">
        <h2>卡片组件 (Card)</h2>
        <div class="component-grid">
          <Card class="demo-card">
            <template #header>
              <h3>基础卡片</h3>
            </template>
            <p>这是一个基础卡片组件，包含标题和内容区域。</p>
            <template #footer>
              <Button size="sm">操作按钮</Button>
            </template>
          </Card>

          <Card class="demo-card" shadow="md">
            <template #header>
              <h3>中等阴影卡片</h3>
            </template>
            <p>带有中等阴影效果的卡片。</p>
          </Card>

          <Card class="demo-card" shadow="lg">
            <template #header>
              <h3>大阴影卡片</h3>
            </template>
            <p>带有大阴影效果的卡片。</p>
          </Card>
        </div>
      </section>

      <!-- 输入框组件演示 -->
      <section class="demo-section">
        <h2>输入框组件 (Input)</h2>
        <div class="component-grid column-layout">
          <Input
            v-model="demoInput"
            label="基础输入框"
            placeholder="请输入内容"
          />

          <Input
            v-model="demoEmail"
            type="email"
            label="邮箱输入框"
            placeholder="请输入邮箱地址"
          />

          <Input
            v-model="demoPassword"
            type="password"
            label="密码输入框"
            placeholder="请输入密码"
          />

          <Input
            v-model="demoError"
            label="错误状态"
            placeholder="输入错误内容"
            error="请输入有效内容"
          />

          <Input
            v-model="demoDisabled"
            label="禁用状态"
            placeholder="禁用输入框"
            :disabled="true"
          />
        </div>
      </section>

      <!-- 模态框组件演示 -->
      <section class="demo-section">
        <h2>模态框组件 (Modal)</h2>
        <div class="component-grid">
          <Button @click="showBasicModal = true">
            基础模态框
          </Button>

          <Button @click="showFormModal = true">
            表单模态框
          </Button>

          <Button @click="showFullscreenModal = true">
            全屏模态框
          </Button>

          <Button @click="showCustomModal = true">
            自定义模态框
          </Button>
        </div>
      </section>
    </main>

    <!-- 基础模态框 -->
    <Modal
      v-model="showBasicModal"
      title="基础模态框"
      description="这是一个基础模态框示例"
      @confirm="handleModalConfirm"
    >
      <p>模态框内容区域，可以放置任何自定义内容。</p>
      <p>支持丰富的交互和动画效果。</p>
    </Modal>

    <!-- 表单模态框 -->
    <Modal
      v-model="showFormModal"
      title="记录运动"
      size="lg"
      :show-footer="true"
    >
      <div class="modal-form">
        <Input
          v-model="exerciseName"
          label="运动名称"
          placeholder="请输入运动名称"
        />
        
        <Input
          v-model="exerciseDuration"
          type="number"
          label="运动时长（分钟）"
          placeholder="请输入运动时长"
        />
        
        <Input
          v-model="exerciseIntensity"
          label="运动强度"
          placeholder="请输入运动强度"
        />
      </div>
    </Modal>

    <!-- 全屏模态框 -->
    <Modal
      v-model="showFullscreenModal"
      title="全屏模态框"
      :fullscreen="true"
    >
      <div class="fullscreen-content">
        <h3>全屏内容区域</h3>
        <p>适合展示大量内容或复杂操作。</p>
        <div class="content-placeholder">
          <p>内容占位区域...</p>
        </div>
      </div>
    </Modal>

    <!-- 自定义模态框 -->
    <Modal
      v-model="showCustomModal"
      :show-header="false"
      :show-footer="false"
      :close-on-overlay-click="false"
    >
      <div class="custom-modal-content">
        <h3>自定义模态框</h3>
        <p>隐藏了头部和底部，完全自定义内容。</p>
        <div class="custom-actions">
          <Button variant="secondary" @click="showCustomModal = false">
            取消
          </Button>
          <Button @click="showCustomModal = false">
            确认
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import Modal from '@/components/ui/Modal.vue'

// 演示数据
const demoInput = ref('')
const demoEmail = ref('')
const demoPassword = ref('')
const demoError = ref('错误输入')
const demoDisabled = ref('禁用内容')

// 模态框状态
const showBasicModal = ref(false)
const showFormModal = ref(false)
const showFullscreenModal = ref(false)
const showCustomModal = ref(false)

// 表单数据
const exerciseName = ref('')
const exerciseDuration = ref('')
const exerciseIntensity = ref('')

const showNotification = (message: string) => {
  alert(message)
}

const handleModalConfirm = () => {
  showNotification('模态框确认操作')
  showBasicModal.value = false
}
</script>

<style scoped>
.component-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

.demo-header {
  text-align: center;
  margin-bottom: var(--spacing-xxl);
}

.demo-header h1 {
  font-size: var(--font-size-h1);
  color: var(--color-gray-800);
  margin-bottom: var(--spacing-sm);
}

.demo-header p {
  font-size: var(--font-size-body);
  color: var(--color-gray-600);
}

.demo-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xxl);
}

.demo-section {
  border: 1px solid var(--color-gray-200);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-xl);
  background: var(--color-white);
}

.demo-section h2 {
  font-size: var(--font-size-h2);
  color: var(--color-gray-800);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--color-primary);
}

.component-grid {
  display: grid;
  gap: var(--spacing-md);
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.column-layout {
  grid-template-columns: 1fr;
  max-width: 400px;
}

.demo-card {
  min-height: 120px;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.fullscreen-content {
  padding: var(--spacing-lg);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.content-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-gray-50);
  border-radius: var(--border-radius-md);
  margin-top: var(--spacing-lg);
}

.custom-modal-content {
  padding: var(--spacing-lg);
  text-align: center;
}

.custom-actions {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: center;
  margin-top: var(--spacing-lg);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .component-demo {
    padding: var(--spacing-md);
  }
  
  .demo-section {
    padding: var(--spacing-lg);
  }
  
  .component-grid {
    grid-template-columns: 1fr;
  }
  
  .custom-actions {
    flex-direction: column;
  }
  
  .custom-actions .button {
    width: 100%;
  }
}
</style>
