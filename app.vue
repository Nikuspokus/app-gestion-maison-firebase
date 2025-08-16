
<template>
  <div>
    <NavBar />
    <div class="mx-auto max-w-4xl p-4">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style>
:root { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'; }
.btn { padding: .5rem 1rem; border-radius: .5rem; border: 1px solid #ddd; cursor: pointer; }
.btn-primary { background: #0ea5e9; color: white; border: none; }
.card { border: 1px solid #eee; border-radius: .75rem; padding: 1rem; box-shadow: 0 1px 4px rgba(0,0,0,.05); }
input, select { padding: .5rem; border: 1px solid #ddd; border-radius: .5rem; width: 100%; }
label { font-weight: 600; }
</style>
