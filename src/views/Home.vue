<template>
  <div class="home">
    <v-container>
      <v-layout row wrap class="w-full">
        <v-sheet width="100%" class="mb-4 d-flex" style="background: lightblue;">
          <v-hover
            v-slot="{ hover }"
          >
            <v-sheet 
              rounded
              class="mb-4 ml-4 pa-4 mt-8 d-flex"
              height="110px"
              width="23.8%"
              :elevation="hover ? 1 : 3"
            >
              <v-sheet 
                rounded="xl"
                class="mb-4 pa-4 ml-4"
                width="fit-content"
                :elevation="1"
                style="position: relative; top: -40px; left: -20px; padding: 10px; height: fit-content; border-radius: 20px;"
                color="#FFF3E0"
              >
                <v-icon size="50" color="orange" style="min-width: 0;">work</v-icon>
              </v-sheet>
              <v-sheet class="d-flex flex-column align-end" style="width: 100%;">
                <h4>Total Case</h4>
                <v-divider class="mb-3" style="width: 100%;"></v-divider>
                <h1>{{ caseNodes.length }}</h1>
              </v-sheet>
            </v-sheet>
          </v-hover>
          <v-hover
            v-slot="{ hover }"
          >
            <v-sheet 
              rounded
              class="mb-4 pa-4 ml-4 mt-8 d-flex"
              width="23.8%"
              height="110px"
              :elevation="hover ? 1 : 3"
            >
              <v-sheet 
                rounded
                class="mb-4 pa-4 ml-4"
                width="fit-content"
                :elevation="1"
                style="position: relative; top: -40px; left: -20px; padding: 10px; height: fit-content; border-radius: 20px;"
                color="#FFEBEE"
              >
                <v-icon size="50" color="red" style="min-width: 0;">work</v-icon>
              </v-sheet>
              <v-sheet class="d-flex flex-column align-end" style="width: 100%;">
                <h4>Open Case</h4>
                <v-divider class="mb-3" style="width: 100%;"></v-divider>
                <h1>{{ caseNodes.filter((v) => (v.status === 'detected' || v.status === 'on progress' || v.status === 'important')).length }}</h1>
              </v-sheet>
            </v-sheet>
          </v-hover>
          <v-hover
            v-slot="{ hover }"
          >
            <v-sheet 
              rounded
              class="mb-4 pa-4 ml-4 mt-8 d-flex"
              width="23.8%"
              height="110px"
              :elevation="hover ? 1 : 3"
            >
              <v-sheet 
                rounded
                class="mb-4 pa-4 ml-4"
                width="fit-content"
                :elevation="1"
                style="position: relative; top: -40px; left: -20px; padding: 10px; height: fit-content; border-radius: 20px;"
                color="#E3F2FD"
              >
                <v-icon size="50" color="blue" style="min-width: 0;">receipt</v-icon>
              </v-sheet>
              <v-sheet class="d-flex flex-column align-end" style="width: 100%;">
                <h4>Total Transaction</h4>
                <v-divider class="mb-3" style="width: 100%;"></v-divider>
                <h1>{{ totalTrx.length }}</h1>
              </v-sheet>
            </v-sheet>
          </v-hover>
          <v-hover
            v-slot="{ hover }"
          >
            <v-sheet 
              rounded
              class="mb-4 pa-4 ml-4 mt-8 d-flex"
              width="23.8%"
              height="110px"
              :elevation="hover ? 1 : 3"
            >
              <v-sheet 
                rounded
                class="mb-4 pa-4 ml-4"
                width="fit-content"
                :elevation="1"
                style="position: relative; top: -40px; left: -20px; padding: 10px; height: fit-content; border-radius: 20px;"
                color="#E8F5E9"
              >
                <v-icon size="50" color="green" style="min-width: 0;">money</v-icon>
              </v-sheet>
              <v-sheet class="d-flex flex-column align-end" style="width: 100%;">
                <h4>Total Amount</h4>
                <v-divider class="mb-3" style="width: 100%;"></v-divider>
                <h2>Rp. {{ formatPrice(totalAmount) }}</h2>
              </v-sheet>
            </v-sheet>
          </v-hover>
        </v-sheet>
        <v-sheet :elevation="0" rounded width="48.5%" height="515px" class="ml-4 mb-4">
          <v-sheet 
            rounded
            class="px-4 ml-4 orange--text ml-8"
            :elevation="1"
            style="margin-bottom: -10px; position: relative; top: -20px; left: -20px; padding: 10px; height: fit-content;"
            color="#FFF3E0"
          >
            <h2 class="font-weight-regular">Transaction Flag Chart</h2>
          </v-sheet>
          <v-list-item>
            <v-list-item-content>
              <div id="app">
                <bar-chart :dataList=this.flagTotal :headers=this.flagList></bar-chart>
              </div>
            </v-list-item-content> 
          </v-list-item>
        </v-sheet>
        <v-sheet :elevation="0" rounded width="48.5%" height="515px" class="ml-4 mb-4">
          <v-sheet 
            rounded
            class="px-4 ml-4 green--text ml-8"
            :elevation="1"
            style="margin-bottom: -20px; position: relative; top: -20px; left: -20px; padding: 10px; height: fit-content;"
            color="#E8F5E9"
          >
            <h2 class="font-weight-regular">Status Pie Chart</h2>
          </v-sheet>
          <v-list-item>
            <v-list-item-content>
              <div id="app">
                <bar-chart :dataList=this.statusTotal :colors="['#FFA500', '#008000', '#FF0000', '#909090', '#0000FF']" :horizontal="true" :headers=this.statusList></bar-chart>
              </div>
            </v-list-item-content> 
          </v-list-item>
        </v-sheet>
        <v-sheet 
          :elevation="3"
          rounded
          width="48.5%"
          height="515px"
          class="ml-4 mt-4"
        >
          <v-sheet 
            rounded
            class="px-4 ml-4 red--text ml-8"
            :elevation="1"
            style="margin-bottom: -10px; position: relative; top: -20px; left: -20px; padding: 10px; height: fit-content;"
            color="#FFEBEE"
          >
            <h2 class="font-weight-regular">Fraud vs Turned Down</h2>
          </v-sheet>
          <v-list-item>
            <v-list-item-content>
              <div id="app">
                <pie-chart :dataList=this.fraudVsTurnedDown :colors="['#FF0000', '#909090']" :headers=this.fraudVsTurnedDownHeaders></pie-chart>
              </div>
            </v-list-item-content> 
          </v-list-item>
        </v-sheet>
      </v-layout>
    </v-container>
  </div>
</template>

<script>

import BarChart from '../components/BarChart.vue';
import PieChart from '../components/PieChart.vue';
export default {
  components: {
    PieChart,
    BarChart
  },
  data: () => ({
    picker: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    caseNodes: [],
    totalTrx: [],
    monthlyStatus: [],
    data: [],
    statusList: [  
      'Detected',
      'On Progress',
      'Fraud',
      'Turned Down',
      'Important'
    ],
    flagList: [],
    flagTotal: [],
    statusTotal: [],
    fraudVsTurnedDownHeaders: ['Fraud', 'Turned Down'],
    fraudVsTurnedDown: []
  }),
  mounted() {
    this.getData()
  },
  computed: {
    totalAmount() {
      return this.totalTrx.reduce((total, transaction) => {
        return total + (transaction.amount || 0);
      }, 0);
    }
  },
  methods: {
    formatPrice(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    getData() {
      fetch('http://10.125.9.64:7474/db/neo4j/tx/commit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('neo4j:password')
        },
        body: JSON.stringify({
          "statements": [{
            "statement": "MATCH (c:Case) RETURN c",
            "resultDataContents": ["graph"]
          }]
        })
      })
      .then(response => response.json())
      .then(data => {
        const nodes = []
        data.results[0].data.forEach(result => {
          result.graph.nodes.forEach(node => {
            if (!nodes.find(item => item.case_id === node.id)) {
              nodes.push({
                case_id: node.properties.case_id,
                case_created_date: node.properties.case_created_date,
                case_updated_date: node.properties.case_updated_date,
                status: node.properties.status,
              });
            }
          });
        });
        this.caseNodes = nodes
        this.statusTotal = [
          nodes.filter((v) => (v.status === 'detected'))?.length,
          nodes.filter((v) => (v.status === 'on progress'))?.length,
          nodes.filter((v) => (v.status === 'fraud'))?.length,
          nodes.filter((v) => (v.status === 'turned down'))?.length,
          nodes.filter((v) => (v.status === 'important'))?.length
        ]
        this.fraudVsTurnedDown = [
          nodes.filter((v) => (v.status === 'fraud'))?.length,
          nodes.filter((v) => (v.status === 'turned down'))?.length,
        ]
      })
      fetch('http://10.125.9.64:7474/db/neo4j/tx/commit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('neo4j:password')
        },
        body: JSON.stringify({
          "statements": [{
            "statement": `
              MATCH (case)-[:SUSPECTED]->(c)-[:PERFORMED]->(n:Transaction)<-[:TRIGGERED]-(r:Rule) 
              MATCH (n)-[:TO]->(client:Account) 
              RETURN r
            `,
            "resultDataContents": ["graph"]
          }]
        })
      })
      .then(response => response.json())
      .then(data => {
        const nodes = []
        data.results[0].data.forEach(result => {
          result.graph.nodes.forEach(node => {
            if (!nodes.find(item => item.id === node.id)) {
              nodes.push({
                id: node.properties.id,
                name: node.properties.name,
              });
            }
          });
        });
        const counts = {}
        nodes.forEach(function (x) { counts[x.name] = (counts[x.name] || 0) + 1; });
        this.flagTotal = Object.values(counts)
        this.flagList = Object.keys(counts)
      })
      fetch('http://10.125.9.64:7474/db/neo4j/tx/commit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('neo4j:password')
        },
        body: JSON.stringify({
          "statements": [{
            "statement": `
              MATCH (case)-[:SUSPECTED]->(c)-[:PERFORMED]->(n:Transaction)<-[:TRIGGERED]-(r:Rule) 
              MATCH (n)-[:TO]->(client:Account) 
              RETURN n
            `,
            "resultDataContents": ["graph"]
          }]
        })
      })
      .then(response => response.json())
      .then(data => {
        const nodes = []
        data.results[0].data.forEach(result => {
          result.graph.nodes.forEach(node => {
            if (!nodes.find(item => item.id === node.id)) {
              nodes.push({
                id: node.properties.id,
                amount: node.properties.amount
              });
            }
          });
        });
        this.totalTrx = nodes
      })
    }
  }
}
</script>
