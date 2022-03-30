<template>
  <v-card
      class="mx-auto my-3"
      max-width="300"
      variant="outlined"
  >
    <v-card-header>
      <v-card-title>Register</v-card-title>
    </v-card-header>

    <v-card-text>
      <input type="text"
             name="name"
             v-model="name"
             placeholder="Name"
             class="my-3 border border-l px-2 py-1">
      <input type="text"
             name="email"
             v-model="email"
             placeholder="Email"
             class="my-3 border border-l px-2 py-1">
      <input name="password"
             type="password"
             v-model="password"
             placeholder="Password"
             class="my-3 border border-l px-2 py-1">
      <input name="confirm-password"
             v-model="confirmPass"
             type="password"
             placeholder="Confirm password"
             class="my-3 border border-l px-2 py-1">
      <div class="my-3">
        <input type="checkbox" id="isadmin" v-model="is_admin">
        <label for="isadmin" class="mx-2">Register as admin</label>
      </div>
    </v-card-text>

    <v-card-actions>
      <v-btn
          variant="outlined"
          rounded
          text
          @click.prevent="registerUser"
      >
        Register
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from 'axios'
import {mapMutations} from 'vuex'

export default {
  name: "UserRegister",
  data: () => ({
    name: '',
    email: '',
    password: '',
    confirmPass: '',
    is_admin: false
  }),
  methods: {
    ...mapMutations([
       'toggleLogin'
    ]),
    registerUser() {
      if(this.password === this.confirmPass && this.password.length > 0) {
        let url = '//localhost:3000/register'
        if(this.is_admin === true) url = '//localhost:3000/register-admin'
        axios.post(url, {
          name: this.name,
          email: this.email,
          password: this.password,
          is_admin: this.is_admin
        })
        .then(response => {
          localStorage.setItem('user', JSON.stringify(response.data.user))
          localStorage.setItem('jwt', response.data.token)
          this.$store.commit('toggleLogin',true)
          this.$store.commit('setUser', response.data.user)

          if(localStorage.getItem('jwt') != null) {
            this.$emit('loggedIn')
            if(this.$route.params.nextUrl != null) {
              console.log('check this: ',this.$router.push(this.$route.params.nextUrl))
            } else {
              this.$router.push('/admin')
            }
          }
        })
        .catch(err => {
          this.$store.commit('toggleLogin',false)
          console.error(err)
        })
      } else {
        return alert('Passwords do not match')
      }
    }
  }
}
</script>

<style scoped>

</style>
