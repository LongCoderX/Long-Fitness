<template>
  <div class="knowledge-view">
    <div class="page-header">
      <h1>📚 知识库</h1>
      <p class="subtitle">学习健康知识，科学管理您的健康</p>
    </div>

    <div class="content-grid">
      <!-- 知识分类导航 -->
      <Card title="知识分类" class="category-nav">
        <div class="category-grid">
          <div 
            v-for="category in categories" 
            :key="category.id"
            class="category-item"
            :class="{ active: activeCategory === category.id }"
            @click="selectCategory(category.id)"
          >
            <div class="category-icon">{{ category.icon }}</div>
            <div class="category-name">{{ category.name }}</div>
            <div class="category-count">{{ category.count }}篇文章</div>
          </div>
        </div>
      </Card>

      <!-- 文章列表 -->
      <Card :title="`${activeCategoryName} 文章`" class="article-list">
        <div class="articles">
          <div 
            v-for="article in filteredArticles" 
            :key="article.id"
            class="article-item"
            @click="viewArticle(article)"
          >
            <div class="article-header">
              <h3 class="article-title">{{ article.title }}</h3>
              <span class="article-date">{{ formatDate(article.date) }}</span>
            </div>
            <p class="article-excerpt">{{ article.excerpt }}</p>
            <div class="article-meta">
              <span class="article-category">{{ article.category }}</span>
              <span class="article-read-time">阅读时间: {{ article.readTime }}</span>
            </div>
          </div>
        </div>
      </Card>

      <!-- 热门文章 -->
      <Card title="热门文章" class="popular-articles">
        <div class="popular-list">
          <div 
            v-for="article in popularArticles" 
            :key="article.id"
            class="popular-item"
            @click="viewArticle(article)"
          >
            <div class="popular-rank">#{{ article.rank }}</div>
            <div class="popular-info">
              <div class="popular-title">{{ article.title }}</div>
              <div class="popular-views">{{ article.views }}次阅读</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Card from '@/components/ui/Card.vue'

interface Article {
  id: number
  title: string
  excerpt: string
  category: string
  date: Date
  readTime: string
  views?: number
  rank?: number
}

interface Category {
  id: string
  name: string
  icon: string
  count: number
}

const categories = ref<Category[]>([
  { id: 'nutrition', name: '营养学知识', icon: '🍎', count: 42 },
  { id: 'exercise', name: '运动生理学', icon: '🏃', count: 38 },
  { id: 'sleep', name: '睡眠知识', icon: '😴', count: 25 },
  { id: 'anatomy', name: '关节解剖学', icon: '🦴', count: 31 },
  { id: 'psychology', name: '健康心理学', icon: '🧠', count: 19 },
  { id: 'lifestyle', name: '生活方式', icon: '🌿', count: 27 }
])

const articles = ref<Article[]>([
  {
    id: 1,
    title: '蛋白质摄入的科学指南',
    excerpt: '了解不同人群的蛋白质需求，以及如何通过饮食获得足够的优质蛋白质。',
    category: 'nutrition',
    date: new Date('2025-08-15'),
    readTime: '5分钟'
  },
  {
    id: 2,
    title: '深蹲动作的解剖学原理',
    excerpt: '深入分析深蹲动作中涉及的肌肉群和关节运动，帮助您正确执行这个基础动作。',
    category: 'anatomy',
    date: new Date('2025-08-10'),
    readTime: '8分钟'
  },
  {
    id: 3,
    title: '改善睡眠质量的10个实用技巧',
    excerpt: '从环境调整到生活习惯，全面改善您的睡眠质量。',
    category: 'sleep',
    date: new Date('2025-08-05'),
    readTime: '6分钟'
  },
  {
    id: 4,
    title: '有氧运动与无氧运动的区别',
    excerpt: '了解两种运动方式的能量代谢差异和各自的健康益处。',
    category: 'exercise',
    date: new Date('2025-08-01'),
    readTime: '7分钟'
  },
  {
    id: 5,
    title: '压力管理的认知行为技巧',
    excerpt: '通过学习认知重构和行为调整，有效管理日常压力。',
    category: 'psychology',
    date: new Date('2025-07-28'),
    readTime: '9分钟'
  }
])

const popularArticles = ref<Article[]>([
  {
    id: 101,
    title: '减脂期的饮食策略',
    excerpt: '科学控制热量摄入，合理安排三大营养素比例，实现健康减脂。',
    category: 'nutrition',
    date: new Date('2025-08-12'),
    readTime: '6分钟',
    rank: 1,
    views: 1245
  },
  {
    id: 102,
    title: '办公室人群的体态纠正',
    excerpt: '针对久坐人群常见的体态问题，提供有效的纠正训练方案。',
    category: 'exercise',
    date: new Date('2025-08-08'),
    readTime: '7分钟',
    rank: 2,
    views: 987
  },
  {
    id: 103,
    title: '睡眠周期与生物钟',
    excerpt: '了解睡眠的不同阶段和生物钟调节机制，优化睡眠质量。',
    category: 'sleep',
    date: new Date('2025-08-05'),
    readTime: '5分钟',
    rank: 3,
    views: 856
  },
  {
    id: 104,
    title: '运动损伤的预防与处理',
    excerpt: '常见运动损伤的预防措施和急性期的正确处理方式。',
    category: 'exercise',
    date: new Date('2025-08-03'),
    readTime: '8分钟',
    rank: 4,
    views: 732
  },
  {
    id: 105,
    title: '情绪饮食的科学应对',
    excerpt: '识别情绪性进食的触发因素，建立健康的应对机制。',
    category: 'psychology',
    date: new Date('2025-07-30'),
    readTime: '6分钟',
    rank: 5,
    views: 689
  }
])

const activeCategory = ref<string>('nutrition')

const activeCategoryName = computed(() => {
  const category = categories.value.find(cat => cat.id === activeCategory.value)
  return category ? category.name : '所有'
})

const filteredArticles = computed(() => {
  if (activeCategory.value === 'all') {
    return articles.value
  }
  return articles.value.filter(article => article.category === activeCategory.value)
})

const selectCategory = (categoryId: string) => {
  activeCategory.value = categoryId
}

const viewArticle = (article: Article) => {
  console.log('查看文章:', article.title)
  // 实现查看文章详情逻辑
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
.knowledge-view {
  padding: var(--spacing-lg);
  max-width: 1200px;
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

.content-grid {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.category-nav .category-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-sm);
}

.category-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--color-border);
}

.category-item:hover {
  background-color: var(--color-background-secondary);
  transform: translateY(-2px);
}

.category-item.active {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.category-icon {
  font-size: 1.5rem;
  margin-right: var(--spacing-md);
  width: 30px;
  text-align: center;
}

.category-name {
  flex: 1;
  font-weight: 600;
}

.category-count {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.category-item.active .category-count {
  color: rgba(255, 255, 255, 0.8);
}

.article-list .articles {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.article-item {
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--color-border);
}

.article-item:hover {
  background-color: var(--color-background-secondary);
  transform: translateY(-1px);
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-sm);
}

.article-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  flex: 1;
}

.article-date {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  white-space: nowrap;
  margin-left: var(--spacing-md);
}

.article-excerpt {
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin-bottom: var(--spacing-sm);
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.article-category {
  color: var(--color-primary);
  font-weight: 500;
}

.article-read-time {
  color: var(--color-text-secondary);
}

.popular-articles .popular-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.popular-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
}

.popular-item:hover {
  background-color: var(--color-background-secondary);
}

.popular-rank {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--color-primary);
  width: 30px;
  text-align: center;
}

.popular-info {
  flex: 1;
  margin-left: var(--spacing-sm);
}

.popular-title {
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.popular-views {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr 2fr;
  }
  
  .popular-articles {
    grid-column: 1 / -1;
  }
}

@media (max-width: 768px) {
  .knowledge-view {
    padding: var(--spacing-md);
  }
  
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .category-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
  
  .article-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .article-date {
    margin-left: 0;
    margin-top: var(--spacing-xs);
  }
}
</style>
