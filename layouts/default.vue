<template>
  <div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useAuth } from "@/composables/useAuth";
const { user, ready } = useAuth();
</script>
