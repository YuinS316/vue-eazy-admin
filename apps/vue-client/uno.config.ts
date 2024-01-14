import { defineConfig, presetUno, presetAttributify } from 'unocss';
import presetRemToPx from '@unocss/preset-rem-to-px';

export default defineConfig({
  theme: {
    colors: {
      ezGrey: 'rgb(224, 224, 230)',
    },
  },
  rules: [
    [
      'ez-border',
      {
        border: '1px solid rgb(224, 224, 230)',
        'border-radius': '3px',
      },
    ],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetRemToPx({ baseFontSize: 4 }),
  ],
  shortcuts: [
    ['wh-full', 'w-full h-full'],
    ['f-c-c', 'flex justify-center items-center'],
    ['ez-border-b', 'border-0 border-b border-b-solid border-b-ezGrey'],
  ],
});
