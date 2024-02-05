<template>
  <Modal ref="modalRef" title="新增资源" width="700px">
    <div>
      <n-form
        inline
        :label-width="80"
        ref="formRef"
        :model="formValue"
        :rules="formRules"
      >
        <n-grid :cols="24" :x-gap="24">
          <n-form-item-gi :span="12" label="名称" path="name">
            <n-input v-model:value="formValue.name"></n-input>
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="权限标识" path="code">
            <n-input v-model:value="formValue.code"></n-input>
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="路由路径">
            <n-input v-model:value="formValue.path"></n-input>
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="组件路径">
            <n-select
              v-model:value="formValue.component"
              :options="routeOptions"
              filterable
              clearable
              placeholder="请选择组件路径"
            ></n-select>
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="所属菜单" path="parentId">
            <n-tree-select
              v-model:value="formValue.parentId"
              :options="menuTreeOptions"
              label-field="name"
              key-field="id"
            ></n-tree-select>
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="排序" path="order">
            <n-input-number
              class="w-full"
              v-model:value="formValue.order"
            ></n-input-number>
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="是否显示" path="show">
            <n-switch v-model:value="formValue.show">
              <template #checked> 显示 </template>
              <template #unchecked> 隐藏 </template>
            </n-switch>
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="是否启用" path="enable">
            <n-switch v-model:value="formValue.enable">
              <template #checked> 启用 </template>
              <template #unchecked> 禁止 </template>
            </n-switch>
          </n-form-item-gi>

          <n-form-item-gi :span="24" label="描述">
            <n-input v-model:value="formValue.description"></n-input>
          </n-form-item-gi>
        </n-grid>
      </n-form>
    </div>

    <template #footer>
      <div class="f-c-c">
        <n-button class="mr-16" @click="close">取消</n-button>
        <n-button type="primary" @click="handleSave">确认</n-button>
      </div>
    </template>
  </Modal>

  <slot :open="open"></slot>
</template>

<script setup lang="ts">
import { FormInst } from 'naive-ui';
import Modal from '@/components/modal/index.vue';
import { useModal } from '@/composables';
import { CreateNewMenuReqDTO, PermissionEntity } from '@/api/permission/model';
import { cloneDeep } from 'lodash-es';
import pagePath from 'ez:gen-page-path';
import permissionApi from '@/api/permission';
import { useAuthStore } from '@/store/modules/auth';

const props = defineProps<{
  permissionList: PermissionEntity[];
}>();

const emit = defineEmits<{
  (e: 'onCreateSuccess'): void;
}>();

const [modalRef] = useModal();

function open() {
  modalRef.value?.open();
}

function close() {
  modalRef.value?.close();
}

const authStore = useAuthStore();

const formRef = ref<FormInst | null>(null);
const formValue = ref({
  parentId: -1,
  name: '',
  code: '',
  path: null,
  component: null,
  show: false,
  enable: false,
  order: 0,
  description: '',
});
const formRules = ref({
  name: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入名称',
  },
  code: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入权限标识',
  },
});

const menuTreeOptions = computed(() => {
  const result: any = [
    {
      name: '根菜单',
      id: -1,
      children: [],
    },
  ];

  const idToPermissionMap: Record<number, PermissionEntity> = {};
  props.permissionList.forEach((item) => {
    idToPermissionMap[item.id] = cloneDeep(item);
  });

  props.permissionList.forEach((item) => {
    if (item.parentId) {
      const parent = idToPermissionMap[item.parentId];
      if (!Array.isArray(parent.children)) {
        parent.children = [];
      }
      parent.children.push(item);
    }
  });

  const rootMenuList = props.permissionList.filter(
    (item) => item.parentId === null,
  );

  result[0].children = rootMenuList;

  return result;
});

const routeOptions = (pagePath as string[])
  .filter((item) => !item.includes('/components/'))
  .map((item) => ({
    label: item,
    value: item,
  }));

function resetForm() {
  formValue.value = {
    parentId: -1,
    name: '',
    code: '',
    path: null,
    component: null,
    show: false,
    enable: false,
    order: 0,
    description: '',
  };
}

function handleSave(e: MouseEvent) {
  e.preventDefault();

  formRef.value?.validate(async (errors) => {
    if (errors) {
      window.$message.warning('验证失败');
    } else {
      const body = buildBody();
      const res = await permissionApi.createNewMenu(body);
      if (res) {
        window.$message.success('创建成功');
        emit('onCreateSuccess');
        resetForm();
        close();
      }
    }
  });
}

function buildBody(): CreateNewMenuReqDTO {
  const body: any = {
    type: 'menu',
    createdBy: authStore.user?.userName,
    updatedBy: authStore.user?.userName,
  };

  for (const key in formValue.value) {
    const value = formValue.value[key as keyof typeof formValue.value];
    body[key] = value;
    if (key === 'parentId' && value === -1) {
      body[key] = null;
    }
  }

  return body;
}
</script>

<style scoped></style>
