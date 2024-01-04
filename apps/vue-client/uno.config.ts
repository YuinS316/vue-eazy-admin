import { defineConfig, presetUno, presetAttributify } from "unocss";
import presetRemToPx from "@unocss/preset-rem-to-px";

export default defineConfig({
  rules: [],
  presets: [
    presetUno(),
    presetAttributify(),
    presetRemToPx({ baseFontSize: 4 }),
  ],
});
