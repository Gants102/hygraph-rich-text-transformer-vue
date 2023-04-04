import { RichTextProps } from './types';

//import { IFrame, Image, Video, Class, Link, Audio } from './elements';
import { Image } from './elements';

function FallbackForCustomAsset({ mimeType }: { mimeType: string }) {
  if (__DEV__) {
    console.warn(
      `[@graphcms/rich-text-html-renderer]: Unsupported mimeType encountered: ${mimeType}. You need to write your renderer to render it since we are not opinionated about how this asset should be rendered (check our docs for more info).`
    );
  }

  return ``;
}

export const defaultElements: Required<RichTextProps['renderers']> = {
  a: Link,
  class: Class,
  video: Video,
  img: Image,
  iframe: IFrame,
  blockquote: ({ children }) => { return {type: 'blockquote', props: {}, content: children} },
  ul: ({ children }) =>{ return {type: 'ul', props: {}, content: children} },
  ol: ({ children }) => { return {type: 'ol', props: {}, content: children} },
  li: ({ children }) => { return {type: 'li', props: {}, content: children} },
  p: ({ children }) => { return {type: 'p', props: {}, content: children} },
  h1: ({ children }) => { return {type: 'h1', props: {}, content: children} },
  h2: ({ children }) => { return {type: 'h2', props: {}, content: children} },
  h3: ({ children }) => { return {type: 'h3', props: {}, content: children} },
  h4: ({ children }) => { return {type: 'h4', props: {}, content: children} },
  h5: ({ children }) => { return {type: 'h5', props: {}, content: children} },
  h6: ({ children }) => { return {type: 'h6', props: {}, content: children} },
  table: ({ children }) => { return {type: 'table', props: {}, content: children} },
  table_head: ({ children }) => { return {type: 'thead', props: {}, content: children} },
  table_body: ({ children }) => { return {type: 'tbody', props: {}, content: children} },
  table_row: ({ children }) => { return {type: 'tr', props: {}, content: children} },
  table_cell: ({ children }) => { return {type: 'td', props: {}, content: children} },
  table_header_cell: ({ children }) => { return {type: 'th', props: {}, content: children} },
  bold: ({ children }) => { return {type: 'b', props: {}, text: children} },
  italic: ({ children }) => { return {type: 'i', props: {}, text: children} },
  underline: ({ children }) => { return {type: 'u', props: {}, text: children} },
  code: ({ children }) => { return {type: 'code', props: {}, text: children} },
  code_block: ({ children }) =>
    `<pre
      style="
        white-space: pre;
        word-wrap: break-word;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        font-family: monospace;
      "
    >
      ${children}
    </pre>`,
  list_item_child: ({ children }) => { return {type: 'list-item-child', props: {}, content: children} },
  Asset: {
    audio: Audio,
    image: props => Image({ ...props, src: props.url }),
    video: props => Video({ ...props, src: props.url }),
    font: FallbackForCustomAsset,
    application: FallbackForCustomAsset,
    model: FallbackForCustomAsset,
    text: FallbackForCustomAsset,
  },
  embed: {},
  link: {},
};
