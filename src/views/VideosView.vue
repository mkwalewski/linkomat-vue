<template>
  <div class="fff">
    <YoutubeVideosList />
  </div>
</template>

<script>
// @ is an alias to /src
import YoutubeVideosList from '@/components/YoutubeVideosList.vue'

export default {
  name: 'VideosView',
  components: {
    YoutubeVideosList
  }
}
</script>
