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
        component: () => import('@/pages/dashboard/index.vue'),
        
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
        path: 'store/dashboard/:id',
        name: 'store-dashboard',
        component: () => import('@/pages/stores/dashboard/index.vue'),
        
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
        path: 'invoices',
        name: 'invoices',
        component: () => import('@/pages/invoices/index.vue'),
      },
      {
        path: 'invoices/create',
        name: 'invoices-create',
        component: () => import('@/pages/invoices/create.vue'),
      },
      {
        path: 'invoices/:id',
        name: 'invoices-edit',
        component: () => import('@/pages/invoices/edit.vue'),
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
        path: 'stocks',
        name: 'stocks',
        component: () => import('@/pages/stocks/index.vue'),
      },
      {
        path: 'vouchers',
        name: 'vouchers',
        component: () => import('@/pages/vouchers/index.vue'),
      },
      {
        path: 'vouchers/create',
        name: 'vouchers-create',
        component: () => import('@/pages/vouchers/create.vue'),
      },
      {
        path: 'vouchers/:id',
        name: 'vouchers-edit',
        component: () => import('@/pages/vouchers/edit.vue'),
      },
      {
        path: 'discounts',
        name: 'discounts',
        component: () => import('@/pages/discounts/index.vue'),
      },
      {
        path: 'discounts/create',
        name: 'discounts-create',
        component: () => import('@/pages/discounts/create.vue'),
      },
      {
        path: 'discounts/:id',
        name: 'discounts-edit',
        component: () => import('@/pages/discounts/edit.vue'),
      },
      {
        path: 'reports/ledgers',
        name: 'reports-ledgers',
        component: () => import('@/pages/reports/ledgers.vue'),
      },
      {
        path: 'reports/profitloss',
        name: 'reports-profitloss',
        component: () => import('@/pages/reports/profit_loss.vue'),
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
        path: 'reports/print',
        component: () => import('@/pages/print.vue'),
      },
      {
        path: '/:pathMatch(.*)*',
        component: () => import('@/pages/[...error].vue'),
      },
    ],
  },
]
