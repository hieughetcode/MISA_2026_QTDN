export const COMPOSITION_TYPE_MAP = {
  1: 'Phạt đi muộn',
  2: 'Hoa hồng',
  3: 'Thưởng KPI',
  4: 'Thưởng/Phạt QA',
  5: 'Lương',
  6: 'Thuế',
  7: 'Bảo hiểm',
  8: 'Phụ cấp / Khác'
}

export const COMPOSITION_PROPERTY_MAP = { 0: 'Thu nhập', 1: 'Khấu trừ' }
export const COMPOSITION_TAXABLE_MAP = { 0: 'Không', 1: 'Có' }
export const COMPOSITION_VALUE_TYPE_MAP = { 1: 'Tiền cố định', 4: 'Phần trăm (%)' }
export const COMPOSITION_VALUE_CATEGORY_MAP = { 0: 'Nhập tay', 1: 'Công thức' }
export const COMPOSITION_SOURCE_TYPE_MAP = { 0: 'Kế thừa hệ thống', 1: 'Tự tạo' }
export const COMPOSITION_STATUS_MAP = { 0: 'Đang sử dụng', 1: 'Ngừng theo dõi' }

export const COMPOSITION_TYPE_OPTIONS = Object.entries(COMPOSITION_TYPE_MAP).map(([v, label]) => ({
  value: Number(v), label
}))
export const COMPOSITION_STATUS_OPTIONS = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 0, label: 'Đang sử dụng' },
  { value: 1, label: 'Ngừng theo dõi' }
]
export const COMPOSITION_TYPE_FILTER_OPTIONS = [
  { value: '', label: 'Tất cả loại' },
  ...COMPOSITION_TYPE_OPTIONS
]
export const COMPOSITION_PROPERTY_OPTIONS = [
  { value: 0, label: 'Thu nhập' },
  { value: 1, label: 'Khấu trừ' }
]
export const COMPOSITION_VALUE_TYPE_OPTIONS = [
  { value: 1, label: 'Tiền cố định' },
  { value: 4, label: 'Phần trăm (%)' }
]
export const COMPOSITION_VALUE_CATEGORY_OPTIONS = [
  { value: 0, label: 'Nhập tay' },
  { value: 1, label: 'Công thức' }
]