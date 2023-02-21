<script setup lang="ts">
  import { ref } from 'vue'
  import JsonEditorVue from 'json-editor-vue'

  const plainDataRef = ref({ pippo: 'aaaa' })
</script>

<template>
  <div>
    <!--------------------->
    <!--   JSON  editor  -->
    <!--------------------->
    <json-editor-vue ref="jsonEditorComponentRef" :source="plainDataRef" />
  </div>
</template>
