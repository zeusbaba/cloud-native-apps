<template>

  <v-layout justify-center row fill-height>
    <v-flex>

      <v-fab-transition>
        <v-btn
            color="blue-grey"
            dark small
            right absolute
            fab
            @click="linkid?$router.push({path: '/links'}) : startReload()"
        >
          <!-- v-if="linkid" -->
          <!-- <v-icon medium>list</v-icon> -->
          <v-icon v-if="linkid" medium>list</v-icon>
          <v-icon v-else medium>refresh</v-icon>

        </v-btn>
      </v-fab-transition>

      <feathers-vuex-find
          service="links"
          :query="feathersQuery"
          watch="query"
      >
        <!-- :query-when="shouldReload" -->

        <div slot-scope="{ items }">

          <!--
        <div slot-scope="{ items, isFindPending }">
          <span v-if="isDev">
            {{ isFindPending + ' | ' + items.length }}
          </span>
          {{ isFindPending?'':stopReload() }}
          -->

          <h3 v-if="items.length === 0">
            {{ $t('resources.links.nodata.links') }}
          </h3>
          <LinkList v-else
              :links=items
              :isSingleItem="isSingleItem"
          />
        </div>
      </feathers-vuex-find>

    </v-flex>
  </v-layout>

</template>

<style lang="scss" scoped>

  .list-enter-active, .list-leave-active {
    transition: all 1s;
  }
  .list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: translateY(30px);
  }
</style>

<script>
  // @ is an alias to /src
  import { myConfig, isDev } from '@/app-config'; // eslint-disable-line
  //import LinkMeta from '@/components/LinkMeta';
  import LinkList from '@/components/LinkList';

  export default {
    name: "LinksAll",
    components: {
      //LinkMeta,
      LinkList
    },
    data: () => ({
      isDev: isDev,
      linkid: '',
      shouldReload: true
    }),
    computed: {
      feathersQuery () {
        return this.linkid?
            { _id: this.linkid }
            : { $sort: {createdAt: -1} };
      },
      isSingleItem () {
        return this.linkid!=undefined && this.linkid!='';
      }
    },
    methods: {
      // FIXME: implement reload mechanism!!!
      startReload: function() {
        this.shouldReload = true;
      },
      stopReload: function() {
        this.shouldReload = false;
      },
      /*setReload: function (isPending) {
        if (!isPending) {
          this.shouldReload = !this.shouldReload;
          console.log('this.shouldReload: ' + this.shouldReload);
        }
      },*/
    },
    beforeRouteUpdate (to, from, next) {
      // react to route changes...
      if (isDev) {
        console.log(
            'route changed...' + ' from: ' + from.params.linkid + ' to: ' + to.params.linkid);
      }
      this.linkid = to.params.linkid;

      next()
    },
    mounted: function() {
      this.linkid = this.$route.params.linkid;
    },
  }
</script>
