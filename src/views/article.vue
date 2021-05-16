<template>
  <div class="markdown-body" v-html="detail" style="width: 1000px; margin: 0 auto"></div>
</template>

<script lang="ts">
import { getDetail, markdown2html } from '@/api';
import { useRoute } from 'vue-router'
import { defineComponent, ref } from 'vue'
import 'github-markdown-css'

export default defineComponent({
  name: 'article-detail',
  setup() {
    const route = useRoute();
    const { issuesNumber } = route.query;
    const detail = ref();
    getDetail(<string>issuesNumber).then(({ data }) => {
      return data;
    }).then(data => {
      return markdown2html(data.body)
    }).then(({ data }) => {
      detail.value = data;
    })
    return {
      detail,
    }
  },
})
</script>

