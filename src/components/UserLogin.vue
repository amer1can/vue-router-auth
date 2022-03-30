<template>
  <v-card
      class="mx-auto my-3"
      max-width="300"
      variant="outlined"
  >
    <v-card-header>
      <v-card-title>Login</v-card-title>
    </v-card-header>

    <v-card-text>
      <input type="text"
             name="email"
             v-model="email"
             placeholder="Email"
             @click="error=null"
             class="my-3 border border-l px-2 py-1">
      <input name="password"
             type="password"
             v-model="password"
             @click="error=null"
             placeholder="Password"
             class="my-3 border border-l px-2 pt-1">
      <div class="err">
        <label v-if="error" class="err d-block text-red">{{ error }}</label>
      </div>
    </v-card-text>

    <v-card-actions>
      <v-btn
          variant="outlined"
          rounded
          text
          @click.prevent="loginUser"
      >
        Login
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {mapMutations} from 'vuex'
import axios from "axios";

export default {
  name: "UserLogin",
  data: () => ({
    email: '',
    password: '',
    error: null
  }),
  methods: {
    ...mapMutations([
        'toggleLogin'
    ]),
    loginUser() {
      if(this.password.length > 0) {
        axios.post('//localhost:3000/login', {
          email: this.email,
          password: this.password
        })
            .then(response => {
              const is_admin = response.data.user.is_admin
              localStorage.setItem('user', JSON.stringify(response.data.user))
              localStorage.setItem('jwt', response.data.token)
              this.$store.commit('toggleLogin',true)
              this.$store.commit('setUser', response.data.user)

              if (localStorage.getItem('jwt') != null){
                this.$emit('loggedIn')
                if(this.$route.params.nextUrl != null){
                  this.$router.push(this.$route.params.nextUrl)
                }
                else {
                  if(is_admin == 1){
                    this.$router.push('admin')
                  }
                  else {
                    this.$router.push('dashboard')
                  }
                }
              }

            })
            .catch(err => {
              this.$store.commit('toggleLogin',false)
              if(err.response.status === 404) {
                this.error = err.response.data
              }
              console.error(err.response)
            })
      }
    }
  }
}
</script>

<style scoped>
.err {
  height: 20px;
}
</style>
