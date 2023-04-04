<script lang="ts">
import { NuxtLink } from '~~/.nuxt/components'
export default {
  props: {
    content: Array,
    references: Object,
  },
}
    
</script>

<template>
    <template v-for="(item, index) in content" :key="index">
        <NuxtImg
            v-if="item.type == 'image'"
            :src="item.src"
            :title="item.title"
            sizes="sm:100vw md:50vw lg:400px"
        >
        </NuxtImg>
        <NuxtLink v-else-if="item.type =='NuxtLink'"  :to="'/'+item.props.to+'/'">
            {{ item.content[0].text }}
        </NuxtLink>
        <template  v-else-if="item.type == 'list-item-child' && Array.isArray(item.content)">
            <rich-text-renderer :content="item.content" :references="references"></rich-text-renderer>
        </template>
        <component  v-else-if="item.type && Array.isArray(item.content)" :is="item.type">
            <rich-text-renderer :content="item.content" :references="references"></rich-text-renderer>
        </component>
        <component v-else-if="!Array.isArray(item.content) && item.type" :is="item.type">{{ item.content }}</component>
        <template v-else>{{ item.content }}</template>
        
         
    </template>
</template>
