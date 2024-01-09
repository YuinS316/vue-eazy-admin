import { defaultLayout } from '@/constants/settings';
export const useAppStore = defineStore('app', () => {
  const layout = ref(defaultLayout);

  function setLayout(value: string) {
    layout.value = value;
  }

  return {
    layout,
    setLayout,
  };
});
