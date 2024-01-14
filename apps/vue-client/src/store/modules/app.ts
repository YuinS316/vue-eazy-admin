import { defaultLayout } from '@/constants/settings';
export const useAppStore = defineStore('app', () => {
  const layout = ref(defaultLayout);

  const isCollapsed = ref(false);

  function setLayout(value: string) {
    layout.value = value;
  }

  function setCollapsed(value: boolean) {
    isCollapsed.value = value;
  }

  return {
    layout,
    setLayout,
    isCollapsed,
    setCollapsed,
  };
});
