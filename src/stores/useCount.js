import { ref, computed, readonly } from 'vue'

const count = ref(0);

// 数据共享在响应式api里变得特别容易了
export const useCounter = () => {
  const readonlyCount = readonly(count);
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count:readonlyCount, doubleCount, increment }
}
