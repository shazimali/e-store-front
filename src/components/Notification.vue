<script setup lang="ts">
const props =  defineProps({
    type : { type: String, required: true},
    msg : { type: String, required: true},
    isOpen : {type: Boolean, required: true}
})
</script>
<template>
   toast.error(props.msg)
  </template>
