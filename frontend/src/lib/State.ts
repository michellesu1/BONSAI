import { onMounted, ref, type Ref } from 'vue'
import { generateImage, generateImageDalle2, generateImageDalle3, mergeImages, modifyImage } from './OpenAI'
import { generateImage as generateImageLocal } from './Local'

export type Node = { x: number; y: number; image: string; id: string; backlinks: string[]; pointsTo: string[] }

export const nodes: Ref<Node[]> = ref([
    {
        x: 100,
        y: 200,
        image: './public/dog.png',
        id: '1',
        backlinks: [],
        pointsTo: ['2', '3'],
    },
    {
        x: 500,
        y: 400,
        image: './public/dog_hat.png',
        id: '2',
        backlinks: ['1'],
        pointsTo: ['6'],
    },
    {
        x: 300,
        y: 200,
        image: './public/doge_blue.png',
        id: '3',
        backlinks: ['1'],
        pointsTo: [],
    },
    {
        x: 500,
        y: 200,
        image: './public/dog2.png',
        id: '4',
        backlinks: [],
        pointsTo: ['5'],
    },
    {
        x: 500,
        y: 500,
        image: './public/dog2_red.png',
        id: '5',
        backlinks: ['4'],
        pointsTo: ['6'],
    },
    {
        x: 300,
        y: 300,
        image: './public/dog_red_hat.png',
        id: '6',
        backlinks: ['5', '2'],
        pointsTo: [],
    }
])

export const nodeLookup: Record<string, Node> = {
    '1': nodes.value[0],
    '2': nodes.value[1],
    '3': nodes.value[2],
    '4': nodes.value[3],
    '5': nodes.value[4],
    '6': nodes.value[5],
}

export const selectedNodes: Ref<Node[]> = ref([])

export function isNodeSelected(node: Node) {
    return selectedNodes.value.find(otherNode => otherNode.id === node.id) !== undefined
}

export function selectNode(node: Node) {
    if (isNodeSelected(node)) return

    if (selectedNodes.value.length === 16) return

    selectedNodes.value.push(node)
    selectedNodes.value = [...selectedNodes.value]
}

export function deselectNode(node: Node) {
    if (!isNodeSelected(node)) return

    selectedNodes.value.splice(
        selectedNodes.value.findIndex(otherNode => otherNode.id === node.id),
        1
    )
    selectedNodes.value = [...selectedNodes.value]
}

export function toggleNodeSelected(node: Node) {
    if (isNodeSelected(node)) {
        deselectNode(node)
    } else {
        selectNode(node)
    }
}

export async function addNewNode(prompt: string, backlinks: string[], locationX: number, locationY: number) {
    const id = Math.random().toString()
    const node = {
        x: locationX,
        y: locationY,
        image: null,
        id,
        backlinks: backlinks,
        pointsTo: [],
    }

    nodes.value.push(node)
    nodeLookup[id] = node
    for (const backlink of backlinks) {
        nodeLookup[backlink].pointsTo.push(id)
    }

    if (backlinks.length === 0) {
        if (selectedModel.value === 'sdxl-lightning') {
            node.image = await generateImageLocal(prompt)
        } else if (selectedModel.value === 'dall-e-3') {
            node.image = await generateImageDalle3(prompt)
        } else if (selectedModel.value === 'dall-e-2') {
            node.image = await generateImageDalle2(prompt)
        } else if (selectedModel.value === 'dummy') {
            node.image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQykzoZeCE0p7LeuyHnLYCdPP2jju9d5PaMeA&s'
        } else {
            node.image = await generateImage(prompt)
        }
    } else if (backlinks.length == 1) {
        if (selectedModel.value === 'dummy') {
            node.image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQykzoZeCE0p7LeuyHnLYCdPP2jju9d5PaMeA&s'
        } else {
            node.image = await modifyImage(nodeLookup[backlinks[0]].image, prompt)
        }
    } else {
        if (selectedModel.value === 'dummy') {
            node.image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQykzoZeCE0p7LeuyHnLYCdPP2jju9d5PaMeA&s'
        } else {
            node.image = await mergeImages(
                backlinks.map(backlink => nodeLookup[backlink].image),
                prompt
            )
        }
    }
}

export function deleteNode(node: Node) {
    delete nodeLookup[node.id]

    for (const otherNode of nodes.value) {
        if (otherNode.backlinks.includes(node.id)) otherNode.backlinks.splice(otherNode.backlinks.indexOf(node.id), 1)
        if (otherNode.pointsTo.includes(node.id)) otherNode.pointsTo.splice(otherNode.pointsTo.indexOf(node.id), 1)
    }

    nodes.value.splice(
        nodes.value.findIndex(otherNode => otherNode.id === node.id),
        1
    )

    nodes.value = [...nodes.value]

    if (isNodeSelected(node)) deselectNode(node)
}

export function deleteSelectedNodes() {
    const nodesToDelete = [...selectedNodes.value]

    for (const node of nodesToDelete) {
        deleteNode(node)
    }

    console.log(nodes.value)
}

export const viewOffsetX = ref(0)
export const viewOffsetY = ref(0)

export const selectedModel = ref('gpt-image-1')
