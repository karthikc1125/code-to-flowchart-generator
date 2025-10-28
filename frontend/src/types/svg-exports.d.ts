declare module 'save-svg-as-png' {
  export function svgAsPngUri(
    el: SVGElement,
    options?: {
      scale?: number;
      backgroundColor?: string;
      encoderType?: string;
      encoderOptions?: number;
    }
  ): Promise<string>;
}

declare module 'svg2pdf.js' {
  export function svg2pdf(
    svg: SVGElement,
    pdf: any,
    options?: {
      x?: number;
      y?: number;
      width?: number;
      height?: number;
      preserveAspectRatio?: string;
    }
  ): void;
}


