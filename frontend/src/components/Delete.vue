<script setup lang="ts">
// Delete.vue
// This component displays a floating "Delete" button next to the selected node.
// To integrate, Canvas.vue must provide the following via Vue's provide/inject API:
//   - 'selectedNode': a ref to the currently selected node object (or null)
//   - 'deleteSelectedNode': a function to delete the selected node
//   - 'viewOffsetX', 'viewOffsetY': refs for the current canvas offset (for button positioning)

import { inject } from 'vue'

// Inject dependencies from parent (Canvas.vue)
const selectedNode = inject<any>('selectedNode')
const deleteSelectedNode = inject<() => void>('deleteSelectedNode')
const viewOffsetX = inject<any>('viewOffsetX')
const viewOffsetY = inject<any>('viewOffsetY')
</script>

<template>
  <!--
    The Delete button appears only when a node is selected.
    It is positioned near the selected node using its coordinates and the canvas offset.
    Clicking the button calls deleteSelectedNode to remove the node from the graph.
  -->
  <button
    v-if="selectedNode"
    @click="deleteSelectedNode"
    class="absolute z-20 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded transition-colors"
    :style="{
      left: `${viewOffsetX + selectedNode.x + 80}px`,
      top: `${viewOffsetY + selectedNode.y - 16}px`,
    }"
  >
    Delete
  </button>
</template>