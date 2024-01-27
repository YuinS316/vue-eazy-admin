export interface GetUserDetailResDTO {
  currentRole: CurrentRole;
  enable: boolean;
  id: number;
  profile: Profile;
  roles: Role[];
  userName: string;
}

export interface CurrentRole {
  code: string;
  createdBy: string;
  createdOn: string;
  description: null;
  enable: boolean;
  id: number;
  name: string;
  updatedBy: string;
  updatedOn: string;
}

export interface Profile {
  avatarUrl: string;
  createdBy: null;
  createdOn: string;
  email: string;
  id: number;
  nickName: string;
  phone: string;
  updatedBy: null;
  updatedOn: string;
  userId: number;
}

export interface Role {
  code: string;
  createdB: string;
  createdOn: string;
  description: string | null;
  enable: boolean;
  id: number;
  name: string;
  updatedBy: string;
  updatedOn: string;
}
