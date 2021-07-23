<template>
  <article class="card">
    <div>
      <div>{{ article.time }}</div>
      <h1>{{ article.title }}</h1>
    </div>
    <div
      class="markdown-body"
      style="width: 100%"
      v-html="article.body"
    />
  </article>
</template>

<script lang="ts">
import { getDetail, markdown2html } from '@/api';
import { useRoute } from 'vue-router'
import { defineComponent, ref } from 'vue'
import { formatTime } from '@/utils/tools';
import 'github-markdown-css'

export default defineComponent({
  name: 'ArticleDetail',
  setup() {
    const route = useRoute();
    const { issuesNumber } = route.query;
    const article = ref({});
    getDetail(issuesNumber as string).then(({ data }) => {
      return data;
    }).then(data => {
      const { body, title, updated_at: time } = data;
      article.value = {
        title,
        time: formatTime(time),
      }
      return markdown2html(body)
    }).then(({ data }) => {
      article.value = {
        ...article.value,
        body: data,
      }
    })
    return {
      article,
    }
  },
})
</script>

