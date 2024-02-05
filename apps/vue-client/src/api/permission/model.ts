export type GetMenuPermissionResDTO = PermissionEntity[];

export interface PermissionEntity {
  children: PermissionEntity[];
  code: string;
  component: null | string;
  createdBy: string;
  createdOn: string;
  description: null | string;
  enable: boolean;
  icon: null | string;
  id: number;
  keepAlive: null | boolean;
  layout: null | string;
  name: string;
  order: null | number;
  parentId: null | number;
  path: null | string;
  redirect: null | string;
  show: boolean;
  type: string;
  updatedBy: string;
  updatedOn: string;
}

export interface CreateNewMenuReqDTO {
  type: 'menu';
  code: string;
  name: string;
  createdBy: string;
  updatedBy: string;
  parentId: null | number;
  path: string;
  component: string;
  show: boolean;
  enable: boolean;
  order: number;
}
