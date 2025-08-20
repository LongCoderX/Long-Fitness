# Long-Fitness 技术实现指南

## 项目架构概述

### 技术栈配置
```bash
# 使用Tauri2创建项目
npm create tauri-app@latest long-fitness
cd long-fitness

# 选择技术栈
- Frontend: Vue3 + TypeScript
- UI Framework: 自定义组件库（基于设计系统）
- Backend: Rust
- Database: SQLite (本地) + 可选云同步
```

## Rust后端架构

### 核心模块结构
```
src/
├── main.rs              # 应用入口
├── lib.rs               # 库定义
├── models/              # 数据模型
│   ├── user.rs          # 用户模型
│   ├── exercise.rs      # 运动模型
│   ├── nutrition.rs     # 营养模型
│   ├── sleep.rs         # 睡眠模型
│   └── stress.rs        # 压力模型
├── services/            # 业务服务
│   ├── health_calculator.rs    # 健康计算服务
│   ├── recommendation_engine.rs # 推荐引擎
│   └── data_sync.rs     # 数据同步服务
├── database/            # 数据库层
│   ├── mod.rs
│   ├── schema.rs        # 数据库schema
│   └── repository.rs    # 数据访问层
└── utils/               # 工具函数
    ├── date_time.rs     # 时间处理
    └── validation.rs    # 数据验证
```

### 核心数据结构

**用户模型 (User)**
```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: Uuid,
    pub username: String,
    pub age: u8,
    pub weight: f32,      // 公斤
    pub height: f32,      // 厘米
    pub fitness_goal: FitnessGoal,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum FitnessGoal {
    WeightLoss,
    Maintenance,
    MuscleGain,
    HealthImprovement,
}
```

**运动记录模型 (ExerciseRecord)**
```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExerciseRecord {
    pub id: Uuid,
    pub user_id: Uuid,
    pub exercise_type: ExerciseType,
    pub duration: u32,    // 分钟
    pub intensity: IntensityLevel,
    pub calories_burned: Option<f32>,
    pub notes: Option<String>,
    pub recorded_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ExerciseType {
    FunctionalTraining,
    BodyweightTraining,
    PostureCorrection,
    Cardio,
}
```

### 健康计算服务

```rust
pub struct HealthCalculator {
    user_repo: UserRepository,
    exercise_repo: ExerciseRepository,
    nutrition_repo: NutritionRepository,
}

impl HealthCalculator {
    pub fn calculate_daily_calorie_target(&self, user_id: Uuid) -> Result<CalorieTarget> {
        let user = self.user_repo.find_by_id(user_id)?;
        let bmr = self.calculate_bmr(&user);
        let activity_level = self.calculate_activity_level(user_id);
        
        let target_calories = match user.fitness_goal {
            FitnessGoal::WeightLoss => bmr * activity_level - 500.0,
            FitnessGoal::Maintenance => bmr * activity_level,
            FitnessGoal::MuscleGain => bmr * activity_level + 300.0,
            FitnessGoal::HealthImprovement => bmr * activity_level,
        };
        
        Ok(CalorieTarget {
            total: target_calories,
            protein: target_calories * 0.3 / 4.0,  // 30%蛋白质
            carbs: target_calories * 0.4 / 4.0,    // 40%碳水
            fat: target_calories * 0.3 / 9.0,      // 30%脂肪
        })
    }
    
    fn calculate_bmr(&self, user: &User) -> f32 {
        // Mifflin-St Jeor公式
        if user.gender == Gender::Male {
            10.0 * user.weight + 6.25 * user.height - 5.0 * user.age as f32 + 5.0
        } else {
            10.0 * user.weight + 6.25 * user.height - 5.0 * user.age as f32 - 161.0
        }
    }
}
```

## Vue3前端架构

### 项目结构
```
src/
├── main.ts              # 应用入口
├── App.vue              # 根组件
├── components/          # 通用组件
│   ├── ui/              # UI基础组件
│   │   ├── Button.vue
│   │   ├── Card.vue
│   │   ├── Input.vue
│   │   └── Modal.vue
│   └── layout/          # 布局组件
│       ├── Navigation.vue
│       ├── Sidebar.vue
│       └── Footer.vue
├── views/               # 页面组件
│   ├── Dashboard.vue
│   ├── Exercise/
│   ├── Nutrition/
│   ├── Sleep/
│   └── Stress/
├── stores/              # Pinia状态管理
│   ├── user.store.ts
│   ├── exercise.store.ts
│   ├── nutrition.store.ts
│   ├── sleep.store.ts
│   └── stress.store.ts
├── services/            # API服务
│   ├── api.ts
│   ├── exercise.service.ts
│   ├── nutrition.service.ts
│   ├── sleep.service.ts
│   └── stress.service.ts
├── types/               # TypeScript类型定义
│   ├── user.types.ts
│   ├── exercise.types.ts
│   ├── nutrition.types.ts
│   ├── sleep.types.ts
│   └── stress.types.ts
├── utils/               # 工具函数
│   ├── date.ts
│   ├── validation.ts
│   └── formatters.ts
└── assets/              # 静态资源
    ├── styles/          # 样式文件
    └── images/          # 图片资源
```

### 跨平台组件基类

```typescript
// src/components/ui/BaseComponent.vue
<script setup lang="ts">
import { computed } from 'vue'
import { usePlatform } from '@/composables/usePlatform'

const platform = usePlatform()

const props = defineProps<{
  // 通用属性
}>()

const isMobile = computed(() => platform.isMobile)
const isDesktop = computed(() => platform.isDesktop)
</script>

<template>
  <div :class="['base-component', { 'mobile': isMobile, 'desktop': isDesktop }]">
    <slot />
  </div>
</template>

<style scoped>
.base-component {
  /* 基础样式 */
}

.base-component.mobile {
  /* 移动端特定样式 */
}

.base-component.desktop {
  /* 桌面端特定样式 */
}
</style>
```

### 状态管理 (Pinia)

```typescript
// src/stores/user.store.ts
import { defineStore } from 'pinia'
import { User, UserPreferences } from '@/types/user.types'

export const useUserStore = defineStore('user', {
  state: (): {
    currentUser: User | null
    preferences: UserPreferences
    isLoading: boolean
  } => ({
    currentUser: null,
    preferences: {
      theme: 'light',
      notifications: true,
      measurementUnit: 'metric'
    },
    isLoading: false
  }),

  actions: {
    async loadUserProfile() {
      this.isLoading = true
      try {
        const user = await userService.getProfile()
        this.currentUser = user
      } catch (error) {
        console.error('Failed to load user profile:', error)
      } finally {
        this.isLoading = false
      }
    },

    async updatePreferences(newPreferences: Partial<UserPreferences>) {
      this.preferences = { ...this.preferences, ...newPreferences }
      // 保存到后端
      await userService.updatePreferences(this.preferences)
    }
  },

  getters: {
    isLoggedIn: (state) => state.currentUser !== null,
    dailyCalorieTarget: (state) => {
      if (!state.currentUser) return null
      // 计算每日热量目标
      return calculateCalorieTarget(state.currentUser)
    }
  }
})
```

## Tauri2配置优化

### 跨平台构建配置
```javascript
// tauri.conf.json
{
  "build": {
    "beforeBuildCommand": "npm run build",
    "beforeDevCommand": "npm run dev",
    "devPath": "http://localhost:1420",
    "distDir": "../dist"
  },
  "package": {
    "productName": "Long-Fitness",
    "version": "1.0.0"
  },
  "tauri": {
    "allowlist": {
      "all": false,
      "shell": {
        "all": false,
        "open": true
      },
      "fs": {
        "all": true,
        "scope": ["$APPDATA/*", "$LOCALDATA/*"]
      },
      "window": {
        "all": false,
        "close": true,
        "hide": true,
        "show": true,
        "maximize": true,
        "minimize": true,
        "unmaximize": true,
        "unminimize": true,
        "startDragging": true
      }
    },
    "bundle": {
      "active": true,
      "targets": "all",
      "identifier": "com.longfitness.app",
      "icon": [
        "icons/32x32.png",
        "icons/128x128.png",
        "icons/128x128@2x.png",
        "icons/icon.icns",
        "icons/icon.ico"
      ]
    },
    "security": {
      "csp": null
    },
    "windows": [
      {
        "fullscreen": false,
        "resizable": true,
        "title": "Long-Fitness",
        "width": 1200,
        "height": 800,
        "minWidth": 800,
        "minHeight": 600
      }
    ]
  }
}
```

### Android特定配置
```javascript
// tauri.conf.json (Android部分)
"tauri": {
  "android": {
    "app": {
      "icon": "icons/icon.png",
      "label": "Long Fitness"
    },
    "permissions": [
      "android.permission.INTERNET",
      "android.permission.WAKE_LOCK",
      "android.permission.VIBRATE"
    ]
  }
}
```

## 性能优化策略

### 1. 数据缓存机制
```rust
// 使用LRU缓存策略
use lru::LruCache;

pub struct DataCache {
    exercise_cache: LruCache<Uuid, Exercise>,
    nutrition_cache: LruCache<String, FoodItem>,
    user_cache: LruCache<Uuid, User>,
}

impl DataCache {
    pub fn new(capacity: usize) -> Self {
        Self {
            exercise_cache: LruCache::new(capacity),
            nutrition_cache: LruCache::new(capacity),
            user_cache: LruCache::new(capacity),
        }
    }
    
    pub async fn get_exercise(&mut self, id: Uuid) -> Option<Exercise> {
        if let Some(exercise) = self.exercise_cache.get(&id) {
            return Some(exercise.clone());
        }
        
        // 从数据库加载
        let exercise = self.exercise_repo.find_by_id(id).await?;
        self.exercise_cache.put(id, exercise.clone());
        Some(exercise)
    }
}
```

### 2. 前端性能优化
```typescript
// 使用虚拟滚动优化长列表
import { useVirtualizer } from '@tanstack/vue-virtual'

const exerciseList = ref<Exercise[]>([])
const containerRef = ref<HTMLElement>()

const virtualizer = useVirtualizer({
  count: exerciseList.value.length,
  getScrollElement: () => containerRef.value,
  estimateSize: () => 80,
  overscan: 5,
})

// 图片懒加载
<img 
  v-lazy="exercise.imageUrl" 
  alt="Exercise image"
  class="exercise-image"
/>

// 组件懒加载
const ExerciseDetail = defineAsyncComponent(() =>
  import('./ExerciseDetail.vue')
)
```

### 3. Rust后端性能优化
```rust
// 使用异步编程
#[tauri::command]
async fn calculate_daily_summary(user_id: String) -> Result<DailySummary, String> {
    let user_id = Uuid::parse_str(&user_id).map_err(|e| e.to_string())?;
    
    // 并行执行多个查询
    let (exercise, nutrition, sleep) = tokio::join!(
        exercise_service.get_today_exercise(user_id),
        nutrition_service.get_today_nutrition(user_id),
        sleep_service.get_last_night_sleep(user_id)
    );
    
    Ok(DailySummary {
        exercise: exercise?,
        nutrition: nutrition?,
        sleep: sleep?,
    })
}

// 使用连接池管理数据库连接
use sqlx::SqlitePool;

pub struct Database {
    pool: SqlitePool,
}

impl Database {
    pub async fn new(database_url: &str) -> Result<Self> {
        let pool = SqlitePool::connect(database_url).await?;
        Ok(Self { pool })
    }
}
```

## 测试策略

### 单元测试
```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_calculate_bmr() {
        let user = User {
            id: Uuid::new_v4(),
            username: "test".to_string(),
            age: 30,
            weight: 70.0,
            height: 175.0,
            gender: Gender::Male,
            fitness_goal: FitnessGoal::WeightLoss,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        };
        
        let calculator = HealthCalculator::new();
        let bmr = calculator.calculate_bmr(&user);
        
        // 验证计算结果
        assert!((bmr - 1662.5).abs() < 0.1);
    }
}
```

### 集成测试
```typescript
// 前端组件测试
import { mount } from '@vue/test-utils'
import ExerciseCard from '@/components/ExerciseCard.vue'

describe('ExerciseCard', () => {
  it('displays exercise information correctly', () => {
    const exercise = {
      id: '1',
      name: '深蹲',
      duration: 15,
      calories: 120
    }
    
    const wrapper = mount(ExerciseCard, {
      props: { exercise }
    })
    
    expect(wrapper.text()).toContain('深蹲')
    expect(wrapper.text()).toContain('15分钟')
  })
})
```

## 部署和发布

### 桌面端打包
```bash
# 构建生产版本
npm run tauri build

# 平台特定构建
npm run tauri build -- --target universal-apple-darwin  # macOS
npm run tauri build -- --target x86_64-pc-windows-msvc  # Windows
npm run tauri build -- --target x86_64-unknown-linux-gnu # Linux
```

### 移动端发布
```bash
# Android构建
npm run tauri android build

# 生成APK和AAB文件
# 发布到Google Play Store
```

### 自动更新机制
```rust
// 实现自动更新检查
use tauri::updater::UpdateBuilder;

#[tauri::command]
async fn check_for_updates(app: tauri::AppHandle) -> Result<Option<Update>, String> {
    let builder = UpdateBuilder::new()
        .url("https://api.longfitness.com/updates")
        .build();
    
    match builder.check().await {
        Ok(update) => Ok(update),
        Err(e) => Err(e.to_string()),
    }
}
```

这个技术实现指南提供了完整的开发框架，从后端Rust架构到前端Vue3实现，以及性能优化和部署策略，为开发团队提供了清晰的技术路线图。
