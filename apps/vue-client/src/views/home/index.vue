<template>
  <PageCard>
    <div>
      <div v-for="(_, index) in new Array(100).fill(0)" class="text-48">
        home - {{ index }}
      </div>
    </div>
  </PageCard>
</template>

<script setup lang="ts">
import PageCard from '@/components/pageCard/index.vue';
</script>

<style scoped></style>
