<template>
  <Modal ref="modalRef" title="新增资源" width="700px">
    <div>
      <n-form inline :label-width="80" ref="formRef" :model="formValue">
        <n-grid :cols="24" :x-gap="24">
          <n-form-item-gi :span="12" label="名称" path="name">
            <n-input v-model:value="formValue.name"></n-input>
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="权限标识">
            <n-input v-model:value="formValue.name"></n-input>
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
        </n-grid>
      </n-form>
    </div>

    <template #footer>
      <div class="f-c-c">
        <n-button class="mr-16" @click="close">取消</n-button>
        <n-button type="primary">确认</n-button>
      </div>
    </template>
  </Modal>

  <slot :open="open"></slot>
</template>

<script setup lang="ts">
import { FormInst } from 'naive-ui';
import Modal from '@/components/modal/index.vue';
import { useModal } from '@/composables';
import { PermissionEntity } from '@/api/permission/model';
import { cloneDeep } from 'lodash-es';
import pagePath from 'ez:gen-page-path';

const props = defineProps<{
  permissionList: PermissionEntity[];
}>();

const [modalRef] = useModal();

function open() {
  modalRef.value?.open();
}

function close() {
  modalRef.value?.close();
}

const formRef = ref<FormInst | null>(null);
const formValue = ref({
  parentId: '',
  name: '',
  code: '',
  path: null,
  component: null,
  show: false,
  enable: false,
  order: 0,
});

const menuTreeOptions = computed(() => {
  const result: any = [
    {
      name: '根菜单',
      id: '',
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

const routeOptions = pagePath
  .filter((item) => !item.includes('/components/'))
  .map((item) => ({
    label: item,
    value: item,
  }));
</script>

<style scoped></style>
