import { ref } from 'vue'
import { useClickOutside } from './useClickOutside.js'

export function useFilterChip() {
  const openChip = ref(null)

  const toggleChip = (name) => {
    openChip.value = openChip.value === name ? null : name
  }

  const closeAllChips = () => {
    openChip.value = null
  }

  useClickOutside(closeAllChips)

  return { openChip, toggleChip, closeAllChips }
}
