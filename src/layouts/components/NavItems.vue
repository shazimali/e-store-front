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
  v-if="canAccess('purchase_access') ||  canAccess('purchase_create')"
    :item="{
      title: 'Deliverables',
      icon: 'ri-truck-line',
    }"
  >
    <VerticalNavLink
    v-if="canAccess('purchase_access')"
      :item="{
        title: 'All Deliverables',
        to: '/deliverables',
      }"
    />
    <VerticalNavLink
    v-if="canAccess('purchase_create')"
      :item="{
        title: 'New Deliverable',
        to: '/deliverables/create',
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
