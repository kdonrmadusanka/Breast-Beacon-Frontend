// src/types/cornerstone-types.d.ts

declare module "cornerstone-core" {
  export interface Image {
    photometricInterpretation: any;
    imageId: string;
    minPixelValue: number;
    maxPixelValue: number;
    slope: number;
    intercept: number;
    windowCenter: number;
    windowWidth: number;
    render: any;
    getPixelData: () => Uint8Array | Int16Array | Uint16Array;
    rows: number;
    columns: number;
    height: number;
    width: number;
    color: boolean;
    columnPixelSpacing: number;
    rowPixelSpacing: number;
    invert: boolean;
    sizeInBytes: number;
  }

  export interface Viewport {
    scale: number;
    translation: {
      x: number;
      y: number;
    };
    voi: {
      windowWidth: number;
      windowCenter: number;
    };
    invert: boolean;
    pixelReplication: boolean;
    rotation: number;
    hflip: boolean;
    vflip: boolean;
    colormap?: string;
  }

  export interface LayerOptions {
    opacity?: number;
    viewport?: Partial<Viewport>;
  }

  export function enable(element: HTMLElement): Promise<void>;
  export function disable(element: HTMLElement): void;
  export function loadImage(imageId: string): Promise<Image>;
  export function displayImage(
    element: HTMLElement,
    image: Image,
    viewport?: Viewport
  ): void;
  export function updateImage(
    element: HTMLElement,
    invalidated?: boolean
  ): void;
  export function getViewport(element: HTMLElement): Viewport | undefined;
  export function setViewport(element: HTMLElement, viewport: Viewport): void;
  export function addLayer(
    element: HTMLElement,
    image: Image,
    options?: LayerOptions
  ): string;
  export function removeLayer(element: HTMLElement, layerId: string): void;
  export function reset(element: HTMLElement): void;
  export function resize(element: HTMLElement, forcedResize?: boolean): void;

  export function getImage(element: HTMLDivElement) {
    throw new Error("Function not implemented.");
  }
}

declare module "cornerstone-wado-image-loader" {
  export interface External {
    cornerstone: any;
    dicomParser: any;
  }

  export interface TaskConfiguration {
    decodeTask?: {
      codecsPath?: string;
    };
  }

  export interface Configuration {
    webWorkerPath?: string;
    taskConfiguration?: TaskConfiguration;
  }

  export const external: External;
  export function configure(config: Configuration): void;
}

declare module "cornerstone-tools" {
  export interface InitConfiguration {
    showSVGCursors?: boolean;
  }

  export interface ToolConfiguration {
    minScale?: number;
    maxScale?: number;
  }

  export interface ToolState {
    uuid?: string;
    handles?: {
      start?: { x: number; y: number; highlight: boolean; active: boolean };
      end?: { x: number; y: number; highlight: boolean; active: boolean };
    };
    cachedStats?: any;
    color?: string;
    text?: string;
  }

  export interface MouseButtonMask {
    mouseButtonMask: number;
  }

  export function init(config?: InitConfiguration): void;
  export function addTool(tool: any, configuration?: ToolConfiguration): void;
  export function setToolActive(
    toolName: string,
    options?: MouseButtonMask
  ): void;
  export function addToolState(
    element: HTMLElement,
    toolName: string,
    state: ToolState
  ): void;
  export function getToolState(
    element: HTMLElement,
    toolName: string
  ): ToolState[] | undefined;

  // Tool exports
  export const ZoomTool: any;
  export const WwwcTool: any;
  export const RectangleRoiTool: any;

  export function PanTool(PanTool: any) {
    throw new Error("Function not implemented.");
  }

  export function LengthTool(LengthTool: any) {
    throw new Error("Function not implemented.");
  }
}

declare module "dicom-parser" {
  export interface DataSet {
    byteArray: Uint8Array;
    elements: any;
  }

  export function parseDicom(byteArray: Uint8Array): DataSet;
}
