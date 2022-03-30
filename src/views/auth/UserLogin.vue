<template>
  <v-card
      class="mx-auto my-3 d-flex flex-column align-center py-5"
      max-width="300"
      variant="outlined"
  >
    <v-card-header class="mb-5">
      <v-card-title><h2>Login</h2></v-card-title>
    </v-card-header>

    <v-card-text class="align-self-stretch">
      <v-text-field type="text"
             name="email"
             v-model="email"
             placeholder="Email"
             :rules="emailRules"
             @click="error=null" />
      <v-text-field name="password"
             type="password"
             v-model="password"
             @click="error=null"
             :rules="passRules"
             placeholder="Password"/>
      <div class="err">
        <label v-if="error" class="err d-block text-red">{{ error }}</label>
      </div>
    </v-card-text>

    <v-card-actions>
      <v-btn
          class="px-5 py-1"
          variant="contained-text"
          rounded
          text
          size="large"
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
    error: null,
    emailRules: [
        v => !!v || 'Email is required',
        v => /.+@.+/.test(v) || 'Email must be a valid'
    ],
    passRules: [
        v => !!v || 'Password is required',
        v => v.length >= 3 || 'Password must be more than 3 characters'
    ]
  }),
  methods: {
    ...mapMutations([
        'toggleLogin'
    ]),
    loginUser() {
      if(this.password.length > 0) {
        axios.post('//localhost:3001/login', {
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
