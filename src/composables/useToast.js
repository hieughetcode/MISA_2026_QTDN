import { ref } from 'vue'

export function useToast() {
  let _id = 0
  const toasts = ref([])

  const showToast = (type, text) => {
    toasts.value.push({ id: ++_id, type, text })
  }

  const removeToast = (id) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return { toasts, showToast, removeToast }
}
