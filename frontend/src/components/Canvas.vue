<script lang="ts" setup>
import { onMounted, ref, type Ref } from 'vue'
import gridImage from '../assets/grid.png'
import { type Node, nodes, nodeLookup, viewOffsetX, viewOffsetY, isNodeSelected, toggleNodeSelected } from '../lib/State'

const container: Ref<HTMLDivElement> = ref(null) as any
const canvas: Ref<HTMLCanvasElement> = ref(null) as any

let lastMouseX = 0
let lastMouseY = 0
let isMouseDown = false

const expandedImage = ref<string | null>(null)

function render() {
    const ctx = canvas.value.getContext('2d')

    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

    ctx.lineWidth = 1
    ctx.strokeStyle = '#4C4C44'
    ctx.fillStyle = '#4C4C44'
    var diffX, diffY, diffDist
    for (const node of nodes.value) {
        for (const connection of node.pointsTo) {
            // try {
            const otherNode = nodeLookup[connection]

            ctx.beginPath()
            ctx.moveTo(node.x + viewOffsetX.value + 50, node.y + viewOffsetY.value + 50)
            ctx.lineTo(otherNode.x + viewOffsetX.value + 50, otherNode.y + viewOffsetY.value + 50)
            ctx.stroke()

            diffX = otherNode.x - node.x
            diffY = otherNode.y - node.y
            diffDist = Math.sqrt(diffX * diffX + diffY * diffY)

            ctx.beginPath()

            ctx.moveTo(
                node.x + diffX / 2 + viewOffsetX.value + 50 + (diffX * 10) / diffDist,
                node.y + diffY / 2 + viewOffsetY.value + 50 + (diffY * 10) / diffDist
            )

            ctx.lineTo(
                node.x + diffX / 2 - (diffY * 8) / diffDist + viewOffsetX.value + 50,
                node.y + diffY / 2 + (diffX * 8) / diffDist + viewOffsetY.value + 50
            )

            ctx.lineTo(
                node.x + diffX * 0.5 + (diffY * 8) / diffDist + viewOffsetX.value + 50,
                node.y + diffY / 2 - (diffX * 8) / diffDist + viewOffsetY.value + 50
            )
            ctx.closePath()
            ctx.fill()
            // } catch {
            //     console.log(nodes.value)
            //     console.log(connection)
            //     console.log(nodeLookup[connection])

            //     throw new Error('stop')
            // }
        }
    }
}

function mouseDown(event: MouseEvent) {
    lastMouseX = event.clientX
    lastMouseY = event.clientY

    isMouseDown = true
}

function mouseMove(event: MouseEvent) {
    if (!isMouseDown) return

    const mouseX = event.clientX
    const mouseY = event.clientY

    const deltaX = mouseX - lastMouseX
    const deltaY = mouseY - lastMouseY

    lastMouseX = mouseX
    lastMouseY = mouseY

    viewOffsetX.value += deltaX
    viewOffsetY.value += deltaY

    render()
}

function mouseUp(event: MouseEvent) {
    isMouseDown = false
}

let lastTime = Date.now()

const repulsion = 10000
const repulsionPower = 2
const attraction = 2 / 10000
const attractionPower = 1
const linkedAttractionMultiplier = 3

function update() {
    const now = Date.now()
    const deltaTime = Math.min((now - lastTime) / 1000, 0.2)
    lastTime = now

    for (const node of nodes.value) {
        let forceX = 0
        let forceY = 0

        for (const otherNode of nodes.value) {
            if (otherNode.id === node.id) continue

            const distance = Math.sqrt(Math.pow(otherNode.x - node.x, 2) + Math.pow(otherNode.y - node.y, 2))

            forceX += ((node.x - otherNode.x) / Math.pow(distance, repulsionPower)) * repulsion
            forceY += ((node.y - otherNode.y) / Math.pow(distance, repulsionPower)) * repulsion

            forceX +=
                -((node.x - otherNode.x) * Math.pow(distance, attractionPower)) *
                attraction *
                (node.backlinks.includes(otherNode.id) || node.pointsTo.includes(otherNode.id) ? linkedAttractionMultiplier : 1)
            forceY +=
                -((node.y - otherNode.y) * Math.pow(distance, attractionPower)) *
                attraction *
                (node.backlinks.includes(otherNode.id) || node.pointsTo.includes(otherNode.id) ? linkedAttractionMultiplier : 1)
        }

        node.x += forceX * deltaTime
        node.y += forceY * deltaTime
    }

    render()

    requestAnimationFrame(update)
}

onMounted(() => {
    new ResizeObserver(() => {
        const width = container.value.offsetWidth
        const height = container.value.offsetHeight
        canvas.value.width = width
        canvas.value.height = height

        render()
    }).observe(container.value)

    update()
})

function openBig(node?: Node) {
    if (!node) {
        return
    }

    const img = node.image
    if (!img) {
        return
    }
    expandedImage.value = img
}

function closeExpanded() {
    expandedImage.value = null
}
</script>

<template>
    <div class="bg-[var(--color-background)] overflow-hidden" ref="container">
        <div
            class="relative grid"
            :style="{
                background: `url(${gridImage})`,
                'image-rendering': 'crisp-edges',
                left: `${(viewOffsetX % 24) - 24}px`,
                top: `${(viewOffsetY % 24) - 24}px`,
            }"
            @mousedown="mouseDown"
            @mousemove="mouseMove"
            @mouseup="mouseUp"
        ></div>

        <canvas class="absolute top-0 left-0 w-full h-full pointer-events-none" ref="canvas" />

        <div
            v-for="node in nodes"
            :key="node.id"
            class="absolute w-24 h-24 border bg-[var(--color-element)] rounded-xl transition-[border] duration-100 ease-in-out"
            :class="{
                'border-[var(--color-border)]': !isNodeSelected(node),
                'border-[var(--color-accent)] scale-105': isNodeSelected(node),
            }"
            :style="{
                left: `${viewOffsetX + node.x}px`,
                top: `${viewOffsetY + node.y}px`,
            }"
            @click="node.image !== null ? toggleNodeSelected(node) : undefined"
            @click.middle="openBig(node)"
            @click.right.prevent="openBig(node)"
        >
            <div v-if="node.image === null" class="w-full h-full flex items-center justify-center">
                <div class="spinner" />
            </div>

            <img v-if="node.image !== null" class="w-full h-full object-cover select-none rounded-xl" :src="node.image" draggable="false" />
        </div>

        <!-- Expanded Image Modal -->
        <div v-if="expandedImage" class="modal-overlay" @click.self="closeExpanded">
            <button class="close-button" @click="closeExpanded">X</button>
            <img :src="expandedImage" class="modal-image" />
        </div>
        <!-- End Expanded Image Modal -->
    </div>
</template>

<style scoped>
.grid {
    width: calc(100% + 48px);
    height: calc(100% + 48px);
}

.spinner {
    margin: 0.1rem;
    margin-top: 0.3rem;
    margin-bottom: 0.3rem;
    width: 2rem;
    height: 2rem;
    border: 2px solid var(--color-border);
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s ease infinite;
}

@keyframes rotation {
    0% {
        transform: rotate(90deg);
    }
    100% {
        transform: rotate(450deg);
    }
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.close-button {
    position: absolute;
    top: 2rem;
    right: 2rem;
    background: none;
    border: none;
    color: rgb(185, 185, 185);
    font-size: 2rem;
    cursor: pointer;
}

.modal-image {
    max-width: 90%;
    max-height: 90%;
    border-radius: 0.5rem;
}
</style>
