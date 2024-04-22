<script lang="ts" setup>
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue';
import { canAccess } from '@core/utils/helpers';
import VerticalNavGroup from '@layouts/components/VerticalNavGroup.vue';
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue';
</script>

<template>
  <!-- <VerticalNavSectionTitle
    :item="{
      heading: 'Apps & Pages',
    }"
  /> -->
  <VerticalNavGroup
  v-if="canAccess('purchase_access') ||  canAccess('purchase_create')"
    :item="{
      title: 'Purchases',
      icon: 'ri-bank-card-line',
    }"
  >
    <VerticalNavLink
    v-if="canAccess('purchase_access')"
      :item="{
        title: 'All Purchases',
        to: '/purchases',
      }"
    />
    <VerticalNavLink
    v-if="canAccess('purchase_create')"
      :item="{
        title: 'New Purchase',
        to: '/purchases/create',
        badgeClass: 'bg-light-primary text-primary',
      }"
    />
  </VerticalNavGroup>
  <VerticalNavGroup
  v-if="canAccess('deliverable_access') ||  canAccess('deliverable_create')"
    :item="{
      title: 'Deliverables',
      icon: 'ri-truck-line',
    }"
  >
    <VerticalNavLink
    v-if="canAccess('deliverable_access')"
      :item="{
        title: 'All Deliverables',
        to: '/deliverables',
      }"
    />
    <VerticalNavLink
    v-if="canAccess('deliverable_create')"
      :item="{
        title: 'New Deliverable',
        to: '/deliverables/create',
        badgeClass: 'bg-light-primary text-primary',
      }"
    />
  </VerticalNavGroup>
  <VerticalNavGroup
  v-if="canAccess('return_deliverable_access') ||  canAccess('return_deliverable_create')"
    :item="{
      title: 'Return Deliverables',
      icon: 'ri-text-wrap',
    }"
  >
    <VerticalNavLink
    v-if="canAccess('return_deliverable_access')"
      :item="{
        title: 'All Return Deliverables',
        to: '/return-deliverables',
      }"
    />
    <VerticalNavLink
    v-if="canAccess('return_deliverable_create')"
      :item="{
        title: 'New Return Deliverable',
        to: '/return-deliverables/create',
        badgeClass: 'bg-light-primary text-primary',
      }"
    />
  </VerticalNavGroup>
  <VerticalNavGroup
  v-if="canAccess('invoice_access') ||  canAccess('invoice_create')"
    :item="{
      title: 'Invoices',
      icon: 'ri-profile-line',
    }"
  >
    <VerticalNavLink
    v-if="canAccess('invoice_access')"
      :item="{
        title: 'All Invoices',
        to: '/invoices',
      }"
    />
    <VerticalNavLink
    v-if="canAccess('invoice_create')"
      :item="{
        title: 'New Invoice',
        to: '/invoices/create',
        badgeClass: 'bg-light-primary text-primary',
      }"
    />
  </VerticalNavGroup>
  <VerticalNavGroup
  v-if="canAccess('invoice_access') ||  canAccess('invoice_create')"
    :item="{
      title: 'Vouchers',
      icon: 'ri-file-list-3-line',
    }"
  >
    <VerticalNavLink
    v-if="canAccess('invoice_access')"
      :item="{
        title: 'All Vouchers',
        to: '/vouchers',
      }"
    />
    <VerticalNavLink
    v-if="canAccess('invoice_create')"
      :item="{
        title: 'New Voucher',
        to: '/vouchers/create',
        badgeClass: 'bg-light-primary text-primary',
      }"
    />
  </VerticalNavGroup>
  <VerticalNavGroup
  v-if="canAccess('invoice_access') ||  canAccess('invoice_create')"
    :item="{
      title: 'Reports',
      icon: 'ri-file-chart-line',
    }"
  >
    <VerticalNavLink
    v-if="canAccess('invoice_access')"
      :item="{
        title: 'Ledgers',
        to: '/reports/ledgers',
      }"
    />
    <VerticalNavLink
    v-if="canAccess('invoice_create')"
      :item="{
        title: 'Profit & Loss',
        to: '/reports/profitloss',
        badgeClass: 'bg-light-primary text-primary',
      }"
    />
  </VerticalNavGroup>
  <VerticalNavSectionTitle
    :item="{
      heading: 'Utilities',
    }"
  />
  <VerticalNavLink
    v-if="canAccess('product_access')"
    :item="{
      title: 'Products',
      icon: 'ri-layout-4-line',
      to: '/products'
    }"
  />
  <VerticalNavLink
    v-if="canAccess('store_access')"
    :item="{
      title: 'Stores',
      icon: 'ri-article-line',
      to: '/stores'
    }"
  />
  <VerticalNavLink
    v-if="canAccess('store_access')"
    :item="{
      title: 'Branches',
      icon: 'ri-git-merge-line',
      to: '/branches'
    }"
  />
  <VerticalNavLink
    v-if="canAccess('stock_access')"
    :item="{
      title: 'Stocks',
      icon: 'ri-stock-line',
      to: '/stocks'
    }"
  />
  <VerticalNavSectionTitle
    :item="{
      heading: 'Company & Settings',
    }"
  />
  <VerticalNavLink
    v-if="canAccess('role_access')"
    :item="{
      title: 'Company',
      icon: 'ri-building-2-line',
      to: '/company'
    }"
  />
  <VerticalNavSectionTitle
    :item="{
      heading: 'Users & Roles',
    }"
  />

  <VerticalNavLink
    v-if="canAccess('role_access')"
    :item="{
      title: 'Roles',
      icon: 'ri-lock-2-line',
      to: '/roles'
    }"
  />
  <VerticalNavLink
    v-if="canAccess('user_management')"
    :item="{
      title: 'Users',
      icon: 'ri-user-add-line',
      to: '/users',
    }"
  />
</template>
