export interface Exercise {
  id: string
  name: string
  category: 'functional' | 'bodyweight' | 'posture'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  targetMuscles: string[]
  equipment: string[]
  description: string
  instructions: string[]
  precautions: string[]
  imageUrl?: string
  videoUrl?: string
  duration: number // 建议时长（分钟）
  calories: number // 预估消耗（卡路里）
}

export const mockExercises: Exercise[] = [
  {
    id: '1',
    name: '标准深蹲',
    category: 'functional',
    difficulty: 'beginner',
    targetMuscles: ['股四头肌', '臀大肌', '核心'],
    equipment: ['无器械'],
    description: '基础的下肢力量训练动作，锻炼大腿和臀部肌肉',
    instructions: [
      '双脚与肩同宽站立，脚尖略微外展',
      '保持背部挺直，慢慢下蹲至大腿与地面平行',
      '用脚跟发力站起，回到起始位置',
      '重复进行'
    ],
    precautions: [
      '保持膝盖与脚尖方向一致',
      '下蹲时不要弓背',
      '控制速度，避免快速下蹲'
    ],
    duration: 30,
    calories: 50
  },
  {
    id: '2',
    name: '俯卧撑',
    category: 'bodyweight',
    difficulty: 'intermediate',
    targetMuscles: ['胸大肌', '三角肌', '三头肌'],
    equipment: ['无器械'],
    description: '经典的上肢推力训练，锻炼胸部和手臂力量',
    instructions: [
      '手掌平放地面，与肩同宽',
      '身体保持直线，核心收紧',
      '弯曲手肘下降身体，直到胸部接近地面',
      '推起身体回到起始位置'
    ],
    precautions: [
      '保持身体成直线，不要塌腰',
      '手肘不要过度外展',
      '控制下降速度'
    ],
    duration: 20,
    calories: 40
  },
  {
    id: '3',
    name: '平板支撑',
    category: 'bodyweight',
    difficulty: 'beginner',
    targetMuscles: ['腹肌', '核心', '背部'],
    equipment: ['无器械'],
    description: '核心稳定性训练，增强腹部和背部肌肉',
    instructions: [
      '俯卧位，手肘支撑地面',
      '身体保持直线，核心收紧',
      '保持这个姿势，正常呼吸',
      '坚持指定时间'
    ],
    precautions: [
      '不要塌腰或弓背',
      '保持正常呼吸',
      '感觉疲劳时及时休息'
    ],
    duration: 60,
    calories: 30
  },
  {
    id: '4',
    name: '桥式',
    category: 'posture',
    difficulty: 'beginner',
    targetMuscles: ['臀大肌', '腘绳肌', '下背部'],
    equipment: ['瑜伽垫'],
    description: '改善臀部和下背部功能的矫正训练',
    instructions: [
      '仰卧，膝盖弯曲，双脚平放地面',
      '手臂放在身体两侧',
      '抬起臀部，形成桥形',
      '保持片刻后缓慢放下'
    ],
    precautions: [
      '避免用腰部过度发力',
      '感受臀部肌肉的收缩',
      '控制动作幅度'
    ],
    duration: 15,
    calories: 25
  },
  {
    id: '5',
    name: '弓步蹲',
    category: 'functional',
    difficulty: 'intermediate',
    targetMuscles: ['股四头肌', '臀大肌', '核心'],
    equipment: ['无器械'],
    description: '单侧下肢训练，提高平衡和协调性',
    instructions: [
      '站立，一脚向前迈出',
      '下降身体直到前后腿膝盖都成90度',
      '前脚发力站起，回到起始位置',
      '交替进行'
    ],
    precautions: [
      '前膝盖不要超过脚尖',
      '保持身体直立',
      '控制平衡'
    ],
    duration: 25,
    calories: 45
  },
  {
    id: '6',
    name: '鸟狗式',
    category: 'posture',
    difficulty: 'beginner',
    targetMuscles: ['核心', '背部', '臀部'],
    equipment: ['瑜伽垫'],
    description: '改善核心稳定性和脊柱健康的矫正动作',
    instructions: [
      '四足跪姿，手肩同宽，膝髋同宽',
      '同时伸出对侧的手和腿',
      '保持身体稳定，不要晃动',
      '缓慢回到起始位置'
    ],
    precautions: [
      '保持核心收紧',
      '动作要缓慢控制',
      '避免腰部下沉'
    ],
    duration: 20,
    calories: 20
  },
  {
    id: '7',
    name: '登山者',
    category: 'bodyweight',
    difficulty: 'advanced',
    targetMuscles: ['核心', '肩部', '腿部'],
    equipment: ['无器械'],
    description: '高强度的全身性训练，提升心肺功能和核心力量',
    instructions: [
      '从平板支撑姿势开始',
      '快速交替将膝盖向胸部靠拢',
      '保持核心稳定，身体不要晃动',
      '控制节奏和速度'
    ],
    precautions: [
      '保持正确的平板姿势',
      '避免速度过快导致姿势变形',
      '膝盖有问题的要谨慎'
    ],
    duration: 15,
    calories: 60
  },
  {
    id: '8',
    name: '墙壁天使',
    category: 'posture',
    difficulty: 'beginner',
    targetMuscles: ['肩部', '上背部', '胸部'],
    equipment: ['墙壁'],
    description: '改善圆肩驼背的矫正训练，增强上背部力量',
    instructions: [
      '背靠墙壁站立，脚后跟离墙约15厘米',
      '手臂成W形，手背和手肘贴墙',
      '缓慢上下滑动手臂，保持接触墙壁',
      '重复进行'
    ],
    precautions: [
      '保持整个过程中背部贴墙',
      '动作要缓慢控制',
      '不要勉强追求幅度'
    ],
    duration: 10,
    calories: 15
  },
  {
    id: '9',
    name: '臀桥单腿',
    category: 'functional',
    difficulty: 'advanced',
    targetMuscles: ['臀大肌', '核心', '稳定性'],
    equipment: ['瑜伽垫'],
    description: '单侧臀部强化训练，提高平衡和肌肉控制',
    instructions: [
      '仰卧，一腿弯曲，一腿伸直',
      '抬起臀部形成桥形',
      '保持单腿姿势，感受臀部发力',
      '缓慢放下，换边进行'
    ],
    precautions: [
      '避免腰部过度发力',
      '保持骨盆稳定',
      '控制动作幅度'
    ],
    duration: 20,
    calories: 35
  },
  {
    id: '10',
    name: '猫牛式',
    category: 'posture',
    difficulty: 'beginner',
    targetMuscles: ['脊柱', '核心', '背部'],
    equipment: ['瑜伽垫'],
    description: '脊柱灵活性和 mobility 训练，缓解背部紧张',
    instructions: [
      '四足跪姿，手肩同宽，膝髋同宽',
      '吸气时塌腰抬头（牛式）',
      '呼气时弓背低头（猫式）',
      '缓慢流畅地交替进行'
    ],
    precautions: [
      '动作要缓慢有控制',
      '配合呼吸节奏',
      '不要过度伸展'
    ],
    duration: 15,
    calories: 18
  }
]

// 工具函数
export const getExercisesByCategory = (category: Exercise['category']) => {
  return mockExercises.filter(exercise => exercise.category === category)
}

export const getExercisesByDifficulty = (difficulty: Exercise['difficulty']) => {
  return mockExercises.filter(exercise => exercise.difficulty === difficulty)
}

export const searchExercises = (keyword: string) => {
  const lowerKeyword = keyword.toLowerCase()
  return mockExercises.filter(exercise => 
    exercise.name.toLowerCase().includes(lowerKeyword) ||
    exercise.description.toLowerCase().includes(lowerKeyword) ||
    exercise.targetMuscles.some(muscle => muscle.toLowerCase().includes(lowerKeyword))
  )
}
