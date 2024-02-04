<template>
  <PageCard>
    <div>
      <n-card embedded class="mb-16">
        <div class="flex space-x-16">
          <n-input
            v-model:value="searchForm.name"
            type="text"
            style="max-width: 300px"
          ></n-input>
          <n-button>搜索</n-button>

          <CreateMenuDialog :permissionList="permissionList">
            <template #default="{ open }">
              <n-button type="primary" @click="open">新增</n-button>
            </template>
          </CreateMenuDialog>
        </div>
      </n-card>

      <vxe-grid v-bind="gridOptions">
        <template #enable="{ row, column }">
          <div>
            <n-tag v-if="row[column.field]" type="success">开启</n-tag>
            <n-tag v-else type="error">关闭</n-tag>
          </div>
        </template>

        <template #operation>
          <div class="f-c-c">
            <n-button ghost :size="'tiny'">
              <template #icon>
                <n-icon><Edit></Edit></n-icon>
              </template>
            </n-button>

            <n-divider vertical />

            <n-button type="error" ghost :size="'tiny'">
              <template #icon>
                <n-icon><TrashAlt></TrashAlt></n-icon>
              </template>
            </n-button>
          </div>
        </template>
      </vxe-grid>
    </div>
  </PageCard>
</template>

<script setup lang="ts">
import { VxeGridProps } from 'vxe-table';
import permissionApi from '@/api/permission';
import { PermissionEntity } from '@/api/permission/model';
import day from 'dayjs';
import { Edit, TrashAlt } from '@vicons/fa';
import CreateMenuDialog from './components/createMenuDialog.vue';

const searchForm = ref({
  name: '',
});

interface RowVO extends PermissionEntity {}

const gridOptions = reactive<VxeGridProps<RowVO>>({
  border: true,
  headerAlign: 'center',
  align: 'center',
  autoResize: true,
  treeConfig: {
    transform: true,
    rowField: 'id',
    parentField: 'parentId',
  },
  columns: [
    { field: 'name', title: '菜单名称', treeNode: true, fixed: 'left' },
    { field: 'icon', title: '图标' },
    { field: 'code', title: '权限标识' },
    { field: 'path', title: '路由路径' },
    { field: 'component', title: '组件路径' },
    { field: 'order', title: '排序' },
    { field: 'enable', title: '状态', slots: { default: 'enable' } },
    {
      field: 'updatedOn',
      title: '更新时间',
      width: '180px',
      formatter({ cellValue }) {
        return day(cellValue).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      field: 'operation',
      title: '操作',
      slots: { default: 'operation' },
    },
  ],
  data: [],
});

const permissionList = ref<PermissionEntity[]>([]);

async function getMenuPermission() {
  const res = await permissionApi.getMenuPermission();
  console.log(res);
  permissionList.value = res;

  gridOptions.data = res;
}

// ======== init ==========
getMenuPermission();
</script>

<style scoped></style>
