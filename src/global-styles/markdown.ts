import {createElement} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {Palette} from './palette';
import {Dimensions} from './dimens';
import {Typography as Typ} from './typography';
import createMarkdownRenderer from 'rn-markdown';

const Markdown = createMarkdownRenderer({gfm: true});

Markdown.renderer.container = View;

Markdown.renderer.blockquote = ({markdown, ...props}: any) => {
  return createElement(View, {style: styles.blockquote}, props.children);
};

Markdown.renderer.image = ({markdown, ...props}: any) => {
  return createElement(Image, {
    source: {uri: markdown.href},
    style: {
      width: 320,
      height: 240,
      backgroundColor: Palette.indigo1,
      resizeMode: 'cover',
    },
  });
};

Markdown.renderer.code = ({markdown, ...props}: any) => {
  const inline = !markdown.children;
  if (inline) {
    return createElement(Text, {style: styles.inline_code}, markdown.text);
  } else {
    return createElement(Text, {style: styles.code}, props.children);
  }
};

const styles = StyleSheet.create({
  blockquote: {
    backgroundColor: Palette.brand.textWeakBackground,
    borderLeftWidth: 3,
    borderLeftColor: Palette.gray5,
    paddingLeft: Dimensions.horizontalSpaceSmall,
    paddingRight: 1,
  },

  code: {
    backgroundColor: Palette.brand.textWeakBackground,
    color: Palette.brand.textWeak,
    fontSize: Typ.fontSizeSmall,
    fontWeight: 'normal',
    fontFamily: 'monospace',
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 2,
  },

  inline_code: {
    backgroundColor: Palette.brand.textWeakBackground,
    color: Palette.brand.textWeak,
    paddingLeft: 4,
    paddingRight: 4,
    borderRadius: 2,
    fontFamily: 'monospace',
  },
});

export default Markdown;

export const markdownStyles = {
  blockquote: {},

  code: {
    color: Palette.brand.textWeak,
    fontSize: Typ.fontSizeSmall,
    fontWeight: 'normal',
    fontFamily: 'monospace',
  },

  em: {
    fontStyle: 'italic',
  },

  heading: {
    fontWeight: 'bold',
  },

  heading1: {
    fontSize: Typ.baseSize * Typ.scaleUp * Typ.scaleUp * Typ.scaleUp,
  },

  heading2: {
    fontSize: Typ.baseSize * Typ.scaleUp * Typ.scaleUp,
  },

  heading3: {
    fontSize: Typ.baseSize * Typ.scaleUp,
  },

  heading4: {
    fontSize: Typ.baseSize,
  },

  heading5: {
    fontSize: Typ.baseSize * Typ.scaleDown,
  },

  heading6: {
    fontSize: Typ.baseSize * Typ.scaleDown * Typ.scaleDown,
  },

  hr: {
    backgroundColor: Palette.gray4,
    height: 2,
  },

  image: {
    width: 640,
    height: 480,
  },

  link: {
    textDecorationLine: 'underline',
  },

  list: {
    paddingLeft: Dimensions.horizontalSpaceSmall,
    paddingRight: Dimensions.horizontalSpaceSmall,
  },

  list_item_bullet: {
    fontSize: 20,
    lineHeight: 20,
    marginTop: 6,
    color: Palette.brand.text,
  },

  list_item_number: {
    fontWeight: 'bold',
  },

  paragraph: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: Dimensions.verticalSpaceSmall,
    marginBottom: Dimensions.verticalSpaceSmall,
  },

  text: {
    color: Palette.brand.text,
  },

  video: {
    width: 300,
    height: 300,
  },
};
