export interface MenuItem {
  label: string;
  key: string;
  path: string | null;
  order: number;
  children?: MenuItem[];
}