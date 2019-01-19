<template>
  <div>
    linkid is: {{ linkid }}
  </div>
</template>

<script>
  import { isDev } from '@/app-config'; // eslint-disable-line

  export default {
    name: "LinksOne",
    data: () => ({
      linkid: ''
    }),
    mounted: function() {
      this.linkid = this.$route.params.linkid;
    },
    watch: {
      '$route' (to, from) {
        // react to route changes...
        if (isDev) {
          console.log(
              'route changed...' + ' from: ' + from.params.linkid + ' to: ' + to.params.linkid);
        }
        this.linkid = to.params.linkid;
      }
    },
    /*beforeRouteUpdate (to, from, next) {
      // react to route changes...
      // don't forget to call next()
    }*/
  }
</script>

<style scoped>

</style>