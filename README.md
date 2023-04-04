# hygraph-rich-text-transformer-vue
WIP a very rough and ready hack to transform rich text responses to vue componenets

If you want to try and use in Nuxt 3 create a folder in you main directory with all files bar the `RichTextRenderer.vue` file and then put the vue file in your components folder. As an example, use the following code in your script tag where you want to use the `richTextRendere.vue` file and bind `rtr` to `content`:

```
const rtr = vueRender({
        content,
        references,
        renderers: {
            bold: (props) =>{ const obj = {type:'b',  props:{class:"bold"}, content: props.children.text}; return obj },
            Asset: {
                application: () => `<div><p>Asset</p></div>`,
                text: () => `<div><p>text plain</p></div>`,
            },
            link: {
                Page: ({ slug, children }) => {
                    return {type: "NuxtLink", props: {to: slug}, content: children } ;
                },
            },
        }
    })
    ```
