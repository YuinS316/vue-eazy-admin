import { Test } from '@nestjs/testing';
import { cleanDB, endDB, startDB, testImportModules } from '@test/helper';
import { UserService } from '@/modules/user/user.service';
import { DBType, DB } from '@/modules/global/providers/mysql.provider';
import { createUser } from '@test/fixture/user';
import { createRole, createPermission } from '@test/fixture/role';
import { RoleService } from '@/modules/role/role.service';
import { PermissionService } from '@/modules/permission/permission.service';

const userA = createUser('userA');
const userB = createUser('userB');

const roleAdmin = createRole('admin');
const roleGuest = createRole('guest');

const permissionA = createPermission('menuA');
const permissionB = createPermission('menuB');

async function setupTesting() {
  const moduleRef = await Test.createTestingModule({
    imports: testImportModules,
    providers: [UserService, RoleService, PermissionService, UserService],
  }).compile();

  return {
    db: moduleRef.get<DBType>(DB),
    userService: moduleRef.get<UserService>(UserService),
    roleService: moduleRef.get<RoleService>(RoleService),
    permissionService: moduleRef.get<PermissionService>(PermissionService),
  };
}

describe('role service', () => {
  let db: DBType;
  let userService: UserService;
  let roleService: RoleService;
  let permissionService: PermissionService;

  beforeAll(async () => {
    const testing = await setupTesting();
    db = testing.db;
    userService = testing.userService;
    roleService = testing.roleService;
    permissionService = testing.permissionService;
  });

  beforeEach(async () => {
    await startDB(db);
    await cleanDB(db);
  });

  afterAll(async () => {
    await cleanDB(db);
    await endDB(db);
  });

  it('should create role with permission success', async function () {
    const pA = await permissionService.create(permissionA);

    await roleService.create({ ...roleAdmin, permissionIdList: [pA.id] });

    const res = await roleService.findPermissionsByRoleCode(roleAdmin.code);

    //  校验角色创建成功
    expect(res.id).toBeGreaterThanOrEqual(0);
    //  校验角色 & 权限关联成功
    expect(res.permissions[0]).toEqual(pA);
  });

  describe('test allocRolesToUser', () => {
    it("should change user's roles ", async function () {
      const uA = await userService.createUser(userA);

      const rA = await roleService.createRole(roleAdmin);
      const rB = await roleService.createRole(roleGuest);

      const res = await roleService.allocRolesToUser(
        {
          roleCodeList: [rA.code, rB.code],
          userName: uA.userName,
        },
        uA.userName,
      );

      const roleIdList = res.map((item) => item.roleId);
      expect(roleIdList).toEqual([rA.id, rB.id]);
    });

    it('should clean user_role bindings when roleCodeList is empty', async function () {
      //  setup
      const uA = await userService.createUser(userA);

      const rA = await roleService.createRole(roleAdmin);
      const rB = await roleService.createRole(roleGuest);

      await roleService.allocRolesToUser(
        {
          roleCodeList: [rA.code, rB.code],
          userName: uA.userName,
        },
        uA.userName,
      );

      //  action
      const res = await roleService.allocRolesToUser(
        {
          roleCodeList: [],
          userName: uA.userName,
        },
        uA.userName,
      );

      //  result
      expect(res.length).toBe(0);
    });
  });

  describe('test addRoleToMultipleUsers', () => {
    it('should add new role to users', async function () {
      //  setup
      const uA = await userService.createUser(userA);
      const uB = await userService.createUser(userB);
      const rA = await roleService.createRole(roleAdmin);

      //  action
      const res = await roleService.addRoleToMultipleUsers(
        { roleCode: rA.code, userNameList: [uA.userName, uB.userName] },
        uA.userName,
      );

      //  result
      expect(res.length).toBe(2);
    });

    it('should not add role when user has', async function () {
      //  setup
      const uA = await userService.createUser(userA);
      const uB = await userService.createUser(userB);
      const rA = await roleService.createRole(roleAdmin);

      //  action
      const res1 = await roleService.addRoleToMultipleUsers(
        { roleCode: rA.code, userNameList: [uA.userName] },
        uA.userName,
      );

      expect(res1.length).toBe(1);

      const res = await roleService.addRoleToMultipleUsers(
        { roleCode: rA.code, userNameList: [uA.userName, uB.userName] },
        uA.userName,
      );

      //  result
      expect(res.length).toBe(2);
    });
  });

  describe('test allocPermissionsToRole', () => {
    it('should add new permission to roles', async function () {
      const rA = await roleService.createRole(roleAdmin);

      const pA = await permissionService.create(permissionA);
      const pB = await permissionService.create(permissionB);

      const res = await roleService.allocPermissionsToRole(
        {
          roleCode: rA.code,
          permissionCodeList: [pA.code, pB.code],
        },
        'test',
      );

      expect(res.length).toBe(2);
    });

    it('should clean user_role bindings when roleCodeList is empty', async function () {
      const rA = await roleService.createRole(roleAdmin);

      const pA = await permissionService.create(permissionA);
      const pB = await permissionService.create(permissionB);

      const res1 = await roleService.allocPermissionsToRole(
        {
          roleCode: rA.code,
          permissionCodeList: [pA.code, pB.code],
        },
        'test',
      );

      expect(res1.length).toBe(2);

      const res = await roleService.allocPermissionsToRole(
        {
          roleCode: rA.code,
          permissionCodeList: [],
        },
        'test',
      );

      expect(res.length).toBe(0);
    });
  });

  describe('test addPermissionToMultipleRoles', () => {
    it('should add new permission to roles', async function () {
      const pA = await permissionService.create(permissionA);

      const rA = await roleService.createRole(roleAdmin);
      const rB = await roleService.createRole(roleGuest);

      const res = await roleService.addPermissionToMultipleRoles(
        {
          permissionCode: pA.code,
          roleCodeList: [rA.code, rB.code],
        },
        'test',
      );

      expect(res.length).toBe(2);
    });

    it('should not add permission when role has', async function () {
      const pA = await permissionService.create(permissionA);

      const rA = await roleService.createRole(roleAdmin);
      const rB = await roleService.createRole(roleGuest);

      const res1 = await roleService.addPermissionToMultipleRoles(
        {
          permissionCode: pA.code,
          roleCodeList: [rA.code],
        },
        'test',
      );

      expect(res1.length).toBe(1);

      const res = await roleService.addPermissionToMultipleRoles(
        {
          permissionCode: pA.code,
          roleCodeList: [rA.code, rB.code],
        },
        'test',
      );

      expect(res.length).toBe(2);
    });
  });
});
