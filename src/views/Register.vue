<template>
  <div class="row">
        <div class="col-sm"></div>
        <div class="col-sm">
            <CameraViewPort ref="camera"/>
            <form class="form-inline"
            id="registerForm"
            @submit="onRegister"
            novalidate="true">

                <p v-if="errors.length">
                    <b>Please correct the following error(s):</b>
                    <ul>
                        <li v-for="error in errors">{{ error }}</li>
                    </ul>
                </p>
                <div class="form-group row mb-2">
                    <label class="col-sm-3 col-form-label">Full name</label>
                    <div class="col-sm-9">
                        <input type="text" class="form-control"  v-model="form.name" placeholder="Enter full name">
                    </div>
                </div>
                <div class="form-group row mb-2">
                    <label class="col-sm-3 col-form-label">Email</label>
                    <div class="col-sm-9">
                        <input type="email" class="form-control" v-model="form.email" placeholder="Enter email">
                    </div>
                </div>
                <button type="submit" class="btn btn-success"> Register </button>
            </form>
        </div>
        <div class="col-sm"></div>
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
                let photo = this.$refs.camera.snapPhoto()

               this.errors = []
               this.axios.post("http://localhost:9090/users",{
                 id: uuidv4(),
                 name:  this.form.name,
                 email: this.form.email,
                 photo: photo
             }).then((response) => {
                 this.$router.push('/')
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
