import {
    ElementNode,
    elementTypeKeys,
    EmbedReferences,
    isElement,
    isEmpty,
    isText,
    Node,
    EmptyElementsToRemove,
    Text,
    RichTextContent,
  } from '@graphcms/rich-text-types';
  import escapeHtml from 'escape-html';
  const escape =  escapeHtml
  import { defaultElements } from './defaultElements';
  import { RichTextProps, NodeRendererType } from './types';
  
  type RenderText = {
    textNode: Text;
    renderers?: RichTextProps['renderers'];
    shouldSerialize: boolean | null;
  };
  
  function renderText({ textNode, renderers }: RenderText) {
    const { text, bold, italic, underline, code } = textNode;
  
    const escapedText = escape(text);
    let parsedText = textNode
  
    const Bold: NodeRendererType['bold'] = renderers?.['bold'];
    const Italic: NodeRendererType['italic'] = renderers?.['italic'];
    const Underline: NodeRendererType['underline'] = renderers?.['underline'];
    const Code: NodeRendererType['code'] = renderers?.['code'];
  
    if (bold && Bold) {
      return parsedText = Bold({ children: parsedText });
      
    }
  
    if (italic && Italic) {
      parsedText = Italic({ children: parsedText });
    }
  
    if (underline && Underline) {
      parsedText = Underline({ children: parsedText });
    }
  
    if (code && Code) {
      parsedText = Code({ children: parsedText });
    }
    
    return {content: parsedText.text};
  }

  function renderFunction(node, renderers, references ){
    const isEmbed = node?.nodeId && node.nodeType;
    const referenceValues = isEmbed
            ? references?.filter(ref => ref.id === node.nodeId)[0]
            : null;
    if (isText(node)) {
    
      const shouldSerialize = parent && isElement(parent) && parent.type !== 'code-block';
      return renderText({
        shouldSerialize,
        textNode: node,
        renderers,
      })             
    }else if (node.type == 'link') {
      const element = renderers?.link[node.nodeType]
      const renderedElement = element({ children: node.children, slug: referenceValues.slug });
      return renderedElement
    }
    else if (node.type == 'image') {
      const element = node;
      return element
    }else if(node.type){
      const renderEl = renderers?.[elementTypeKeys[node.type] as keyof RichTextProps['renderers']]
      return renderEl({children: renderInnerNodes({innerNode: node.children, references, renderers})})
      
    }
  }
  
  type renderInnerNodes = {
    innerNode: Array<object>;
    renderers: NodeRendererType;
    references?: EmbedReferences;
    renderFunction: Function,
  };
  
  function renderInnerNodes({
    innerNode,
    references,
    renderers,
  }: renderInnerNodes): object {
    const obj = []
    innerNode.forEach(node=>{
      const element = renderFunction(node, renderers, references)
      obj.push(element)
      return element
    })
    return obj
  }
  
  
  type RenderElements = {
    content: RichTextContent;
    references?: EmbedReferences;
    renderers: NodeRendererType;
    parent?: Node | null;
  };
  
  function renderElements({
    content,
    references,
    parent,
    renderers,
  }: RenderElements) {
      return renderInnerNodes({
        innerNode: content.children,
        renderers,
        references,
        renderFunction,
      });
  }
  
  export function vueRender({
    renderers: resolvers,
    content,
    references,
  }: RichTextProps): Array<object> {
    const assetRenderers = {
      ...defaultElements?.Asset,
      ...resolvers?.Asset,
    };
  
    const renderers: NodeRendererType = {
      ...defaultElements,
      ...resolvers,
      Asset: assetRenderers,
    };
  
    if (//__DEV__ &&
       !content) {
      console.error(`[@graphcms/rich-text-html-renderer]: content is required.`);
  
      return ``;
    }
  
    if (//__DEV__ && 
      !Array.isArray(content) && !content.children) {
      console.error(
        `[@graphcms/rich-text-html-renderer]: children is required in content.`
      );
  
      return ``;
    }
  
  
    return renderElements({
      content,
      references,
      renderers
    });
  }
  
  export * from './types';
