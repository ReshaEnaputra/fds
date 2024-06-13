<template>
  <div class="category">
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
            <h2 class="font-weight-regular">Category</h2>
          </v-sheet>
          <v-row no-gutters>
            <div 
              v-for="category in categories" 
              :key="category.id"
              style="width: 48%;"
            >
              <v-sheet
                :elevation="0"
                class="mt-4 ml-4 pa-4"
                style="border: lightblue 0.5px dotted; border-radius: 20px;"
                rounded="xl"
              >
                <h3>{{ category.source_name }}</h3>
                <div class="d-flex mt-2">
                  <v-img
                    :src="require('../assets/credit-card.png')"
                    max-width="70px"
                    height="50px"
                  ></v-img>
                  <div class="ml-4">
                    <h3 style="text-overflow: ellipsis; max-width: 420px; width: 420px; overflow: hidden; white-space: nowrap;">{{ category.source }}</h3>
                    {{ category.name }}
                  </div>
                  <v-btn elevation="0" color="#E1F5FE" min-width="36px" @click="handleEditClick(category, 'edit')" class="pa-0 ml-4">
                    <v-icon width="auto" size="large" color="blue">edit</v-icon>
                  </v-btn>
                  <v-btn elevation="0" v-if="category.status === 'active'" @click="handleSubmitDelete(category)" color="#FFEBEE" min-width="127px" class="pa-4 ml-4 red--text">
                    Deactivate
                  </v-btn>
                  <v-btn elevation="0" v-if="category.status !== 'active'" @click="handleActivate(category)" color="#E8F5E9" min-width="127px" class="pa-4 ml-4 green--text">
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
                Please carefully read Product Terms before adding new category
              </div>
              <v-btn elevation="0" class="ml-4 mr-4" min-width="127px" @click="handleEditClick({}, 'add')" style="background-color: royalblue; color: #E3F2FD;">
                Add Category
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
            <div v-if="selectedCategory.id">
              Edit Category
            </div>
            <div v-else>
              Add Category
            </div>
            <v-card elevation="0" class="text-right mt-2">
              <v-text-field underlined v-model="selectedCategory.source_name" class="w-100" label="Name"></v-text-field>
              <v-text-field underlined v-model="selectedCategory.name" class="w-100" label="Category Name"></v-text-field>
              <v-text-field underlined v-model="selectedCategory.connector_name" class="w-100" label="Source Name"></v-text-field>
              <v-textarea :spellcheck="false" clearable v-model="selectedCategory.source" underlined class="w-100" label="Source"></v-textarea>
              <v-text-field underlined v-model="selectedCategory.sink_name" class="w-100" label="Sink Name"></v-text-field>
              <v-text-field underlined v-model="selectedCategory.sink_topic" class="w-100" label="Sink Kafka Topic"></v-text-field>
              <v-textarea :spellcheck="false" clearable v-model="selectedCategory.sink" underlined class="w-100" label="Sink"></v-textarea>
              <v-btn class="ms-auto" v-if="selectedCategory.id" right @click="handleSubmitEdit('edit')">
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
    selectedCategory: {},
    categories: [],
    loadingCategory: false,
    headers: [
      { text: 'ID', value: 'id' },
      { text: 'Category Name', value: 'name' },
      { text: 'Source Name', value: 'source_name' },
      { text: 'Connector Source', value: 'source' },
    ],
  }),
  mounted() {
    this.getTableData()
  },
  methods: {
    handleSubmitDelete(category) {
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
                MATCH (cat:Category)
                WHERE cat.id = '${category.id}'
                SET cat.status = 'inactive'
              `,
              "resultDataContents": ["graph"]
            }
          ]
        })
      })
      fetch('http://localhost:8082/del-source', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "name": `${category.connector_name}`,
          "sink_name": `${category.sink_name}`,
        })
      })
      category.status = 'inactive'
    },
    handleCloseEdit() {
      this.dialogEdit = false
      this.selectedCategory = {}
    },
    handleEditClick(category, type) {
      switch (type) {
        case 'edit':
          this.dialogEdit = true
          this.selectedCategory = category
          this.sourceName = category.name
          break;
        case 'add':
          this.dialogEdit = true
          break;
      }
    },
    handleSubmitEdit(type) {
      if(this.selectedCategory.status === 'active' && type === 'edit') {
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
                  MATCH (cat:Category)
                  WHERE cat.id = '${this.selectedCategory.id}'
                  SET cat.name = '${this.selectedCategory.name}', cat.source_name = '${this.selectedCategory.source_name}', cat.source = '${this.selectedCategory.source}', cat.status = 'active', cat.connector_name = '${this.selectedCategory.connector_name}', cat.sink_name = '${this.selectedCategory.sink_name}', cat.sink = '${this.selectedCategory.sink}', cat.sink_topic = '${this.selectedCategory.sink_topic}'
                `,
                "resultDataContents": ["graph"]
              }
            ]
          })
        })
        fetch('http://localhost:8082/del-source', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "name": `${this.selectedCategory.connector_name}`,
            "sink_name": `${this.selectedCategory.sink_name}`,
          })
        }).then(() => {
          fetch('http://localhost:8082/add-source', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              "name": this.selectedCategory.name,
              "source_name": this.selectedCategory.connector_name,
              "id": this.selectedCategory.id,
              "source": this.selectedCategory.source,
              "sink_name": this.selectedCategory.sink_name,
              "sink": this.selectedCategory.sink,
              "sink_topic": this.selectedCategory.sink_topic
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
                  CREATE (cat:Category)
                  SET cat.name = '${this.selectedCategory.name}', cat.source_name = '${this.selectedCategory.source_name}', cat.source = '${this.selectedCategory.source}', cat.status = 'active', cat.connector_name = '${this.selectedCategory.connector_name}', cat.sink_namae = '${this.selectedCategory.sink_name}', cat.sink = '${this.selectedCategory.sink}', cat.sink_topic = '${this.selectedCategory.sink_topic}'
                `,
                "resultDataContents": ["graph"]
              }
            ]
          })
        })
        fetch('http://localhost:8082/add-source', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "name": this.selectedCategory.name,
            "source_name": this.selectedCategory.connector_name,
            "id": this.selectedCategory.id,
            "source": this.selectedCategory.source,
            "sink_name": this.selectedCategory.sink_name,
            "sink": this.selectedCategory.sink,
            "sink_topic": this.selectedCategory.sink_topic
          })
        });
        window.location.reload();
      }
      this.dialogEdit = false
    },
    handleActivate(category) {
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
                MATCH (cat:Category)
                WHERE cat.id = '${category.id}'
                SET cat.status = 'active'
              `,
              "resultDataContents": ["graph"]
            }
          ]
        })
      })
      fetch('http://localhost:8082/add-source', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "name": category.name,
          "id": category.id,
          "source": category.source,
          "source_name": category.connector_name,
          "sink_name": category.sink_name,
          "sink": category.sink,
          "sink_topic": category.sink_topic
        })
      })
      category.status = 'active'
    },
    getTableData() {
      this.loadingCategory = true
      fetch('http://10.125.9.64:7474/db/neo4j/tx/commit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('neo4j:password')
        },
        body: JSON.stringify({
          "statements": [{
            "statement": "MATCH (c:Category) RETURN c",
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
              id: node.properties.id,
              name: node.properties.name,
              source: node.properties.source,
              source_name: node.properties.source_name,
              status: node.properties.status,
              connector_name: node.properties.connector_name,
              sink: node.properties.sink,
              sink_name: node.properties.sink_name,
              sink_topic: node.properties.sink_topic
            })
          });
        });
        this.loadingCategory = false
        this.categories = nodes;
      });
    },
  }
}
</script>
  