import { create } from "zustand";
import { parseDICOMFile, type DICOMImage } from "../lib/dicom/dicomParser";

interface DICOMState {
  currentImage: DICOMImage | null;
  isLoading: boolean;
  error: string | null;
  viewportSettings: {
    windowWidth: number;
    windowCenter: number;
    invert: boolean;
    scale: number;
    brightness: number;
    contrast: number;
  };
  actions: {
    setInvert(arg0: boolean): unknown;
    setWindowWidth(windowWidth: number): unknown;
    setWindowCenter(windowCenter: any): unknown;
    setCurrentImage: (image: DICOMImage | null) => void;
    setError: (error: string | null) => void;
    loadDICOM: (file: File) => Promise<void>;
    adjustWindowLevel: (width: number, center: number) => void;
    toggleInvert: () => void;
    setScale: (scale: number) => void;
    setBrightness: (brightness: number) => void;
    setContrast: (contrast: number) => void;
    resetViewport: () => void;
    clearError: () => void;
  };
}

export const useDICOMStore = create<DICOMState>((set, get) => ({
  currentImage: null,
  isLoading: false,
  error: null,
  viewportSettings: {
    windowWidth: 2000,
    windowCenter: 1000,
    invert: false,
    scale: 1,
    brightness: 100,
    contrast: 100,
  },
  actions: {
    setCurrentImage: (image) =>
      set({
        currentImage: image,
        viewportSettings: {
          ...get().viewportSettings,
          windowWidth: image?.windowWidth || 2000,
          windowCenter: image?.windowCenter || 1000,
        },
      }),
    setError: (error) => set({ error }),
    loadDICOM: async (file) => {
      set({ isLoading: true, error: null });
      try {
        const dicomData = await parseDICOMFile(file);
        set({
          currentImage: dicomData,
          isLoading: false,
          viewportSettings: {
            ...get().viewportSettings,
            windowWidth: dicomData.windowWidth || 2000,
            windowCenter: dicomData.windowCenter || 1000,
          },
        });
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : "Unknown error occurred",
          isLoading: false,
          currentImage: null,
        });
      }
    },
    adjustWindowLevel: (width, center) =>
      set((state) => ({
        viewportSettings: {
          ...state.viewportSettings,
          windowWidth: width,
          windowCenter: center,
        },
      })),
    toggleInvert: () =>
      set((state) => ({
        viewportSettings: {
          ...state.viewportSettings,
          invert: !state.viewportSettings.invert,
        },
      })),
    setScale: (scale) =>
      set((state) => ({
        viewportSettings: {
          ...state.viewportSettings,
          scale: Math.max(0.1, Math.min(5, scale)),
        },
      })),
    setBrightness: (brightness) =>
      set((state) => ({
        viewportSettings: {
          ...state.viewportSettings,
          brightness: Math.max(0, Math.min(200, brightness)),
        },
      })),
    setContrast: (contrast) =>
      set((state) => ({
        viewportSettings: {
          ...state.viewportSettings,
          contrast: Math.max(0, Math.min(200, contrast)),
        },
      })),
    resetViewport: () =>
      set((state) => ({
        viewportSettings: {
          ...state.viewportSettings,
          windowWidth: state.currentImage?.windowWidth || 2000,
          windowCenter: state.currentImage?.windowCenter || 1000,
          invert: false,
          scale: 1,
          brightness: 100,
          contrast: 100,
        },
      })),
    clearError: () => set({ error: null }),
  },
}));
