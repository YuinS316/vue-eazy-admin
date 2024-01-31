<template>
  <n-modal
    v-model:show="showModal"
    :style="modalStyle"
    :bordered="false"
    :preset="undefined"
    size="huge"
  >
    <n-card closable @close="close">
      <template #header>
        <div :style="props.headerStyle">{{ props.title }}</div>
      </template>

      <div :style="props.contentStyle">
        <slot></slot>
      </div>

      <template #footer>
        <div :style="props.footerStyle">
          <slot name="footer"></slot>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue';

interface ICardProps {
  width: string;
  modalStyle: CSSProperties;
  title: string;
  headerStyle: CSSProperties;
  contentStyle: CSSProperties;
  footerStyle: CSSProperties;
}

const props = withDefaults(defineProps<Partial<ICardProps>>(), {
  width: '600px',
});

const modalStyle = computed<CSSProperties>(() => ({
  width: props.width,
  ...props.modalStyle,
}));

const showModal = ref(false);

function open() {
  showModal.value = true;
}

function close() {
  showModal.value = false;
}

defineExpose({
  open,
  close,
});
</script>

<style scoped></style>
