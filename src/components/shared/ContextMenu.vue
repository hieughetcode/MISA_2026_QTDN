<template>
    <Teleport to="body">
        <template v-if="visible">
            <div class="ctx-overlay" @click="$emit('close')" @contextmenu.prevent="$emit('close')" />
            <div class="ctx-menu" :style="{ top: y + 'px', left: x + 'px' }" @click.stop>
                <template v-for="(item, i) in items" :key="i">
                    <div v-if="item.divider" class="ctx-menu__sep" />
                    <div v-else class="ctx-menu__item" :class="{ 'ctx-menu__item--danger': item.danger }"
                        @click="item.action(); $emit('close')">
                        <div v-if="item.icon" :class="[item.icon, 'ctx-menu__icon']" />
                        <span>{{ item.label }}</span>
                    </div>
                </template>
            </div>
        </template>
    </Teleport>
</template>

<script setup>
defineProps({
    visible: { type: Boolean, required: true },
    x:       { type: Number, default: 0 },
    y:       { type: Number, default: 0 },
    items:   { type: Array, default: () => [] },
})

defineEmits(['close'])
</script>
