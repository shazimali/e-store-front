// import canAccess from '@/middleware/canAccess'
// import auth from '@/middleware/auth'
export const routes = [
  { path: '/', redirect: '/dashboard' },
  {
    path: '/',
    component: () => import('@/layouts/default.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/pages/dashboard.vue'),
        
      },
      {
        path: 'users',
        name: 'users',       
        component: () => import('@/pages/users/index.vue'),
      },
      {
        path: 'users/create',
        name: 'users-create',
        component: () => import('@/pages/users/create.vue'),
      },
      {
        path: 'users/:id',
        name: 'users-edit',
        component: () => import('@/pages/users/edit.vue'),
      },
      {
        path: 'roles',
        name: 'roles',
        component: () => import('@/pages/roles/index.vue'),
      },
      {
        path: 'roles/create',
        name: 'roles-create',
        component: () => import('@/pages/roles/create.vue'),
      },
      {
        path: 'roles/:id',
        name: 'roles-edit',
        component: () => import('@/pages/roles/edit.vue'),
      },
      {
        path: 'products',
        name: 'products',
        component: () => import('@/pages/products/index.vue'),
      },
      {
        path: 'products/create',
        name: 'products-create',
        component: () => import('@/pages/products/create.vue'),
      },
      {
        path: 'products/:id',
        name: 'products-edit',
        component: () => import('@/pages/products/edit.vue'),
      },
      {
        path: 'stores',
        name: 'stores',
        component: () => import('@/pages/stores/index.vue'),
      },
      {
        path: 'stores/create',
        name: 'stores-create',
        component: () => import('@/pages/stores/create.vue'),
      },
      {
        path: 'stores/:id',
        name: 'stores-edit',
        component: () => import('@/pages/stores/edit.vue'),
      },
      {
        path: 'branches',
        name: 'branches',
        component: () => import('@/pages/branches/index.vue'),
      },
      {
        path: 'branches/create',
        name: 'branches-create',
        component: () => import('@/pages/branches/create.vue'),
      },
      {
        path: 'branches/:id',
        name: 'branches-edit',
        component: () => import('@/pages/branches/edit.vue'),
      },
      {
        path: 'purchases',
        name: 'purchases',
        component: () => import('@/pages/purchases/index.vue'),
      },
      {
        path: 'purchases/create',
        name: 'purchases-create',
        component: () => import('@/pages/purchases/create.vue'),
      },
      {
        path: 'purchases/:id',
        name: 'purchases-edit',
        component: () => import('@/pages/purchases/edit.vue'),
      },
      {
        path: 'deliverables',
        name: 'deliverables',
        component: () => import('@/pages/deliverables/index.vue'),
      },
      {
        path: 'deliverables/create',
        name: 'deliverables-create',
        component: () => import('@/pages/deliverables/create.vue'),
      },
      {
        path: 'deliverables/:id',
        name: 'deliverables-edit',
        component: () => import('@/pages/deliverables/edit.vue'),
      },
      {
        path: 'return-deliverables',
        name: 'return-deliverables',
        component: () => import('@/pages/return_deliverables/index.vue'),
      },
      {
        path: 'return-deliverables/create',
        name: 'return-deliverables-create',
        component: () => import('@/pages/return_deliverables/create.vue'),
      },
      {
        path: 'return-deliverables/:id',
        name: 'return-deliverables-edit',
        component: () => import('@/pages/return_deliverables/edit.vue'),
      },
      {
        path: 'company',
        name: 'company',
        component: () => import('@/pages/company/index.vue'),
      },
      {
        path: 'account-settings',
        component: () => import('@/pages/account-settings.vue'),
      },
      {
        path: 'typography',
        component: () => import('@/pages/typography.vue'),
      },
      {
        path: 'icons',
        component: () => import('@/pages/icons.vue'),
      },
      {
        path: 'cards',
        component: () => import('@/pages/cards.vue'),
      },
      {
        path: 'tables',
        component: () => import('@/pages/tables.vue'),
      },
      {
        path: 'form-layouts',
        component: () => import('@/pages/form-layouts.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/blank.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        // meta : {
        //   middleware: auth
        // },
        component: () => import('@/pages/login.vue'),
      },
      {
        path: 'register',
        component: () => import('@/pages/register.vue'),
      },
      {
        path: 'print/:id',
        component: () => import('@/pages/print.vue'),
      },
      {
        path: '/:pathMatch(.*)*',
        component: () => import('@/pages/[...error].vue'),
      },
    ],
  },
]
