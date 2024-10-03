<template>
  <div class="fff">
    <ArticlesList />
  </div>
</template>

<script>
// @ is an alias to /src
import ArticlesList from '@/components/ArticlesList.vue'

export default {
  name: 'ArticlesView',
  components: {
    ArticlesList
  }
}
</script>
