import { COMPOSITION_TYPE_OPTIONS } from '@/utils/constants.js'

/**
 * Lọc list theo query text trên nhiều field.
 * fields: mảng tên field cần tìm, VD: ['compositionCode', 'compositionName']
 */
export function filterByText(list, query, fields) {
  const q = query.trim().toLowerCase()
  if (!q) return list
  return list.filter(item =>
    fields.some(f => item[f]?.toLowerCase().includes(q))
  )
}

/**
 * Tra cứu tên đơn vị từ ID.
 * Trả về organizationId gốc nếu không tìm thấy (tránh render undefined).
 */
export function getOrgName(organizationId, organizations) {
  const org = organizations.find(o => o.organizationId === organizationId)
  return org ? org.organizationName : organizationId
}

/**
 * Map danh sách organizations → [{value, label}] cho dropdown / chip.
 */
export function toOrgOptions(organizations) {
  return organizations.map(o => ({ value: o.organizationId, label: o.organizationName }))
}

/**
 * Danh sách options cho filter chip Loại, có thêm option "Tất cả" ở đầu.
 */
export function toTypeChipOptions() {
  return [{ value: '', label: 'Tất cả' }, ...COMPOSITION_TYPE_OPTIONS]
}
