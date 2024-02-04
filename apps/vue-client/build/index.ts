import { getPagePath } from './genPagePath';

const pluginName = 'gen-page-path';
const virtualModuleId = 'ez:' + pluginName;
const resolvedVirtualModuleId = '\0' + virtualModuleId;

/**
 * @usage 生成view文件下所有vue文件的路径
 */
export function genPagePathPlugin() {
  return {
    name: pluginName,
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export default ${JSON.stringify(getPagePath())}`;
      }
    },
  };
}
