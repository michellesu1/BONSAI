<script lang="ts" setup>
import { ref } from 'vue'
import { selectedModel } from '../lib/State'

const menuVisible = ref(false)

const models = {
    // dummy: 'Dummy',
    'sdxl-lightning': 'Stable Diffusion Lightning',
    'gpt-image-1': 'GPT Image 1',
    'dall-e-3': 'Dall-E 3',
    'dall-e-2': 'Dall-E 2',
    // 'dall-e-2': 'Dall-E 2',
    // 'stable-diffusion-xl-1.0': 'Stable Diffusion XL 1.0',
    // 'Qwen-Image-Edit': 'Qwen Image Edit',
}
</script>

<template>
    <div class="relative w-64">
        <div
            class="flex w-full bg-[var(--color-element)] border border-[var(--color-border)] text-[var(--color-text)] rounded-xl cursor-pointer relative z-10"
            @click="menuVisible = !menuVisible"
        >
            <span class="px-4 py-3.5 pr-0 grow select-none"> {{ models[selectedModel] }} </span>

            <button class="px-2">
                <span
                    class="material-symbols-outlined text-[var(--color-text-alt)] block transition-[rotate] duration-100 ease-in-out"
                    :class="{
                        'rotate-0': !menuVisible,
                        'rotate-180': menuVisible,
                    }"
                    >arrow_drop_down</span
                >
            </button>
        </div>

        <Transition>
            <div
                v-if="menuVisible"
                class="flex flex-col gap-1 w-full menu absolute dropdown p-1 pb-5 bg-[var(--color-element)] border border-[var(--color-border)] text-[var(--color-text)] rounded-t-xl"
            >
                <button
                    v-for="model in Object.keys(models)"
                    class="hover:bg-[var(--color-background)] p-2 py-3 rounded-lg cursor-pointer select-none transition-colors duration-100 ease-in-out hover:duration-0"
                    @click="
                        () => {
                            selectedModel = model

                            menuVisible = false
                        }
                    "
                >
                    {{ models[model] }}
                </button>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.dropdown {
    bottom: calc(100% - 10px);
}

.v-enter-active,
.v-leave-active {
    transition: scale 0.2s ease, translate 0.2s ease, opacity 0.15s ease;
}

.v-enter-to,
.v-leave-from {
    translate: 0px 0px;
    scale: 1;
    opacity: 1;
}

.v-enter-from,
.v-leave-to {
    translate: 0px 1rem;
    scale: 0.95;
    opacity: 0;
}
</style>
