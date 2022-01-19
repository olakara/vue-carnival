<template>
  <div>
    <CameraViewPort />
    <form
    id="registerForm"
    @submit="onRegister"
    novalidate="true">

        <p v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
                <li v-for="error in errors">{{ error }}</li>
            </ul>
        </p>
        <div>
        <label>Name</label>
        <input v-model="form.name" placeholder="Name" />
        </div>
        <div>
        <label>Email</label>
        <input v-model="form.email" placeholder="Email" />
        </div>
        <button type="submit"> Register </button>
    </form>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import CameraViewPort from '../components/CameraViewPort.vue';

export default {
  name: 'Register',
  components: {
    CameraViewPort
},
  data() {
      return {
          errors: [],
          form: {
              name: '',
              email: '',
              photo: null
          }
      };
  },
  methods: {
      onRegister(e) {
            e.preventDefault()
            if(this.validateForm(e)) {
               this.errors = []
              this.axios.post("http://localhost:9090/users",{
                id: uuidv4(),
                name:  this.form.name,
                email: this.form.email,
                photo: this.form.photo
            }).then((response) => {
                this.$router.push('/home')
            })
          }
      },
      validateForm() {
          this.errors = []
          let formValid = true
          if(!this.form.name) {
              this.errors.push('Name cannot be empty')
              formValid = false
          }

          if(!this.form.email || !this.validateEmail(this.form.email)) {
              this.errors.push('Enter valid Email address')
              formValid = false
          }

          return formValid
      },
      validateEmail(email)
        {
            var re = /\S+@\S+\.\S+/;
            return re.test(email);
        }
  }
}
</script>
