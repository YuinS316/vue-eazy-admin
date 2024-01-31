import Modal from '@/components/modal/index.vue';
export function useModal() {
  const modalRef = ref<InstanceType<typeof Modal> | null>(null);
  return [modalRef];
}
