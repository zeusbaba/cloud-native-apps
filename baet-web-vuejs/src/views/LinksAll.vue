<template>

  <v-layout justify-center row fill-height>
    <v-flex>

      <v-timeline
          align-top
          light
          dense
        >
        <v-fab-transition>
          <v-btn
              color="indigo"
              dark
              absolute
              top
              right
              fab
              @click="getLinks"
          >
            <v-icon>refresh</v-icon>
          </v-btn>
        </v-fab-transition>

        <v-timeline-item
            v-for="(link, i) in mylinks"
            :key="i"
            color="red lighten-2"
            small
          >
          <span slot="opposite" v-text="link.createdAt"></span>
          <LinkMeta
              :linkData=link
          />
        </v-timeline-item>
      </v-timeline>

    </v-flex>
  </v-layout>

</template>

<style lang="scss" scoped>

</style>

<script>
  // @ is an alias to /src
  import { myConfig, isDev } from '@/app-config'; // eslint-disable-line
  import LinkMeta from '@/components/LinkMeta';

  import feathersClient from '@/feathers-client';
  import { mapActions, mapGetters } from 'vuex';

  export default {
    name: "LinksAll",
    components: {
      LinkMeta
    },
    data: () => ({
      mylinks: []
    }),
    mounted: function() {
      this.getLinks()
    },
    computed: {
      ...mapGetters('links', {links: 'find'})
    },
    methods: {
      //...mapActions('links', ['create', 'remove', 'find']),
      ...mapActions('links', ['get', 'find']),
      getLinks: function() {
        // see https://docs.feathersjs.com/api/databases/querying.html
         /* feathersClient
          .service('links')
          .find({
          */
        this
          .find({
            "query": {
              "$limit": 20,
              "$sort": {
                "createdAt": 1
              }
            }
          })
        .then(result => {
          throw(result)
        })
        .catch(fish => {
          //if (!fish.errors && fish.total && fish.total > 0) {
          if (!fish.errors) {
            if (isDev) {
              console.log(JSON.stringify(fish))
            }
            this.mylinks = fish.data;
          }
          else { // error occured
            console.log('Error... ' + JSON.stringify(fish.errors))
          }
        })
      }
    }
  }
</script>
