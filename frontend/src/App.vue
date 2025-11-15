<script setup lang="ts">
import Prompt from './components/Prompt.vue'
import Canvas from './components/Canvas.vue'
import { ref } from 'vue'
import { addNewNode, selectedNodes, viewOffsetX, viewOffsetY } from './lib/State'
import ModelPicker from './components/ModelPicker.vue'
import Actions from './components/Actions.vue'

// Global type augmentation to include selectedModel in window
declare global {
    interface Window {
        selectedModel: string
    }
}

const showInstructions = ref(false)

function toggleInstructions() {
    showInstructions.value = !showInstructions.value
}

function prompt(prompt: string) {
    if (selectedNodes.value.length === 0) {
        if (prompt.length === 0) return

        addNewNode(prompt, [], -viewOffsetX.value + document.body.offsetWidth / 2, -viewOffsetY.value + document.body.offsetHeight / 2)
    } else if (selectedNodes.value.length === 1) {
        if (prompt.length === 0) return

        addNewNode(prompt, [selectedNodes.value[0].id], selectedNodes.value[0].x + Math.random() * 100, selectedNodes.value[0].y + Math.random() * 100)
    } else if (selectedNodes.value.length > 1) {
        addNewNode(
            prompt.length === 0 ? 'Merge these images' : prompt,
            selectedNodes.value.map(node => node.id),
            selectedNodes.value[0].x + Math.random() * 100,
            selectedNodes.value[0].y + Math.random() * 100
        )
    }

    selectedNodes.value = []
}
</script>

<template>
    <h1 class="absolute top-5 left-5 text-[var(--color-text)] z-300 text-2xl">BONSAI</h1>

    <div class="flex flex-col w-screen h-screen">
        <div class="flex grow">
            <Canvas class="grow" />
        </div>
    </div>

    <div class="absolute left-0 bottom-0 flex w-full pb-4 px-8 gap-8">
        <ModelPicker />
        <Prompt class="grow" @prompt="prompt" />
        <Actions />
    </div>

    <!-- Hamburger Menu -->
    <div class="absolute top-4 right-4 z-200">
        <button
            @click="toggleInstructions"
            class="flex flex-col justify-center items-center w-10 h-10 bg-[var(--color-element)] text-[var(--color-text-alt)] focus:outline-none border border-[var(--color-border)] rounded-lg"
        >
            <span
                class="block w-5 h-0.5 bg-[var(--color-text-alt)] mb-1 transition-all duration-300"
                :class="showInstructions ? 'rotate-45 translate-y-2' : ''"
            ></span>
            <span class="block w-5 h-0.5 bg-[var(--color-text-alt)] mb-1 transition-all duration-300" :class="showInstructions ? 'opacity-0' : ''"></span>
            <span
                class="block w-5 h-0.5 bg-[var(--color-text-alt)] transition-all duration-300"
                :class="showInstructions ? '-rotate-45 -translate-y-2' : ''"
            ></span>
        </button>
    </div>

    <!-- Instructions Modal -->
    <transition name="fade-slide">
        <div v-if="showInstructions" class="fixed inset-0 bg-[var(--color-background-trans)] flex items-center justify-center z-50 backdrop-blur">
            <div class="text-white rounded-lg p-8 max-w-lg w-full relative">
                <h2 class="text-2xl font-bold mb-4">Instructions</h2>
                <ul class="list-disc pl-6 space-y-6 text-base">
                    <li>Create an unlinked idea: Enter your prompt. Press enter or click the add button. A "root" idea will generate.</li>
                    <li>Modify an existing idea: Select an idea. Enter your prompt. Press enter or click the modify button. A "child" idea will generate.</li>
                    <li>
                        Merge multiple ideas: Select 2+ ideas. Enter your prompt (optional). Press enter or click the merge button. A "child" idea will
                        generate.
                    </li>
                    <li>
                        To enter a prompt using your voice, hit the speak button and say your prompt, then hit the stop button once you are down with you
                        current prompt
                    </li>
                </ul>
            </div>
        </div>
    </transition>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: opacity 0.3s, transform 0.3s;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
}
.fade-slide-enter-to,
.fade-slide-leave-from {
    opacity: 1;
    transform: translateY(0) scale(1);
}
</style>
