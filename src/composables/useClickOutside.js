import { onMounted, onUnmounted } from 'vue'

export function useClickOutside(handler) {
  onMounted(() => document.addEventListener('click', handler))
  onUnmounted(() => document.removeEventListener('click', handler))
}
