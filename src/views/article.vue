<template>
  <div v-html="detail" style="width: 1000px; margin: 0 auto"></div>
</template>

<script lang="ts">
import { getDetail } from '@/api';
import { useRoute } from 'vue-router'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'article-detail',
  setup() {
    const route = useRoute();
    const { name } = route.query;
    const detail = ref();
    getDetail(<string>name).then(({ data }) => {
      detail.value = data;
    })
    return {
      detail,
    }
  },
})
</script>

