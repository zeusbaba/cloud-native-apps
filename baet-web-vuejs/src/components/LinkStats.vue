<template>

  <v-card flat class="align-content-center">

    <v-card-text v-if="statsSelectItems.length>0">
      <v-flex xs12 sm6 d-flex>
        <v-select
            :items="statsSelectItems"
            v-model="statsKey"
            @input="updateChart"
            solo
        ></v-select>
      </v-flex>
    </v-card-text>

    <v-card-text>
      <!--
      <feathers-vuex-get
          service="stats"
          :id="linkId"
      >
        <div slot-scope="props" @load="this.linkStats=props.item">
          statsGet: {{props.item}}
        </div>
      </feathers-vuex-get>
      -->
      <feathers-vuex-find
          service="stats"
          :query="{_id: linkId}"
      >
        <div slot-scope="{ items }">
          {{ updateLinkStats(items) }}
        </div>
      </feathers-vuex-find>

    </v-card-text>

    <v-card-text>
      <v-flex d-flex>

        <h3 v-if="statsSelectItems.length===0">
          {{ $t('resources.links.nodata.stats') }}
        </h3>
        <google-chart v-else
            type="PieChart"
            :data="chartData"
            :options="chartOptions"
        />

      </v-flex>
    </v-card-text>

    <v-card-text v-if=isDev>
      linkStats...<br/> {{ linkStats }}
    </v-card-text>

  </v-card>
</template>

<script>
  import { isDev } from '@/app-config';
  import { GChart } from 'vue-google-charts';
  export default {
    name: "LinkStats",
    components: {
      'google-chart': GChart
    },
    props: {
      linkId: String,
    },
    data: () => ({
      isDev: isDev,
      linkStats: {},
      statsKey: 'd_clicks',
      statsData: {},
      statsSelectItems: [],
      chartData: [],
      chartOptions: {
        title: '',
        pieHole: 0.4,
        is3D: true
      },
    }),
    watch: {
      linkStats: function () {
        if (isDev) {
          console.log("watch- linkStats: " + JSON.stringify(this.linkStats))
        }
        if (this.linkStats) {
          this.prepareChartData()
        }
      },
      statsKey: function() {
        this.chartOptions.title = this.$t('resources.links.buttons.stats.options.'+this.statsKey);
      }
    },
    methods: {
      updateChart: function() {
        if (isDev) {
          console.log("updateChart: " + this.statsKey)
        }
        this.chartOptions.title = this.$t('resources.links.buttons.stats.options.'+this.statsKey);
        this.statsData = this.linkStats['stats'][this.statsKey];
        this.chartData = [];
        this.chartData.push([this.statsKey, '']);
        Object.keys(this.statsData).map(key2 => {
          this.chartData.push([key2, this.statsData[key2]]);
          return true;
        });
      },
      updateLinkStats: function(items) {
        items.forEach((item) => {
          if (isDev) {
            console.log("item: " + JSON.stringify(item));
          }
          this.linkStats = item;
        });
      },
      prepareChartData: function() {
        let menuItems = Object.keys(this.linkStats['stats']);
        for (let menuItem of menuItems) {
          let item = {
            value: menuItem,
            text: this.$t('resources.links.buttons.stats.options.'+menuItem)
          };
          this.statsSelectItems.push(item);
        }
        if (this.statsKey===undefined || this.statsKey==='') {
          this.statsKey = menuItems[0];
          //this.statsKey = 'd_clicks';
        }

        this.updateChart();
      },
    },
  }
</script>

<style scoped>

</style>