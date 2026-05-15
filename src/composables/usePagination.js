import { ref, computed, watch } from 'vue'

export function usePagination(filteredData, { initialPageSize = 25, resetOn = [] } = {}) {
  const currentPage = ref(1)
  const pageSize = ref(initialPageSize)

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredData.value.length / pageSize.value))
  )

  const paginatedData = computed(() => {
    const p = Math.min(currentPage.value, totalPages.value)
    const start = (p - 1) * pageSize.value
    return filteredData.value.slice(start, start + pageSize.value)
  })

  watch(totalPages, (newTotal) => {
    if (currentPage.value > newTotal) currentPage.value = Math.max(1, newTotal)
  })

  if (resetOn.length) {
    watch(resetOn, () => { currentPage.value = 1 })
  }

  return { currentPage, pageSize, paginatedData }
}
