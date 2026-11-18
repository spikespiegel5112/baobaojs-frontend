// troika-three-text 未在 package.json 中声明 types 字段，且自带的 dist/types 不会
// 被 TypeScript 自动加载，这里补充项目需要的最小类型声明。
declare module "troika-three-text" {
  import { Mesh } from "three";

  export class Text extends Mesh {
    text: string;

    font: string | null;

    fontSize: number;

    fontWeight: string | number;

    fontStyle: string;

    letterSpacing: number;

    lineHeight: number | string;

    maxWidth: number;

    textAlign: string;

    whiteSpace: string;

    overflowWrap: string;

    color: string | number;

    anchorX: number | string;

    anchorY: number | string;

    outlineWidth: number | string;

    outlineColor: string | number;

    outlineOpacity: number;

    outlineBlur: number | string;

    outlineOffsetX: number | string;

    outlineOffsetY: number | string;

    depthOffset: number;

    sdfGlyphSize: number;

    textRenderInfo: unknown;

    sync(callback?: () => void): void;

    dispose(): void;
  }
}
