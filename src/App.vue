<template>
  <v-app>
    <v-navigation-drawer app>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-app-bar-title>
        <router-link to="/" class="mx-2">Simple App</router-link>
        <span v-if="user">{{ user.name }}</span>
      </v-app-bar-title>

      <router-link to="/dashboard" class="mx-2">Dashboard</router-link>
      <router-link to="/register" class="mx-2">Register</router-link>
      <router-link to="/login" class="mx-2">Login</router-link>
      <router-link to="/admin" class="mx-2">Admin</router-link>
      <router-link to="/about" class="mx-2">About</router-link>

      <v-btn icon>
        <v-icon>mdi-account</v-icon>
      </v-btn>
      <v-btn icon
             @click="userLogout"
             v-if="isLoggedIn"
      >
        <v-icon>mdi-exit-to-app</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main style="height: 100vh">
      <v-container fluid>
        <router-view/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import {mapState, mapMutations} from 'vuex'

export default {
  name: 'App',
  data: () => ({
    //
  }),
  computed: {
    ...mapState([
        'user',
        'isLoggedIn'
    ]),
    // showUser() {
    //   return JSON.parse(localStorage.getItem('user'))
    // }
  },
  mounted() {
    if(!localStorage.getItem('user')) {
      this.$store.commit('toggleLogin',false)
    } else {
      this.$store.commit('getUserFromStorage')
      this.$store.commit('toggleLogin',true)
    }
  },
  methods: {
    ...mapMutations([
        'toggleLogin'
    ]),
    userLogout() {
      localStorage.removeItem('jwt')
      localStorage.removeItem('user')
      this.toggleLogin(false)
      this.$router.push('/')
    }
  }
}
</script>
