<template>
  <nav>
    <v-app-bar app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="text-uppercase "></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <v-list flat>
          <v-list-item v-for="link in links"  :key="link.text" router :to="link.route" active-class="border">
            <v-list-item-title >{{link.text}}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn color="light-blue" @click="signOut()" text>
        <span>Exit</span>
        <v-icon right>exit_to_app</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" dark app class="white">
      <v-layout column align-center>
        <v-flex class="mt-5"> 
          <v-img
            class="text-center"
            :src="require('../assets/logo-soluix.png')"
            width="170px"
            height="39px"
          ></v-img>
        </v-flex>
        <v-flex class="mt-4 mb-4">
        </v-flex>
      </v-layout>
      <v-list flat>
        <v-list-item v-for="link in links" :key="link.text" router :to="link.route" class="transition" active-class="border">
          <v-list-item-action>
            <v-icon color="#1167B1">{{link.icon}}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title style="color: #03254C;">{{link.text}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>
<script>
export default {
   data: () => ({
    drawer: true,
    links :[
        {icon: 'dashboard', text:'Dashboard', route: '/'},
        {icon: 'work', text:'Case', route: '/case'},
        {icon: 'edit', text:'Rule', route: '/rule'},
        {icon: 'edit', text:'Parameter', route: '/parameter'},
        {icon: 'edit', text:'Category', route: '/category'},
    ]
  }),
  methods: {
    signOut() {
      // eslint-disable-next-line no-undef
      this.$router.push("/login");
    }
  }
}
</script>
<style scoped>
.border {
  background: linear-gradient(to right, white 50%, skyblue 50%);
  background-position: right bottom;
  background-size: 200% 100%;
  color: blue;
  border-right: darkblue 5px solid;
}
.transition {
  transition: 0.2s;
}
</style>
