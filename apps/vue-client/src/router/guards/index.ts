import { Router } from 'vue-router';
import { setupPermissionGuard } from './permission';

export function setupRouterGuards(router: Router) {
  setupPermissionGuard(router);
}
