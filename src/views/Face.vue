<template>
    <img id="storePhoto" :width="450" :height="337.5" src="../assets/my-photo.jpg" />
    <img id="comparePhoto" :width="450" :height="337.5" :src="photo" style="border: 5px solid red" />
    <video id="camVideo" autoplay></video>
    <canvas id="camPhoto" :width="450" :height="337.5"></canvas>
    <button @click="compare">Snap And Compare</button>
    Loaded: {{ loaded }}
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import * as faceAPI from 'face-api.js'
const WEIGHTS_URL = "http://localhost:8081/weights";


export default {
    data() {
        return {
            loaded: false,
            photo: null
        }
    },
    async beforeMount() {

        await faceAPI.loadFaceDetectionModel(WEIGHTS_URL);
        await faceAPI.loadFaceLandmarkModel(WEIGHTS_URL);
        await faceAPI.loadFaceRecognitionModel(WEIGHTS_URL);
        await faceAPI.loadMtcnnModel(WEIGHTS_URL)
        await faceAPI.loadSsdMobilenetv1Model(WEIGHTS_URL)

        this.loaded = true;
    },

    mounted() {

        const constraints = {
            audio: false,
            video: true,
        };

        const video = document.getElementById("camVideo");

        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
            video.srcObject = stream;
        });

    },
    methods: {
        hasGetUserMedia() {
            return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
        },
        snapPhoto() {
            const canvas = document.getElementById("camPhoto");
            const video = document.getElementById("camVideo");
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            this.photo = canvas.toDataURL('image/jpeg');
        },
        async compare() {
            const label = "Abdel"
            const id = 'e48dc042-2c9b-4cf3-80cc-e22f077da6d1'

            this.snapPhoto();

            const storedPhoto = document.getElementById('storePhoto')
            const snappedPhoto = document.getElementById('comparePhoto')

            const storedPhotoDescription = await faceAPI.detectSingleFace(storedPhoto).withFaceLandmarks().withFaceDescriptor()
            console.log('storedPhotoDescription', storedPhotoDescription)
            console.log('descriptor', storedPhotoDescription.descriptor)
            const faceDescriptors = [new Float32Array(storedPhotoDescription.descriptor)]
            console.log('faceDescriptors', faceDescriptors)

            const labeledFaceDescriptorsForStoredPhoto = new faceAPI.LabeledFaceDescriptors(label, faceDescriptors)

            const threshold = 0.6
            const faceMatcher = new faceAPI.FaceMatcher(labeledFaceDescriptorsForStoredPhoto, threshold)

            console.log('Face matcher', faceMatcher);

            const snappedPhotoDescription = await faceAPI.detectSingleFace(snappedPhoto).withFaceLandmarks().withFaceDescriptor()
            console.log('snappedPhotoDescription', snappedPhotoDescription)

            const results = faceMatcher.findBestMatch(snappedPhotoDescription.descriptor)

            console.log('result', results)

        }
    }
}
</script>