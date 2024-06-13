<template>
  <div class="home">
    <v-container>
      <v-layout row wrap class="w-full">
        <v-sheet 
          rounded
          class="mb-4 pa-4 ml-4 mt-8 d-flex"
          width="23.8%"
          height="110px"
          :elevation="0"
        >
          <v-sheet 
            rounded
            class="mb-4 pa-4 ml-4"
            width="fit-content"
            :elevation="1"
            style="position: relative; top: -40px; left: -20px; padding: 10px; height: fit-content; border-radius: 20px;"
            color="#E3F2FD"
          >
            <v-icon size="50" color="blue" style="min-width: 0;">watch</v-icon>
          </v-sheet>
          <v-sheet class="d-flex flex-column align-end" style="width: 100%;">
            <h4>
              Transaction Frequency
            </h4>
            <v-divider class="mb-3" style="width: 100%;"></v-divider>
            <h1>{{ trxFreq }}</h1>
          </v-sheet>
        </v-sheet>
        <v-sheet 
          rounded
          class="mb-4 pa-4 ml-4 mt-8 d-flex"
          width="23.8%"
          height="110px"
          :elevation="0"
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
            <h4>
              Transaction Amount
            </h4>
            <v-divider class="mb-3" style="width: 100%;"></v-divider>
            <h2>Rp. {{ formatPrice(trxTotal) }}</h2>
          </v-sheet>
        </v-sheet>
        <v-sheet 
          rounded
          class="mb-4 pa-4 ml-4 mt-8 d-flex"
          width="23.8%"
          height="110px"
          :elevation="0"
        >
          <v-sheet 
            rounded
            class="mb-4 pa-4 ml-4"
            width="fit-content"
            :elevation="1"
            style="position: relative; top: -40px; left: -20px; padding: 10px; height: fit-content; border-radius: 20px;"
            color="#FFEBEE"
          >
            <v-icon size="50" color="red" style="min-width: 0;">person</v-icon>
          </v-sheet>
          <v-sheet class="d-flex flex-column align-end" style="width: 100%;">
            <h4>
              Number Of Unique Beneficiary
            </h4>
            <v-divider class="mb-3" style="width: 100%;"></v-divider>
            <h1>{{ benef }}</h1>
          </v-sheet>
        </v-sheet>
        <v-sheet 
          rounded
          class="mb-4 pa-4 ml-4 mt-8 d-flex"
          width="23.8%"
          height="110px"
          :elevation="0"
        >
          <v-sheet 
            rounded
            class="mb-4 pa-4 ml-4"
            width="fit-content"
            :elevation="1"
            style="position: relative; top: -40px; left: -20px; padding: 10px; height: fit-content; border-radius: 20px;"
            color="#FFF3E0"
          >
            <v-icon size="50" color="orange" style="min-width: 0;">send</v-icon>
          </v-sheet>
          <v-sheet class="d-flex flex-column align-end" style="width: 100%;">
            <h4>
              Number Of Unique Sender
            </h4>
            <v-divider class="mb-3"></v-divider>
            <h1>{{ sender }}</h1>
          </v-sheet>
        </v-sheet>
        <v-sheet :elevation="0" rounded width="48.5%" height="515px" class="ml-4 mt-4">
          <v-sheet 
            rounded
            class="px-4 ml-4 red--text ml-8"
            :elevation="1"
            style="z-index: 1; margin-bottom: -55px; position: relative; top: -20px; left: -20px; padding: 10px; height: fit-content;"
            color="#FFEBEE"
          >
            <h2 class="font-weight-regular">Fraud Ring</h2>
          </v-sheet>
          <v-list-item style="padding: 0px;">
            <v-card width="100%" height="515px" elevation="0" id="viz"></v-card>
          </v-list-item>
        </v-sheet>
        <v-sheet 
          :elevation="0"
          rounded
          width="48.5%"
          height="515px"
          class="ml-4 mt-4"
        >
          <v-sheet 
            rounded
            class="px-4 ml-4 orange--text ml-8"
            :elevation="1"
            style="z-index: 1; margin-bottom: -55px; position: relative; top: -20px; left: -20px; padding: 10px; height: fit-content;"
            color="#FFF3E0"
          >
            <h2 class="font-weight-regular">Unique Transaction Counterpart</h2>
          </v-sheet>
          <v-list-item style="padding: 0px;">
            <v-card width="100%" height="515px" elevation="0" id="viz2"></v-card>
          </v-list-item>
        </v-sheet>
        <v-sheet :elevation="0" rounded width="98%" height="480px" class="ml-4 mt-8 mb-8">
          <v-sheet 
            rounded
            class="px-4 ml-4 green--text ml-8"
            :elevation="1"
            style="margin-bottom: -10px; position: relative; top: -20px; left: -20px; padding: 10px; height: fit-content;"
            color="#E8F5E9"
          >
            <h2 class="font-weight-regular">Suspicious Transaction</h2>
          </v-sheet>
          <v-list-item>
            <v-list-item-content>
              <v-data-table 
                :items="suspicious"
                :headers="headers2"
                height="330px"
                :loading="loadingSuspiciousTransaction"
              >
                <template v-slot:loading>
                  <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
                </template>
              </v-data-table>
            </v-list-item-content> 
          </v-list-item>
        </v-sheet>
      </v-layout>
    </v-container>
  </div>
</template>
  
<script>
  
  import NeoVis from 'neovis.js'
  export default {
    data: () => ({
      loadingDetectedByRules: false,
      loadingSuspiciousTransaction: false,
      trxFreq: 0,
      trxTotal: 0,
      suspicious: [],
      benef: 0,
      sender: 0,
      headers2: [],
      headers: [
        { text: "Transaction ID", value: "id" },
        { text: "Amount", value: "amount" },
        { text: "Date", value: "created_at" },
      ]
    }),
    mounted() {
      this.handleChangeActiveUser();
      this.renderFraudRing();
      this.renderUniqueTransactionCounterpart();
    },
    methods: {
      formatPrice(value) {
        let val = (value/1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      },
      renderFraudRing() {
        let viz;
        var config = {
          containerId: "viz",
          neo4j: {
            serverUrl: "neo4j://10.125.9.64:7687",
            serverUser: "neo4j",
            serverPassword: "password"
          },
          visConfig: {
            nodes: {
              shape: 'dot',
              font: {
                size: 16,
                face: 'arial',
                strokeWidth: 2,
                multi: false,
              },
            },
          },
          labels: {
            Account: {
              label: "name",
              title: "name",
              value: "firstPartyFraudScore",
              group: "firstPartyFraudGroup"
            }
          },
          relationships: {
            SIMILAR_TO: {
              value: "jaccardScore",
              title: "jaccardScore",
            }
          },
          initialCypher: `MATCH (c0:Account {id:'${this.$route.params.id}'}) CALL apoc.path.expand(c0, "HAS_EMAIL|HAS_SSN|HAS_PHONE", "", 1, 3) YIELD path WITH nodes(path) as c1 UNWIND c1 as c WITH c.firstPartyFraudGroup AS fpGroupID, collect(c.id) AS fGroup WITH *, size(fGroup) AS groupSize WHERE groupSize >= 9 WITH collect(fpGroupID) AS fraudRings MATCH p=(c:Account)-[:SIMILAR_TO]->() WHERE c.firstPartyFraudGroup IN fraudRings RETURN p`,
        }
    
        viz = new NeoVis(config);
        viz.render();
      },
      renderUniqueTransactionCounterpart() {
        let viz2;
        var config = {
          containerId: "viz2",
          neo4j: {
            serverUrl: "neo4j://10.125.9.64:7687",
            serverUser: "neo4j",
            serverPassword: "password"
          },
          visConfig: {
            nodes: {
              shape: 'diamond',
            },
          },
          labels: {
            Account: {
              label: "name",
              title: "name",
              value: "firstPartyFraudScore",
              group: "firstPartyFraudGroup"
            }
          },
          relationships: {
            SIMILAR_TO: {
              value: "jaccardScore",
              title: "jaccardScore",
            }
          },
          initialCypher: `
            MATCH (case:Case)-[:SUSPECTED]->(c:Account)-[r:TRANSFERRED_TO]->(m)
            WHERE c.id = '${this.$route.params.id}'
            RETURN c, r, m
          `,
        }
    
        viz2 = new NeoVis(config);
        viz2.render();
      },
      onButtonClick(item) {
        this.activeUser = item
      },
      handleChangeActiveUser() {
        this.loadingSuspiciousTransaction = true
        fetch('http://10.125.9.64:7474/db/neo4j/tx/commit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('neo4j:password')
          },
          body: JSON.stringify({
            "statements": [
              {
                "statement": `
                  MATCH (case:Case)-[:SUSPECTED]->(c:Account)-[r:PERFORMED]-(t:Transaction)-[r1:TO]-(m)
                  WHERE c.id = '${this.$route.params.id}'
                  MATCH (t)<-[:TRIGGERED]-(f)
                  RETURN t
                `,
                "resultDataContents": ["graph"]
              }
            ]
          })
        })
        .then(response => response.json())
        .then(data => {
          let sum = 0;
          this.trxFreq = data.results[0].data.length
          for (let i = 0; i < data.results[0].data.length; i++) {
            sum += data.results[0].data[i].graph.nodes[0].properties.amount;
          }
          this.trxTotal = sum
        });
        fetch('http://10.125.9.64:7474/db/neo4j/tx/commit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('neo4j:password')
          },
          body: JSON.stringify({
            "statements": [
              {
                "statement": `
                  MATCH (case:Case)-[:SUSPECTED]->(c:Account)-[r:PERFORMED]-(t:Transaction)-[r1:TO]-(m)
                  WHERE c.id = '${this.$route.params.id}'
                  MATCH (t)<-[:TRIGGERED]-(f)
                  RETURN DISTINCT m
                `,
                "resultDataContents": ["graph"]
              }
            ]
          })
        })
        .then(response => response.json())
        .then(data => {
          this.benef = data.results[0].data.length
        });
        fetch('http://10.125.9.64:7474/db/neo4j/tx/commit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('neo4j:password')
          },
          body: JSON.stringify({
            "statements": [
              {
                "statement": `
                  MATCH (case:Case)-[:SUSPECTED]->(c:Account)-[r:PERFORMED]-(t:Transaction)-[r1:TO]-(m)
                  WHERE m.id = '${this.$route.params.id}'
                  MATCH (t)<-[:TRIGGERED]-(f)
                  RETURN DISTINCT c
                `,
                "resultDataContents": ["graph"]
              }
            ]
          })
        })
        .then(response => response.json())
        .then(data => {
          this.sender = data.results[0].data.length
        });
        fetch('http://10.125.9.64:7474/db/neo4j/tx/commit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('neo4j:password')
          },
          body: JSON.stringify({
            "statements": [
              {
                "statement": `
                  MATCH (case:Case)-[:SUSPECTED]->(c:Account)-[r:PERFORMED]-(t:Transaction)-[r1:TO]-(m)
                  WHERE c.id = '${this.$route.params.id}'
                  MATCH (t)<-[trig:TRIGGERED]-(f)
                  RETURN DISTINCT t, f, trig`,
                "resultDataContents": ["graph"]
              }
            ]
          })
        })
        .then(response => response.json())
        .then(data => {
          const nodes = [];
          let nameArray = [];
          data.results[0].data.forEach(result => {
            let ruleId = result.graph.relationships[0].startNode;
            let ruleName = '';
            
            data.results[0].data.forEach(innerItem => {
                innerItem.graph.nodes.forEach(node => {
                    if (node.id === ruleId && node.labels.includes("Rule")) {
                        ruleName = node.properties.name;
                        if (!nameArray.includes(ruleName)) {
                            nameArray.push(ruleName);
                        }
                    }
                });
            });
            nodes.push({
                ...result.graph.nodes[1].properties,
                amount: `Rp. ${this.formatPrice(result.graph.nodes[1].properties.amount)}`,
                [ruleName.toLowerCase()]: true
            });
          });
          this.headers2 = [...this.headers, ...nameArray.map(name => ({ text: name, value: name.toLowerCase() }))];
          this.loadingSuspiciousTransaction = false
          this.suspicious = nodes
        });
      }
    }
  }
</script>
  