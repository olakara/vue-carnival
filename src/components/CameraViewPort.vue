<template>
    <div class="video-mask">
        <video id="camVideo" autoplay></video>
    </div>
    <canvas id="camPhoto" :width="450" :height="450" style="display:none"></canvas>
</template>
<script>
export default {
    data() {
        return {
            isStreaming: false
        }
    },
    mounted() {

        const constraints = {
            audio: false,
            video: true,
        };

        const video = document.getElementById("camVideo");

        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
            video.srcObject = stream;
            this.isStreaming = true;
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
            return canvas.toDataURL('image/jpeg');
        }
    }
}
</script>
<style>
.video-mask {
    /* width: 450px;
    border-radius: 100%;
    overflow: hidden; */
}
</style>