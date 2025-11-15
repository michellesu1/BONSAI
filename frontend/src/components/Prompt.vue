<script lang="ts" setup>
import Speech from './Speech.vue'

import { computed, ref } from 'vue'
import { selectedNodes } from '../lib/State'

const emit = defineEmits(['prompt'])

const prompt = ref('')

function keydown(event: KeyboardEvent) {
    if (event.key !== 'Enter') return

    submit()
}

const placeholder = computed(() => {
    if (selectedNodes.value.length === 1) return 'Modify selected idea...'
    if (selectedNodes.value.length > 1) return 'Merge selected ideas...'

    return 'Describe a new idea...'
})

const icon = computed(() => {
    if (selectedNodes.value.length === 1) return 'brush'
    if (selectedNodes.value.length > 1) return 'merge'

    return 'add'
})

function submit() {
    emit('prompt', prompt.value)

    prompt.value = ''
}

//@ts-ignore
const supportsSpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
</script>

<template>
    <div class="flex bg-[var(--color-element)] border border-[var(--color-border)] text-[var(--color-text)] overflow-auto rounded-xl">
        <input
            type="text"
            v-model="prompt"
            :placeholder="placeholder"
            class="min-w-0 placeholder:text-[var(--color-text-alt)] outline-none border-none px-4 py-3.5 grow h-full"
            @keydown="keydown"
        />

        <Speech v-if="supportsSpeechRecognition" @update="text => (prompt = text)" @prompt="submit" />

        <button
            class="bg-[var(--color-accent)] rounded-lg flex items-center justify-center px-2 py-1 m-1 cursor-pointer hover:bg-[var(--color-accent-hover)] transition-all duration-100 hover:duration-0 ease-in-out"
            @click="submit"
        >
            <span class="material-symbols-outlined text-[var(--color-accent-button)] block"> {{ icon }} </span>
        </button>
    </div>
</template>
