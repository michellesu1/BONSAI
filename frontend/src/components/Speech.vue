<script lang="ts" setup>
import { onMounted, ref } from 'vue'

const emit = defineEmits(['update', 'prompt'])

const listening = ref(false)

let speechRecognition = null

function toggle() {
    listening.value = !listening.value

    if (!speechRecognition) return

    if (listening.value) {
        speechRecognition.start()
    } else {
        speechRecognition.stop()
    }
}

onMounted(() => {
    //@ts-ignore
    speechRecognition = new SpeechRecognition()
    speechRecognition.continuous = true
    speechRecognition.interimResults = true
    speechRecognition.lang = 'en-US'

    let lastEventId = Math.random()

    speechRecognition.onresult = event => {
        lastEventId = Math.random()

        let text = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
            text += event.results[i][0].transcript
        }

        emit('update', text.trim())

        const targetId = lastEventId

        setTimeout(() => {
            if (lastEventId !== targetId) return

            if (!listening.value) return

            toggle()

            emit('prompt')
        }, 1000)
    }
})
</script>

<template>
    <button
        class="flex cursor-pointer items-center px-1.5 m-1 select-none hover:bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg transition-colors duration-100 ease-in-out hover:duration-0"
        @click="toggle"
    >
        <span class="material-symbols-outlined text-[var(--color-text-alt)] block"> {{ listening ? 'volume_up' : 'mic' }} </span>
    </button>
</template>
