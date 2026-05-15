<template>
  <div
    class="filter-chip"
    :class="{ 'filter-chip--wide': wide }"
    @click.stop="$emit('toggle')"
  >
    <span v-if="label">{{ label }}: <b>{{ selectedLabel }}</b></span>
    <b v-else>{{ selectedLabel }}</b>
    <div class="icon-chevron-xs" :class="{ 'is-open': isOpen }"></div>
    <Transition name="chip-drop">
      <div
        v-if="isOpen"
        class="filter-chip__menu"
        :class="{ 'filter-chip__menu--wide': wide }"
        @click.stop
      >
        <div
          v-for="opt in options"
          :key="String(opt.value)"
          class="filter-chip__menu-item"
          :class="{ 'is-selected': modelValue === opt.value }"
          @click="select(opt.value)"
        >
          <div class="filter-chip__check">
            <div v-if="modelValue === opt.value" class="icon-check-sm"></div>
          </div>
          {{ opt.label }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, default: '' },
  modelValue: { default: '' },
  options: { type: Array, required: true },
  isOpen: { type: Boolean, default: false },
  wide: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'toggle'])

const selectedLabel = computed(() => {
  const opt = props.options.find(o => o.value === props.modelValue)
  return opt ? opt.label : (props.options[0]?.label ?? '')
})

const select = (val) => {
  emit('update:modelValue', val)
  emit('toggle')
}
</script>
