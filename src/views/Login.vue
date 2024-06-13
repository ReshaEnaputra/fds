<template>
  <div class="parameter">
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
            <h2 class="font-weight-regular">Parameters</h2>
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
                <div class="d-flex">
                  <h3>{{ rule.rule_name }}</h3>
                  <v-chip color="green" small style="color: white; margin-left: 10px;" variant="flat" v-if="rule.status === 'active'">
                    {{ rule.status }}
                  </v-chip>
                  <v-chip color="red" small style="color: white; margin-left: 10px;" variant="flat" v-else>
                    {{ rule.status }}
                  </v-chip>
                </div>
                <div class="d-flex mt-2" style="justify-content: space-between;">
                  <div class="d-flex">
                      <v-img
                        :src="require('../assets/credit-card.png')"
                        max-width="70px"
                        height="50px"
                      ></v-img>
                      <div class="ml-4">
                        <h3 style="text-overflow: ellipsis; max-width: 500px; width: 500px; overflow: hidden; white-space: nowrap;">{{ rule.description }}</h3>
                        Score weight {{ rule.weight }}
                      </div>
                  </div>
                  <v-btn elevation="0" color="#E1F5FE" min-width="36px" @click="handleEditClick(rule, 'edit')" class="pa-0 mr-4">
                    <v-icon width="auto" size="large" color="blue">edit</v-icon>
                  </v-btn>
                </div>
              </v-sheet>
            </div>
          </v-row>
        </v-sheet>
        <v-dialog
          v-model="dialogEdit"
          width="500px"
          persistent
        >
          <v-card style="padding: 20px;">
            <div>
              Edit Parameter
            </div>
            <v-card elevation="0" class="text-right mt-2">
              <v-text-field underlined v-model="selectedRule.rule_name" class="w-100" label="Name" disabled ></v-text-field>
              <v-textarea :spellcheck="false" clearable v-model="selectedRule.description" underlined class="w-100" label="Description"></v-textarea>
              <div v-for="(value, index) in this.extractedParams" :key="index">
                <v-text-field v-model="selectedRule[`${value}`]" underlined class="w-100" :label="value"></v-text-field>
              </div>
              <v-btn class="ms-auto" v-if="selectedRule.id" right @click="handleSubmitEdit('edit')">
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
  topics: [],
  extractedParams: []
}),
mounted() {
  this.getTableData()
},
methods: {
  extractParamValue(cypherQuery) {
    if (!cypherQuery) return null;

    const matches = cypherQuery.match(/param\.\w+/g);
    if (!matches) return null;

    const values = matches.map(match => match.substring('param.'.length));
    return values;
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
            ...node.properties,
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
        this.extractedParams = this.extractParamValue(rule.condition)
        break;
      case 'add':
        this.dialogEdit = true
        break;
    }
  },
  handleSubmitEdit(type) {
    const setClauses = Object.entries(this.selectedRule)
      .filter(([key]) => key !== 'id') // Exclude the 'id' property
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `rule.${key} = '${value}'`;
        } else {
          return `rule.${key} = ${value}`;
        }
      })
      .join(', ');
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
                SET ${setClauses}
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
      const setClauses = Object.entries(this.selectedRule)
        .filter(([key]) => key !== 'id') // Exclude the 'id' property
        .map(([key, value]) => {
          if (typeof value === 'string') {
            return `rule.${key} = '${value}'`;
          } else {
            return `rule.${key} = ${value}`;
          }
        })
        .join(', ');
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
                SET ${setClauses}
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
          "id": this.selectedRule.id,
          "match": this.selectedRule.match,
          "parameter_value": this.selectedRule.parameter_value,
          "condition": this.selectedRule.condition,
          "category": this.selectedRule.category
        })
      });
      window.location.reload();
    }
    this.dialogEdit = false
  },
}
}
</script>
