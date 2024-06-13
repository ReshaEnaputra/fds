<template>
  <div class="rule">
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
            class="px-4 blue--text ml-8"
            :elevation="1"
            style="z-index: 1; margin-bottom: -22px; position: relative; top: -20px; left: -20px; padding: 10px; height: fit-content;"
            color="#E3F2FD"
          >
            <h2 class="font-weight-regular">Rules</h2>
          </v-sheet>
          <v-row no-gutters>
            <div 
              v-for="rule in rules" 
              :key="rule.id"
              style="width: 48%;"
            >
              <v-sheet
                :elevation="0"
                class="mt-4 ml-4 pa-4"
                style="border: lightblue 0.5px dotted; border-radius: 20px;"
                rounded="xl"
              >
                <h3>{{ rule.rule_name }}</h3>
                <div class="d-flex mt-2">
                  <v-img
                    :src="require('../assets/credit-card.png')"
                    max-width="70px"
                    height="50px"
                  ></v-img>
                  <div class="ml-4">
                    <h3 style="text-overflow: ellipsis; max-width: 420px; width: 420px; overflow: hidden; white-space: nowrap;">{{ rule.match }}</h3>
                    Score weight {{ rule.weight }}
                  </div>
                  <v-btn elevation="0" color="#E1F5FE" min-width="36px" @click="handleEditClick(rule, 'edit')" class="pa-0 ml-4">
                    <v-icon width="auto" size="large" color="blue">edit</v-icon>
                  </v-btn>
                  <v-btn elevation="0" v-if="rule.status === 'active'" @click="handleSubmitDelete(rule)" color="#FFEBEE" min-width="127px" class="pa-4 ml-4 red--text">
                    Deactivate
                  </v-btn>
                  <v-btn elevation="0" v-if="rule.status !== 'active'" @click="handleActivate(rule)" color="#E8F5E9" min-width="127px" class="pa-4 ml-4 green--text">
                    Activate
                  </v-btn>
                </div>
              </v-sheet>
            </div>
            <v-sheet
              :elevation="0"
              class="mt-4 ml-4 pa-4 d-flex"
              style="border: blue 0.5px dotted; border-radius: 20px; background-color: #E3F2FD; align-items: center; justify-content: space-between;"
              rounded="xl"
              width="47%"
              height="122.16px"
            >
              <div>
                <h3>Important note</h3>
                Please carefully read Product Terms before adding new rule
              </div>
              <v-btn elevation="0" class="ml-4 mr-4" min-width="127px" @click="handleEditClick({}, 'add')" style="background-color: royalblue; color: #E3F2FD;">
                Add Rule
              </v-btn>
            </v-sheet>
          </v-row>
        </v-sheet>
        <v-dialog
          v-model="dialogEdit"
          width="500px"
          persistent
        >
          <v-card style="padding: 20px;">
            <div v-if="selectedRule.id">
              Edit Rule
            </div>
            <div v-else>
              Add Rule
            </div>
            <v-card elevation="0" class="text-right mt-2">
              <v-text-field underlined v-model="selectedRule.rule_name" class="w-100" label="Name"></v-text-field>
              <v-text-field underlined v-model="selectedRule.name" class="w-100" label="Connector Name"></v-text-field>
              <v-textarea :spellcheck="false" clearable v-model="selectedRule.match" underlined class="w-100" label="Match"></v-textarea>
              <v-textarea :spellcheck="false" clearable v-model="selectedRule.condition" underlined class="w-100" label="Condition"></v-textarea>
              <v-select
                label="Category"
                class="w-100" 
                underlined
                v-model="selectedRule.category" 
                :items="topics"
              ></v-select>
              <v-textarea :spellcheck="false" clearable v-model="selectedRule.description" underlined class="w-100" label="Description"></v-textarea>
              <v-text-field underlined v-model="selectedRule.weight" class="w-100" label="Weights"></v-text-field>
              <v-btn class="ms-auto" v-if="selectedRule.id" right @click="handleSubmitEdit('edit')">
                Ok
              </v-btn>
              <v-btn v-else class="ms-auto" right @click="handleSubmitEdit('add')">
                Ok
              </v-btn>
              <v-btn class="ms-auto" style="margin-left: 15px !important;" right @click="handleCloseEdit()">
                Cancel
              </v-btn>
            </v-card>
          </v-card>
        </v-dialog>
      </v-layout>
    </v-container>
  </div>
</template>

<script>

export default {
data: () => ({
  dialogEdit: false,
  rules: [],
  mappedData: [],
  selectedRule: {},
  loadingRules: false,
  sinkName: '',
  topics: []
}),
mounted() {
  this.getTableData()
},
methods: {
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
          "statement": "MATCH (r:Rule) RETURN r",
          "resultDataContents": ["graph"]
        }]
      })
    })
    .then(response => response.json())
    .then(data => {
      const nodes = [];
      data.results[0].data.forEach(result => {
        result.graph.nodes.forEach(node => {
          nodes.push({
            id: node.id,
            category: node.properties.category || null,
            name: node.properties.name || null,
            rule: node.properties.rule || 1,
            status: node.properties.status || null,
            weight: node.properties.weight || null,
            rule_name: node.properties.rule_name || null,
            description: node.properties.description || null,
            match: node.properties.match || null,
            condition: node.properties.condition || null
          });
        });
      });
      this.loadingRules = false
      this.rules = nodes;
    });
    fetch('http://10.125.9.64:7474/db/neo4j/tx/commit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa('neo4j:password')
      },
      body: JSON.stringify({
        "statements": [{
          "statement": "MATCH (r:Category) RETURN r",
          "resultDataContents": ["graph"]
        }]
      })
    })
    .then(response => response.json())
    .then(data => {
      const cateogoryNodes = [];
      data.results[0].data.forEach(result => {
        result.graph.nodes.forEach(node => {
          cateogoryNodes.push(
            node.properties.name
          );
        });
      });
      this.topics = cateogoryNodes;
    });
  },
  handleCloseEdit() {
    this.dialogEdit = false
    this.selectedRule = {}
  },
  handleEditClick(rule, type) {
    switch (type) {
      case 'edit':
        this.dialogEdit = true
        this.selectedRule = rule
        this.sinkName = rule.name
        break;
      case 'add':
        this.dialogEdit = true
        break;
    }
  },
  handleSubmitEdit(type) {
    if(this.selectedRule.status === 'active' && type === 'edit') {
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
                MATCH (rule:Rule)
                WHERE ID(rule) = ${parseInt(this.selectedRule.id)}
                SET rule.match = '${this.selectedRule.match}', rule.condition = '${this.selectedRule.condition}', rule.parameter_value = '${this.selectedRule.parameter_value}', rule.parameter_name = '${this.selectedRule.parameter_name}', rule.description = '${this.selectedRule.description}', rule.rule_name = '${this.selectedRule.rule_name}', rule.name = '${this.selectedRule.name}', rule.category = '${this.selectedRule.category}', rule.weight = '${this.selectedRule.weight}'
              `,
              "resultDataContents": ["graph"]
            }
          ]
        })
      })
      fetch('http://localhost:8082/del-rule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "name": `${this.sinkName}`,
        })
      }).then(() => {
        fetch('http://localhost:8082/add-rule', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "name": this.selectedRule.name,
            "id": this.selectedRule.id,
            "match": this.selectedRule.match,
            "parameter_value": this.selectedRule.parameter_value,
            "condition": this.selectedRule.condition,
            "category": this.selectedRule.category
          })
        });
      });
    } else if (type === 'add') {
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
                CREATE (rule:Rule)
                SET rule.match = '${this.selectedRule.match}', rule.condition = '${this.selectedRule.condition}', rule.parameter_value = '${this.selectedRule.parameter_value}', rule.parameter_name = '${this.selectedRule.parameter_name}', rule.description = '${this.selectedRule.description}', rule.rule_name = '${this.selectedRule.rule_name}', rule.name = '${this.selectedRule.name}', rule.category = '${this.selectedRule.category}', rule.weight = '${this.selectedRule.weight}', rule.status = 'active'
              `,
              "resultDataContents": ["graph"]
            }
          ]
        })
      })
      fetch('http://localhost:8082/add-rule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "name": this.selectedRule.name,
          "match": this.selectedRule.match,
          "parameter_value": this.selectedRule.parameter_value,
          "condition": this.selectedRule.condition,
          "id": this.selectedRule.id,
          "category": this.selectedRule.category
        })
      });
      window.location.reload();
    }
    this.dialogEdit = false
  },
  handleSubmitDelete(rule) {
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
              MATCH (rule:Rule)
              WHERE ID(rule) = ${parseInt(rule.id)}
              SET rule.status = 'inactive'
            `,
            "resultDataContents": ["graph"]
          }
        ]
      })
    })
    fetch('http://localhost:8082/del-rule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "name": `${rule.name}`,
      })
    })
    rule.status = 'inactive'
  },
  handleActivate(rule) {
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
              MATCH (rule:Rule)
              WHERE ID(rule) = ${parseInt(rule.id)}
              SET rule.status = 'active'
            `,
            "resultDataContents": ["graph"]
          }
        ]
      })
    })
    fetch('http://localhost:8082/add-rule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "name": rule.name,
        "id": rule.id,
        "match": rule.match,
        "parameter_value": rule.parameter_value,
        "condition": rule.condition,
        "category": rule.category,

      })
    })
    rule.status = 'active'
  },
}
}
</script>
