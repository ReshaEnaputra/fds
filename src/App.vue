<template>
  <v-app>
    <template v-if="!$route.meta.fullPage">
      <Navbar/>
    </template>
    <v-content :style="contentStyle">
      <router-view></router-view>
    </v-content>
    <template v-if="!$route.meta.fullPage">
      <Footer/>
    </template>
  </v-app>
</template>

<script>
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default {
  name: 'App',
  components: {
    Navbar,
    Footer
  },
  data() {
    return {
      contentStyle: {
        background: 'lightblue'
      }
    };
  }
};
</script>
