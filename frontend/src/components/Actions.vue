<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { addNewNode, deleteSelectedNodes, nodeLookup, nodes, viewOffsetX, viewOffsetY, type Node } from '../lib/State'
import type { Ref } from 'vue/dist/vue.js'

let xOffset = 0
let yOffset = 0

const filePicker: Ref<HTMLInputElement> = ref(null)

function goHome() {
    let sumX = 0
    let sumY = 0

    for (const node of nodes.value) {
        sumX += node.x
        sumY += node.y
    }

    const averageX = sumX / nodes.value.length
    const averageY = sumY / nodes.value.length

    xOffset = averageX - (-viewOffsetX.value + document.body.offsetWidth / 2)
    yOffset = averageY - (-viewOffsetY.value + document.body.offsetHeight / 2)
}

let lastTime = Date.now()

function update() {
    const now = Date.now()
    const deltaTime = Math.min(((now - lastTime) / 1000), 0.2) * 4
    lastTime = now

    const movementX = xOffset * deltaTime
    const movementY = yOffset * deltaTime

    viewOffsetX.value -= movementX
    viewOffsetY.value -= movementY

    xOffset -= movementX
    yOffset -= movementY

    requestAnimationFrame(update)
}

function importImage() {
    filePicker.value.click()
}

onMounted(() => {
    filePicker.value.addEventListener('change', event => {
        //@ts-ignore
        const file = event.target.files[0]
    
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader()
            
            reader.onload = function(e) {
                const imageDataUrl = e.target.result

                if(typeof imageDataUrl !== 'string') return

                const id = Math.random().toString()
                const node: Node = {
                    x: viewOffsetX.value,
                    y: viewOffsetY.value,
                    image: imageDataUrl,
                    id,
                    backlinks: [],
                    pointsTo: [],
                }

                nodes.value.push(node)
                nodeLookup[id] = node
            }
            
            reader.readAsDataURL(file)
        }
    })

    setTimeout(() => {
        goHome()
    }, 1);
})

onMounted(() => {
    update()
})
</script>

<template>
    <div class="flex bg-[var(--color-element)] border border-[var(--color-border)] text-[var(--color-text)] rounded-xl cursor-pointer relative z-10">
        <button
            class="flex cursor-pointer items-center px-1.5 m-1 select-none hover:bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg transition-colors duration-100 ease-in-out hover:duration-0"
            @click="deleteSelectedNodes"
        >
            <span class="material-symbols-outlined text-[var(--color-text-alt)] block"> delete </span>
        </button>

        <button
            class="flex cursor-pointer items-center px-1.5 m-1 select-none hover:bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg transition-colors duration-100 ease-in-out hover:duration-0"
            @click="importImage"
            >
            <span class="material-symbols-outlined text-[var(--color-text-alt)] block"> add_photo_alternate </span>

            <input type="file" class="hidden" ref="filePicker"></input>
        </button>

        <button
            class="flex cursor-pointer items-center px-1.5 m-1 select-none hover:bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg transition-colors duration-100 ease-in-out hover:duration-0"
            @click="goHome"
        >
            <span class="material-symbols-outlined text-[var(--color-text-alt)] block"> home </span>
        </button>
    </div>
</template>

<style scoped></style>
