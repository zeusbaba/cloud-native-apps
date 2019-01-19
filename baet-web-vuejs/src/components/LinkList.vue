<template>
  <v-layout>
    <v-flex>

      <v-timeline
          align-top
          light
          dense
      >
        <transition-group name="list" tag="p">
          <v-timeline-item
              v-for="link in links"
              :key="link['short_link']"
              color="red lighten-2"
              small
          >
            <span slot="opposite" v-text="link.createdAt"></span>
            <LinkMeta
                :linkData=link
                :isSingleItem=isSingleItem
            />
          </v-timeline-item>
        </transition-group>
      </v-timeline>

    </v-flex>
  </v-layout>
</template>

<script>
  import { myConfig, isDev } from '@/app-config'; // eslint-disable-line
  import LinkMeta from '@/components/LinkMeta';

  export default {
    name: "LinkList",
    components: {
      LinkMeta
    },
    data: () => ({
      isDev: isDev,
    }),
    props: {
      links: Array,
      isSingleItem: Boolean
    },
  }
</script>

<style scoped>

</style>