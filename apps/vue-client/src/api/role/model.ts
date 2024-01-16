export interface GetRoleByCodeResDTO {
  code: string;
  createdBy: string;
  createdOn: string;
  description: string | null;
  enable: boolean;
  id: number;
  name: string;
  permissions: Permission[];
  updatedBy: string;
  updatedOn: string;
}

export interface Permission {
  children: Permission[];
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
