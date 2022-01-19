<template>
  <div class="home">
    <CameraViewPort ref="camera" />
    <span v-if="processing">Identifying user...</span>
    <span v-if="userFound">
      Welcome {{ user.name }}!
      <button
        v-if="canTakeAction && canCheckIn"
        @click="onCheckInUserClick(user)"
      >Check In</button>
      <button v-if="canTakeAction && !canCheckIn" @click="onCheckOutUserClick(user)">Check Out</button>
    </span>
    <span v-if="!processing && !userFound">User was not identified. Please register!</span>
  </div>
  <div style="display:none">
    <img id="snappedPhoto" :width="450" :height="450" :src="photoToProcess" />
    <div v-for="user in users">
      {{ user.name }}
      <img :id="user.id" :src="user.photo" :width="450" :height="450" />
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import CameraViewPort from "@/components/CameraViewPort.vue";
import * as faceAPI from 'face-api.js'
const WEIGHTS_URL = "http://localhost:8081/weights";

export default {
  name: 'Home',
  components: {
    CameraViewPort
  },
  data() {
    return {
      users: [],
      user: {},
      processing: true,
      userFound: false,
      canTakeAction: false,
      photoToProcess: null,
      snapper: null
    }
  },
  async beforeMount() {

    await faceAPI.loadFaceDetectionModel(WEIGHTS_URL);
    await faceAPI.loadFaceLandmarkModel(WEIGHTS_URL);
    await faceAPI.loadFaceRecognitionModel(WEIGHTS_URL);
    await faceAPI.loadMtcnnModel(WEIGHTS_URL)
    await faceAPI.loadSsdMobilenetv1Model(WEIGHTS_URL)
  },
  mounted() {

    this.axios.get("http://localhost:9090/users").then((response) => {
      if (response.status == 200) {
        this.users = response.data
      }
    }).catch((error) => {
      console.error(error.error);
    });


    this.snapper = setInterval(() => {
      if (this.$refs.camera.isStreaming) {
        this.autoSnapAndValidateUser()
      }
    }, 5000);

  }, methods: {
    async autoSnapAndValidateUser(users) {

      this.photoToProcess = this.$refs.camera.snapPhoto()

      if (!this.photoToProcess)
        return;

      const snappedPhoto = document.getElementById('snappedPhoto')

      const snappedPhotoDescription = await faceAPI.detectSingleFace(snappedPhoto)
        .withFaceLandmarks()
        .withFaceDescriptor()

      if (!snappedPhotoDescription.descriptor)
        return;
      const faceDescriptors = [new Float32Array(snappedPhotoDescription.descriptor)]

      for (let index = 0; index < this.users.length; index++) {
        const comparePhoto = document.getElementById(this.users[index].id)
        const labeledFaceDescriptorsForStoredPhoto = new faceAPI.LabeledFaceDescriptors(this.users[index].name, faceDescriptors)
        const threshold = 0.6
        const faceMatcher = new faceAPI.FaceMatcher(labeledFaceDescriptorsForStoredPhoto, threshold)
        const snappedPhotoDescription = await faceAPI.detectSingleFace(comparePhoto).withFaceLandmarks().withFaceDescriptor()
        if (!snappedPhotoDescription.descriptor)
          continue;

        const results = faceMatcher.findBestMatch(snappedPhotoDescription.descriptor)

        if (results._label == 'Unknown' || results._label == 'unknown') {
          continue;
        } else {
          this.user = this.users[index]
          this.userFound = true
          clearInterval(this.snapper)
          this.loadPreviousActions(this.users[index].id).then((response) => {
            if (response.status == 200) {
              this.entries = response.data
              this.canTakeAction = true
              if (this.entries[0].action === 'CHECKIN')
                this.canCheckIn = false
              else
                this.canCheckIn = true
            }
          }).catch((error) => {
            console.error(error.error);
          });
          break;
        }
      }
      this.processing = false;


    },
    loadPreviousActions(userId) {
      return this.axios.get("http://localhost:9090/entry?userId=" + userId + "&_sort=at&_order=desc")
    },
    onCheckInUserClick(user) {
      this.axios.post("http://localhost:9090/entry", {
        id: uuidv4(),
        userId: user.id,
        name: user.name,
        email: user.email,
        action: 'CHECKIN',
        at: Date.now(),
        photo: this.photoToProcess
      }).then((response) => {
        this.$router.push('/checkin')
      })

    },
    onCheckOutUserClick(user) {

      this.axios.post("http://localhost:9090/entry", {
        id: uuidv4(),
        userId: user.id,
        name: user.name,
        email: user.email,
        action: 'CHECKOUT',
        at: Date.now(),
        photo: this.photoToProcess
      }).then((response) => {
        this.$router.push('/checkout')
      })
    }
  }
}
</script>
