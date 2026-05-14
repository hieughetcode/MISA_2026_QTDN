# CLAUDE.md — Frontend Part 2: Quản lý Thành phần lương (MISA AMIS HR)

## Dev Workflow

```bash
npm run dev   # Khởi động dev server tại http://localhost:5173
```

Chỉ cần `npm run dev` để test giao diện. User tự mở browser để xem kết quả.

---

## Tổng quan dự án

Dự án xây dựng giao diện quản lý **Thành phần lương** (Salary Composition) cho hệ thống AMIS Nhân sự – Đào Hán, theo đề bài Fresher NSĐH-PDTHIEN. Đây là SPA dùng Vue 3 + Vite, không có backend thật – dữ liệu lấy từ mock (`src/mocks/data.js`).

---

## Tech Stack

| Thứ | Công nghệ | Ghi chú |
|-----|-----------|---------|
| Framework | Vue 3 (Composition API, `<script setup>`) | |
| Build tool | Vite 8 | |
| Router | Vue Router 4 | History mode |
| UI Grid | DevExtreme 25 (`devextreme-vue`) | Dùng cho DxDataGrid |
| Kéo thả | vue-draggable-next | Dùng cho Column Setup |
| CSS | Scoped CSS + CSS Variables toàn cục | Không dùng Tailwind/Bootstrap |

---

## Bảng màu & CSS Variables

Tất cả màu sắc đã được khai báo trong `src/assets/styles/main.css` dưới dạng CSS variables. **Luôn dùng biến, không hardcode màu.**

### Màu chính

| Biến | Giá trị | Dùng cho |
|------|---------|----------|
| `--color-primary` / `--primary` | `#34b057` | Nút chính, border focus, active |
| `--color-primary-hover` | `#2a8c45` | Hover nút |
| `--button-primary-hover-bg-color` | `#02b936` | Hover button |
| `--button-primary-active-bg-color` | `#198f3b` | Active/pressed button |

### Màu text

| Biến | Giá trị |
|------|---------|
| `--text-primary-color` / `--text-main` | `#212121` |
| `--text-secondary-color` | `#666666` |
| `--text-disable-color` / `--text-placeholder` | `#9e9e9e` |
| `--text-white-primary-color` | `#ffffff` |

### Màu nền & border

| Biến | Giá trị |
|------|---------|
| `--bg-main` | `#f2f2f2` (nền trang) |
| `--input-normal-border-color` / `--grid-border` | `#e0e0e0` |
| `--input-active-border-color` | `#34b057` |
| `--input-error-border-color` / `--red-color` | `#ff6161` |
| `--input-disable-bg-color` | `#ebebeb` |
| `--grid-header-bg` | `#f6f6f6` |

### Màu trạng thái

| Biến | Giá trị | Ý nghĩa |
|------|---------|---------|
| `--status-active` | `#34b057` | Đang sử dụng |
| `--status-error` | `#e54848` | Lỗi |
| `--status-warning` / `--yellow` | `#ffdd00` / `#ff9f43` | Cảnh báo |
| `--status-pending` | `#ff9900` | Chờ xử lý |
| `--primary-bg` | `#eafbf2` | Nền highlight xanh nhạt |

### Color Palette (avatar/tag)
`--palette-1` (#e83950) → `--palette-15` (#deeef9): 15 màu sắc cho avatar, tag.

---

## Cấu trúc thư mục

```
src/
├── assets/
│   ├── icons/Icon.svg          # Sprite icon dạng mask-image
│   └── styles/
│       ├── main.css            # CSS Variables + reset toàn cục
│       └── fonts.css           # Font chữ
├── components/base/            # Thư viện component tái sử dụng
│   ├── ms-button/MsButton.vue
│   ├── ms-input/
│   │   ├── MsTextField.vue
│   │   └── MsFormula.vue
│   ├── ms-dropdown/MsDropdownList.vue
│   ├── ms-selection/
│   │   ├── MsCheckbox.vue
│   │   ├── MsRadio.vue
│   │   └── MsToggle.vue
│   ├── ms-popup/
│   │   ├── MsModal.vue         # Chưa implement
│   │   └── MsToast.vue
│   ├── ms-tooltip/MsTooltip.vue
│   ├── ms-grid/MsGrid.vue      # Chưa implement
│   └── ms-column/MsColumnSetup.vue # Chưa implement
├── layouts/
│   ├── MainLayout.vue          # Layout gốc (Sidebar + Navbar + router-view)
│   ├── Sidebar.vue
│   └── Navbar.vue
├── views/
│   ├── salarycomposition/
│   │   ├── SalaryCompositionList.vue   # Màn hình danh sách (đang xây)
│   │   └── SalaryCompositionForm.vue   # Form thêm/sửa (chưa implement)
│   └── system-category/
│       └── SalarySystemCategory.vue    # Danh mục hệ thống
├── mocks/data.js               # Dữ liệu giả (organizations, compositions, gridConfigs)
├── models/SalaryComposition.js # Model (chưa implement)
├── apis/
│   ├── baseApi.js
│   └── salaryApi.js
├── utils/
│   ├── constants.js
│   └── formatter.js
└── router/index.js
```

---

## Data Model – Thành phần lương (`compositions`)

Trường quan trọng cần hiểu để render đúng:

| Trường | Kiểu | Ý nghĩa |
|--------|------|---------|
| `compositionType` | number | 1=Phạt DM, 2=Hoa hồng, 3=Thưởng KPI, 4=QA, 5=Lương, 6=Thuế, 7=BH, 8=Khác |
| `compositionProperty` | number | 0=Thu nhập, 1=Khấu trừ |
| `compositionIsTaxable` | number | 0=Không chịu thuế, 1=Chịu thuế |
| `compositionValueType` | number | 1=Tiền cố định, 4=% |
| `compositionValueCategory` | number | 0=Nhập tay, 1=Tính theo công thức |
| `compositionSourceType` | number | 0=Kế thừa hệ thống, 1=Tự tạo |
| `compositionStatus` | number | 0=Đang sử dụng, 1=Ngừng theo dõi |
| `sysCompositionId` | string\|null | null = khoản tự tạo |

---

## Component Library — Cách dùng

### MsButton
```vue
<MsButton type="primary">Thêm</MsButton>
<MsButton type="secondary" icon="ic-edit">Sửa</MsButton>
<MsButton type="combo">Lưu</MsButton>
<MsButton type="link">Xem</MsButton>
<MsButton :disabled="true">Disabled</MsButton>
```
Props: `type` (primary|secondary|link|combo|mixed), `icon`, `rightIcon`, `disabled`
Event: `@click`

### MsTextField
```vue
<MsTextField v-model="search" placeholder="Tìm kiếm..." :isSearch="true" />
<MsTextField v-model="code" label="Mã" :required="true" :state="'error'" errorMessage="Không được để trống" />
<MsTextField v-model="tags" :isMulti="true" />
<MsTextField v-model="value" :readonly="true" />
```
States: `normal`, `error`, `valid`, `verifying`

### MsDropdownList
Dropdown/Combobox có tìm kiếm.

### MsCheckbox / MsRadio / MsToggle
Selection components chuẩn.

### MsToast
Toast message (success/error/warning/info).

### MsTooltip
```vue
<MsTooltip content="Nội dung tooltip" position="top">
  <button>Hover me</button>
</MsTooltip>
```

---

## Icon System

Icons dùng CSS `mask-image` trỏ vào sprite `/src/assets/icons/Icon.svg` với tọa độ `mask-position`.
Xem các icon class mẫu trong `Sidebar.vue` (`.icon-overview`, `.icon-salary-components`, v.v.).

Để thêm icon mới, định nghĩa class CSS:
```css
.icon-my-icon {
  width: 20px;
  height: 20px;
  background-color: var(--icon-border);
  mask-image: url('/src/assets/icons/Icon.svg');
  mask-position: -Xpx -Ypx; /* tọa độ trong sprite */
  mask-repeat: no-repeat;
}
```

---

## Layout & Kích thước

- Navbar: `height: 48px`, `z-index: 9`, cố định trên cùng
- Sidebar: `width: 220px` (thu gọn: `60px`), `top: 48px`, `background: #161a17`
- Content area: `top: 48px`, `left: 220px` (thu gọn: `60px`), `background: #f4f5f8`
- Transition sidebar: `0.3s ease`
- Sidebar state lưu vào `localStorage('sidebarCollapsed')`

---

## Routes

| Path | Component | Mô tả |
|------|-----------|-------|
| `/` | redirect → `/salarycomposition` | |
| `/salarycomposition` | SalaryCompositionList | Danh sách thành phần lương |
| `/salarycomposition/system-category` | SalarySystemCategory | Danh mục hệ thống |

---

## Quy tắc code

- **Không dùng Options API** — chỉ dùng `<script setup>` (Composition API)
- **Không import Vuex/Pinia** — state local dùng `ref`/`reactive`, không có global store
- **Dữ liệu từ mock** — import trực tiếp từ `src/mocks/data.js`, không gọi API thật
- **CSS scoped** cho từng component; biến toàn cục trong `main.css`
- **Không dùng thư viện UI bên ngoài** (no Element Plus, Ant Design, Vuetify) — chỉ dùng component trong `src/components/base/`
- **DevExtreme** chỉ dùng cho `DxDataGrid` khi cần grid phức tạp
- **vue-draggable-next** cho tính năng kéo thả cột (Column Setup)
- Không viết comment giải thích "what" — chỉ viết khi "why" không rõ ràng

---

## Các tính năng cần xây dựng (SalaryCompositionList)

### Header
- Tiêu đề "Thành phần lương"
- Nút **"Danh mục của hệ thống"** → navigate `/salarycomposition/system-category`
- Nút **"Thêm"** (primary) → mở `SalaryCompositionForm`

### Filter Bar
- Ô tìm kiếm (MsTextField isSearch) theo mã/tên
- Dropdown lọc theo **Loại** (compositionType)
- Dropdown lọc theo **Trạng thái** (compositionStatus: Đang dùng / Ngừng theo dõi)

### Data Grid (DxDataGrid)
Cột hiển thị theo `gridConfigs` (`configIsVisible: 1`, sắp xếp theo `configColumnOrder`):
- Mã thành phần (`compositionCode`) — pinned trái
- Tên thành phần (`compositionName`)
- Đơn vị áp dụng (join `organizationId` → `organizations.organizationName`)
- Loại (`compositionType` → render text)
- Tính chất (`compositionProperty` → Thu nhập / Khấu trừ)
- Chịu thuế (`compositionIsTaxable` → Có / Không)
- Kiểu giá trị (`compositionValueType`)
- Cách tính (`compositionValueCategory`)
- Ghi chú (`compositionDescription`)
- Nguồn (`compositionSourceType` → Hệ thống / Tự tạo)
- Trạng thái (`compositionStatus` → badge màu)

Tính năng grid:
- Checkbox chọn nhiều dòng
- Click hàng → mở form sửa
- Right-click (context menu): Sửa, Xóa, Ngừng theo dõi, Sử dụng lại
- Cột cuối: icon hành động (sửa/xóa)

### Column Setup (MsColumnSetup)
- Nút cài đặt cột trên toolbar grid
- Panel hiển thị danh sách cột, toggle ẩn/hiện, kéo thả đổi thứ tự
- Lưu cấu hình vào `gridConfigs` (userId-specific)

### Form Thêm/Sửa (SalaryCompositionForm)
Modal hoặc drawer với các trường:
- Mã thành phần (required)
- Tên thành phần (required)
- Đơn vị áp dụng (dropdown)
- Loại (dropdown)
- Tính chất (radio: Thu nhập / Khấu trừ)
- Chịu thuế (toggle/checkbox)
- Kiểu giá trị (radio: Tiền cố định / %)
- Cách tính (radio: Nhập tay / Công thức)
- Công thức (MsFormula — hiện khi Cách tính = Công thức)
- Ghi chú (textarea)
- Action: Lưu, Lưu & Thêm tiếp, Hủy

---

## Màn hình Danh mục Hệ thống (SalarySystemCategory)

Grid hiển thị `sysCompositions` (read-only, không sửa được).
Nút "Thêm vào danh sách" để kế thừa khoản lương hệ thống.