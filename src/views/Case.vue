<template>
  <div class="case">
    <v-container>
      <v-layout row wrap class="w-full">
        <v-sheet 
          :elevation="3"
          rounded
          width="98%"
          height="436px"
          class="ml-4 mt-4"
        >
          <v-sheet 
            rounded
            class="px-4 red--text ml-8"
            :elevation="1"
            style="z-index: 1; margin-bottom: -22px; position: relative; top: -20px; left: -20px; padding: 10px; height: fit-content;"
            color="#FFEBEE"
          >
            <h2 class="font-weight-regular">Detected By Rules</h2>
          </v-sheet>
          <v-list-item>
            <v-list-item-content>
              <v-data-table 
                :items="detectedRules"
                :headers="headers"
                height="330px"
                :loading="loadingDetectedByRules"
              >
                <template v-slot:loading>
                  <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
                </template>
                <template v-slot:item="row">
                  <tr>
                    <td>
                      <v-btn router :to="`/case/${row.item.suspect_id}/${row.item.triggered_date}`" class="text-none mx-2" style="width: auto;" width="60%" text rounded>
                        {{row.item.suspect}}
                      </v-btn>
                    </td>
                    <td>Rp. {{formatPrice(row.item.amount)}}</td>
                    <td>
                      <v-avatar style="border: 2px solid white; margin-right: -15px;" width="34px" height="30px" min-width="30px" v-for="(item, index) in uniqueData(row.item.suspect, 'from')" :key="index">
                        <v-img :alt="item" :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(item)}&background=random`"></v-img>
                      </v-avatar>
                    </td>
                    <td>
                      <v-avatar style="border: 2px solid white; margin-right: -15px;" width="34px" height="30px" min-width="30px" v-for="(item, index) in uniqueData(row.item.suspect, 'to')" :key="index">
                        <v-img :alt="item" :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(item)}&background=random`"></v-img>
                      </v-avatar>
                    </td>
                    <td>
                      <v-chip
                        flat
                        pill=true
                        :color=handleChipColoring(row.item.status)
                        class="white--text"
                      >
                        {{ row.item.status }}
                      </v-chip>
                    </td>
                    <td>{{row.item.triggered_date}}</td>
                    <td width="250px">
                      <v-btn elevation="0" color="#FFFDE7" min-width="36px" class="pa-0" @click="handleEditClick(row.item, 'edit')">
                        <v-icon width="auto" size="large" color="orange">edit</v-icon>
                      </v-btn>
                      <v-btn color="#E1F5FE" elevation="0" class="ml-2 pa-0" min-width="36px" @click="handleEditClick(row.item, 'note')">
                        <v-icon color="blue" size="large">notes</v-icon>
                      </v-btn>
                      <v-dialog
                        v-model="dialog"
                        width="400px"
                        persistent
                      >
                        <v-card style="padding: 20px;">
                          Edit Status
                          <v-select
                            label="Status"
                            :items="statusList"
                            v-model="selectedUser.status"
                            style="margin-top: 16px;"
                          ></v-select>
                          <v-card elevation="0" class="text-right">
                            <v-btn class="ms-auto" @click="handleSubmitEdit(selectedUser.status)" right>
                              Ok
                            </v-btn>
                            <v-btn class="ms-auto" style="margin-left: 20px !important;" @click="dialog = false" right>
                              Cancel
                            </v-btn>
                          </v-card>
                        </v-card>
                      </v-dialog>
                      <v-dialog
                        v-model="dialogNote"
                        width="400px"
                        persistent
                      >
                        <v-card style="padding: 20px;">
                          Add Notes
                          <v-textarea clearable v-model="message" style="margin-top: 16px;" underlined class="w-100" label="Note"></v-textarea>
                          <v-card elevation="0" class="text-right">
                            <v-btn class="ms-auto" @click="handleSubmitNote(message)" right>
                              Ok
                            </v-btn>
                            <v-btn class="ms-auto" style="margin-left: 20px !important;" @click="dialogNote = false" right>
                              Cancel
                            </v-btn>
                          </v-card>
                        </v-card>
                      </v-dialog>
                    </td>
                  </tr>
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
import dayjs from 'dayjs'
export default {
data: () => ({
  dialog: false,
  dialogNote: false,
  message: '',
  detectedRules: [],
  selectedUser: {},
  mappedData: [],
  loadingDetectedByRules: false,
  statusList: [  
    'detected',
    'on progress',
    'fraud',
    'turned down',
    'important'
  ],
  headers: [
    { text: 'Suspect', value: 'suspect' },
    { text: 'Transaction Amount', value: 'amount' },
    { text: 'Sources' },
    { text: 'Beneficiaries' },
    { text: 'Status' },  
    { text: 'Triggered Date', value: 'to' },
    { text: 'Action', value: 'to' },
  ],
}),
mounted() {
  this.getTableData()
},
methods: {
  formatPrice(value) {
    let val = (value/1).toFixed(2).replace('.', ',')
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  },
  getTableData() {
    this.loadingDetectedByRules = true
    fetch('http://10.125.9.64:7474/db/neo4j/tx/commit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa('neo4j:password')
      },
      body: JSON.stringify({
        "statements": [{
          "statement": "MATCH (cs:Case)-[sus:SUSPECTED]->(c:Account)-[p:PERFORMED]->(t:Transaction)<-[trig:TRIGGERED]-(r:Rule) WITH t, r, c, p, trig, sus, cs MATCH (t:Transaction)-[to:TO]->(m:Account) WITH t, r, c, m, p, trig, to, sus, cs RETURN t, r, c, m, cs, p, trig, to, sus",
          "resultDataContents": ["graph"]
        }]
      })
    })
    .then(response => response.json())
    .then(data => {
      const nodes = [];
      const edges = [];
      data.results[0].data.forEach(result => {
        result.graph.nodes.forEach(node => {
          const existingNode = nodes.find(item => item.id === node.id);
          if (!existingNode) {
            nodes.push({
              id: node.id,
              printed_id: node.properties.id || null,
              label: node.properties.name || node.labels.join(', '),
              shape: "diamond",
              transaction_date: node.properties.value_date || null,
              amount: node.properties.amount || null,
              case_id: node.properties.case_id || null,
              case_created_date: node.properties.case_created_date || null,
              case_updated_date: node.properties.case_updated_date || null,
              case_status: node.properties.status || null,
            });
          }
        });
        result.graph.relationships.forEach(relationship => {
          edges.push({
            from: relationship.startNode,
            to: relationship.endNode,
            label: relationship.type,
            value: relationship.properties.jaccardScore || 1,
            type: relationship.properties.type
          });
        });
      });
      const fromClient = [];
      const toClient = [];
      const caseNode = [];
      const transactionNode = [];
      edges.forEach(transaction => {
        if(transaction.label === 'PERFORMED') {
          const foundClient = nodes.find(client => client.id === transaction.from);
          if (foundClient) {
            fromClient.push(foundClient);
          }
        }
        if(transaction.label === 'TO') {
          const foundClient = nodes.find(client => client.id === transaction.to);
          const transactionFound = nodes.find(node => node.id === transaction.from);
          if (foundClient) {
            toClient.push(foundClient);
          }
          if (transactionFound) {
            transactionNode.push(transactionFound);
          }
        }
        if(transaction.label === 'SUSPECTED') {
          const foundClient = nodes.find(client => client.id === transaction.from)
          if (foundClient) {
            caseNode.push(foundClient);
          }
        }
      });
      for (let i = 0; i < toClient.length; i++) {
        this.mappedData.push({
          cus_id: fromClient[i].printed_id,
          from: fromClient[i].label,
          trx_id: transactionNode[i].printed_id,
          amount: transactionNode[i].amount || 0,
          date: transactionNode[i].transaction_date,
          to: toClient[i].label,
          case_id: caseNode[i].case_id,
          case_status: caseNode[i].case_status,
          case_created_date: caseNode[i].case_created_date,
          case_updated_date: caseNode[i].case_updated_date,
        });
      }
      const transformedData = this.mappedData.reduce((acc, item) => {
        const existingCase = acc.find(entry => entry.case_id === item.case_id);
        if (existingCase) {
          existingCase.amount += item.amount;
          existingCase.trx_ids.push(item.trx_id);
          existingCase.beneficiary.push(item.to);
          existingCase.sources.push(item.from);
        } else {
          acc.push({
            case_id: item.case_id,
            amount: item.amount,
            suspect: item.from,
            suspect_id: item.cus_id,
            beneficiary: [item.to],
            sources: [item.from],
            trx_ids: [item.trx_id],
            status: item.case_status,
            triggered_date: item.case_created_date
          });
        }
        return acc;
      }, []);
      this.loadingDetectedByRules = false
      this.detectedRules = transformedData;
    });
  },
  handleChipColoring(string) {
    switch (string) {
      case 'detected':
        return 'orange'
      case 'on progress':
        return 'green'
      case 'fraud':
        return 'red'
      case 'important':
        return 'blue'
    }
  },
  handleEditClick(user, type) {
    this.selectedUser = user
    switch (type) {
      case 'edit':
        this.dialog = true
        break;
      case 'note':
        this.dialogNote = true
        break;
    }
  },
  uniqueData(data, type) {
    let uniqueData = null
    switch (type) {
      case 'to':
        uniqueData = this.mappedData.filter(transaction => transaction.from === data).map(transaction => transaction.to);
        break;
      case 'from':
        uniqueData = this.mappedData.filter(transaction => transaction.to === data).map(transaction => transaction.from);
        break;
    } 
    const uniqueSet = new Set(uniqueData);
    return Array.from(uniqueSet);
  },
  handleSubmitEdit(status) {
    this.dialog = false
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
              MATCH (case:Case)
              WHERE case.case_id = '${this.selectedUser.case_id}'
              SET case.status = '${status}'
              MERGE (case)-[:HAS]->(notes:CaseNote {message: 'Status changed into ${status}.', date: '${dayjs().format('YYYY-MM-DD')}'})
            `,
            "resultDataContents": ["graph"]
          }
        ]
      })
    })
  },
  handleSubmitNote(message) {
    this.dialogNote = false
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
              MATCH (case:Case)
              WHERE case.case_id = '${this.selectedUser.case_id}'
              MERGE (case)-[:HAS]->(notes:CaseNote {message: '${message}', date: '${dayjs().format('YYYY-MM-DD')}'})
            `,
            "resultDataContents": ["graph"]
          }
        ]
      })
    })
    this.message = ''
  },
}
}
</script>
