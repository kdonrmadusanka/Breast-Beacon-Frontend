import { useEffect, useRef, useCallback, useState } from "react";
import { motion } from "framer-motion";
import {
  FiZoomIn,
  FiZoomOut,
  FiRotateCw,
  FiEye,
  FiEyeOff,
  FiSun,
  FiMoon,
  FiMonitor,
} from "react-icons/fi";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import * as cornerstoneTools from "cornerstone-tools";
import { Button } from "../components/ui/Index";
import { useDICOMStore } from "../store/dicomStore";
import dicomParser from "dicom-parser";

interface Region {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
}

interface MammogramVisualizerProps {
  imageUrl: string;
  maskUrl?: string;
  regions?: Region[];
}

const MAMMOGRAM_PRESETS = {
  default: { windowWidth: 2000, windowCenter: 1000 },
  highContrast: { windowWidth: 1000, windowCenter: 500 },
  lowContrast: { windowWidth: 4000, windowCenter: 2000 },
};

export const MammogramVisualizer: React.FC<MammogramVisualizerProps> = ({
  imageUrl,
  maskUrl = "",
  regions = [],
}) => {
  const { viewportSettings, actions } = useDICOMStore();
  const { windowWidth, windowCenter, invert, scale } = viewportSettings;
  const [showMask, setShowMask] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPreset, setCurrentPreset] =
    useState<keyof typeof MAMMOGRAM_PRESETS>("default");
  const [brightness, setBrightness] = useState<number>(0);
  const [contrast, setContrast] = useState<number>(1);

  const canvasRef = useRef<HTMLDivElement>(null);
  const maskLayerIdRef = useRef<string | null>(null);
  const isInitializedRef = useRef<boolean>(false);
  const isToolsInitializedRef = useRef<boolean>(false);

  const initializeCornerstone = useCallback(() => {
    if (isInitializedRef.current) return;

    try {
      cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
      cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
      cornerstoneWADOImageLoader.configure({
        webWorkerPath: "/webworkers/cornerstoneWADOImageLoaderWebWorker.js",
        taskConfiguration: {
          decodeTask: {
            codecsPath: "/codecs/cornerstoneWADOImageLoaderCodecs.js",
          },
        },
      });

      isInitializedRef.current = true;
    } catch (err) {
      console.error("Failed to initialize cornerstone:", err);
      setError("Failed to initialize DICOM viewer");
    }
  }, []);

  const setupTools = useCallback(() => {
    if (isToolsInitializedRef.current) return;

    try {
      cornerstoneTools.init({
        showSVGCursors: true, // This is the only valid configuration option
      });

      cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
      cornerstoneTools.addTool(cornerstoneTools.WwwcTool);
      cornerstoneTools.addTool(cornerstoneTools.PanTool);
      cornerstoneTools.addTool(cornerstoneTools.LengthTool);
      cornerstoneTools.addTool(cornerstoneTools.RectangleRoiTool);

      cornerstoneTools.setToolActive("Zoom", { mouseButtonMask: 1 });
      cornerstoneTools.setToolActive("Wwwc", { mouseButtonMask: 2 });
      cornerstoneTools.setToolActive("Pan", { mouseButtonMask: 4 });

      isToolsInitializedRef.current = true;
    } catch (err) {
      console.error("Failed to setup tools:", err);
    }
  }, []);

  const addRegions = useCallback((element: HTMLElement, regions: Region[]) => {
    if (regions.length === 0) return;

    try {
      regions.forEach((region, index) => {
        const confidence = Math.max(0, Math.min(1, region.confidence));
        const color =
          confidence > 0.7 ? "red" : confidence > 0.4 ? "yellow" : "green";

        cornerstoneTools.addToolState(element, "RectangleRoi", {
          uuid: `region-${index}`,
          handles: {
            start: {
              x: region.x,
              y: region.y,
              highlight: true,
              active: false,
            },
            end: {
              x: region.x + region.width,
              y: region.y + region.height,
              highlight: true,
              active: false,
            },
          },
          color: color,
          // Removed textBox property as it's not supported
        });
      });
      cornerstone.updateImage(element);
    } catch (err) {
      console.error("Failed to add regions:", err);
    }
  }, []);

  const applyImageEnhancements = useCallback(
    (element: HTMLElement) => {
      try {
        const viewport = cornerstone.getViewport(element);
        if (viewport) {
          const enhancedViewport = {
            ...viewport,
            voi: {
              windowWidth: windowWidth * contrast,
              windowCenter: windowCenter + brightness * 100,
            },
            invert: invert,
            scale: scale,
          };

          cornerstone.setViewport(element, enhancedViewport);
          cornerstone.updateImage(element);
        }
      } catch (err) {
        console.error("Failed to apply enhancements:", err);
      }
    },
    [windowWidth, windowCenter, invert, scale, brightness, contrast]
  );

  const loadAndDisplayImage = useCallback(async () => {
    const element = canvasRef.current;
    if (!element) return;

    try {
      setIsLoading(true);
      setError(null);

      await cornerstone.enable(element);
      const image = await cornerstone.loadImage(imageUrl);
      await cornerstone.displayImage(element, image);
      setupTools();

      // Apply initial settings
      const preset = MAMMOGRAM_PRESETS[currentPreset];
      actions.setWindowWidth(preset.windowWidth);
      actions.setWindowCenter(preset.windowCenter);

      applyImageEnhancements(element);

      // Load mask if available
      if (maskUrl && showMask) {
        try {
          const maskImage = await cornerstone.loadImage(maskUrl);
          maskLayerIdRef.current = cornerstone.addLayer(element, maskImage, {
            opacity: 0.4,
            viewport: {
              colormap: "hot",
              voi: {
                windowWidth: preset.windowWidth,
                windowCenter: preset.windowCenter,
              },
            },
          });
        } catch (maskError) {
          console.warn("Failed to load mask:", maskError);
        }
      }

      addRegions(element, regions);
      setIsLoading(false);
    } catch (err) {
      console.error("Image loading failed:", err);
      setError(err instanceof Error ? err.message : "Failed to load image");
      setIsLoading(false);
    }
  }, [
    imageUrl,
    maskUrl,
    showMask,
    regions,
    setupTools,
    addRegions,
    currentPreset,
    actions,
    applyImageEnhancements,
  ]);

  const updateViewport = useCallback(() => {
    const element = canvasRef.current;
    if (!element) return;

    try {
      applyImageEnhancements(element);
    } catch (err) {
      console.error("Failed to update viewport:", err);
    }
  }, [applyImageEnhancements]);

  const handlePresetChange = useCallback(
    (preset: keyof typeof MAMMOGRAM_PRESETS) => {
      setCurrentPreset(preset);
      const presetValues = MAMMOGRAM_PRESETS[preset];
      actions.setWindowWidth(presetValues.windowWidth);
      actions.setWindowCenter(presetValues.windowCenter);
    },
    [actions]
  );

  const handleBrightnessChange = useCallback((delta: number) => {
    setBrightness((prev) => Math.max(-10, Math.min(10, prev + delta)));
  }, []);

  const handleContrastChange = useCallback((delta: number) => {
    setContrast((prev) => Math.max(0.1, Math.min(3, prev + delta)));
  }, []);

  const handleReset = useCallback(() => {
    actions.resetViewport();
    setBrightness(0);
    setContrast(1);
    setCurrentPreset("default");

    const element = canvasRef.current;
    if (element) {
      try {
        const preset = MAMMOGRAM_PRESETS.default;
        const viewport = cornerstone.getViewport(element);
        if (viewport) {
          const resetViewport = {
            ...viewport,
            scale: 1,
            voi: {
              windowWidth: preset.windowWidth,
              windowCenter: preset.windowCenter,
            },
            invert: false,
          };
          cornerstone.setViewport(element, resetViewport);
          cornerstone.updateImage(element);
        }
      } catch (err) {
        console.error("Failed to reset viewport:", err);
      }
    }
  }, [actions]);

  const handleZoomIn = useCallback(() => {
    actions.setScale(Math.min(scale * 1.2, 10));
  }, [actions, scale]);

  const handleZoomOut = useCallback(() => {
    actions.setScale(Math.max(scale / 1.2, 0.1));
  }, [actions, scale]);

  const toggleMask = useCallback(() => {
    setShowMask((prev) => !prev);
    const element = canvasRef.current;
    if (element && maskLayerIdRef.current) {
      try {
        if (showMask) {
          cornerstone.removeLayer(element, maskLayerIdRef.current);
          maskLayerIdRef.current = null;
        } else {
          loadAndDisplayImage();
        }
      } catch (err) {
        console.error("Failed to toggle mask:", err);
      }
    }
  }, [showMask, loadAndDisplayImage]);

  const toggleInvert = useCallback(() => {
    actions.setInvert(!invert);
  }, [actions, invert]);

  useEffect(() => {
    initializeCornerstone();
  }, [initializeCornerstone]);

  useEffect(() => {
    loadAndDisplayImage();

    return () => {
      const element = canvasRef.current;
      if (element) {
        try {
          if (maskLayerIdRef.current) {
            cornerstone.removeLayer(element, maskLayerIdRef.current);
            maskLayerIdRef.current = null;
          }
          cornerstone.disable(element);
        } catch (err) {
          console.error("Cleanup error:", err);
        }
      }
    };
  }, [loadAndDisplayImage]);

  useEffect(() => {
    updateViewport();
  }, [updateViewport]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-[80vh] bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 font-medium mb-2">
            Error loading mammogram
          </p>
          <p className="text-red-500 dark:text-red-500 text-sm">{error}</p>
          <Button
            text="Retry"
            variant="outlined"
            size="small"
            onClick={() => {
              setError(null);
              loadAndDisplayImage();
            }}
            className="mt-4"
          />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="relative border rounded-lg overflow-hidden bg-black"
    >
      {/* Preset Controls */}
      <div className="absolute top-4 left-4 z-20 flex gap-2">
        {Object.keys(MAMMOGRAM_PRESETS).map((preset) => (
          <Button
            key={preset}
            text={preset.charAt(0).toUpperCase() + preset.slice(1)}
            variant={currentPreset === preset ? "filled" : "outlined"}
            size="small"
            onClick={() =>
              handlePresetChange(preset as keyof typeof MAMMOGRAM_PRESETS)
            }
            className="text-xs"
          />
        ))}
      </div>

      {/* Brightness/Contrast Controls */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <div className="bg-black/70 text-white px-3 py-1 rounded text-sm">
          <div className="flex items-center gap-2">
            <FiSun className="w-4 h-4" />
            <button
              onClick={() => handleBrightnessChange(-1)}
              className="px-1 hover:bg-white/20 rounded"
            >
              -
            </button>
            <span className="min-w-[2rem] text-center">{brightness}</span>
            <button
              onClick={() => handleBrightnessChange(1)}
              className="px-1 hover:bg-white/20 rounded"
            >
              +
            </button>
          </div>
        </div>

        <div className="bg-black/70 text-white px-3 py-1 rounded text-sm">
          <div className="flex items-center gap-2">
            <FiMonitor className="w-4 h-4" />
            <button
              onClick={() => handleContrastChange(-0.1)}
              className="px-1 hover:bg-white/20 rounded"
            >
              -
            </button>
            <span className="min-w-[2rem] text-center">
              {contrast.toFixed(1)}
            </span>
            <button
              onClick={() => handleContrastChange(0.1)}
              className="px-1 hover:bg-white/20 rounded"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="relative h-[80vh]">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-white text-lg">Loading mammogram...</p>
            </div>
          </div>
        )}

        <div
          ref={canvasRef}
          className="cornerstone-element w-full h-full cursor-crosshair"
          style={{
            width: "100%",
            height: "100%",
            touchAction: "none",
          }}
        />

        {/* Image Info Overlay */}
        <div className="absolute bottom-4 left-4 bg-black/80 text-white p-3 rounded-lg">
          <div className="text-sm space-y-1">
            <div>
              WL: {Math.round(windowCenter)} | WW: {Math.round(windowWidth)}
            </div>
            <div>Zoom: {(scale * 100).toFixed(0)}%</div>
            <div>Preset: {currentPreset}</div>
            {regions.length > 0 && <div>Regions: {regions.length}</div>}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="absolute bottom-4 right-4 flex gap-2 flex-wrap">
          <Button
            text="Zoom In"
            variant="outlined"
            size="small"
            onClick={handleZoomIn}
            icon={FiZoomIn}
            className="bg-black/70 text-white border-white/30"
          />

          <Button
            text="Zoom Out"
            variant="outlined"
            size="small"
            onClick={handleZoomOut}
            icon={FiZoomOut}
            className="bg-black/70 text-white border-white/30"
          />

          <Button
            text="Invert"
            variant="outlined"
            size="small"
            onClick={toggleInvert}
            icon={invert ? FiSun : FiMoon}
            className="bg-black/70 text-white border-white/30"
          />

          <Button
            text="Reset"
            variant="outlined"
            size="small"
            onClick={handleReset}
            icon={FiRotateCw}
            className="bg-black/70 text-white border-white/30"
          />

          {maskUrl && (
            <Button
              text={showMask ? "Hide Mask" : "Show Mask"}
              variant="outlined"
              size="small"
              onClick={toggleMask}
              icon={showMask ? FiEyeOff : FiEye}
              className="bg-black/70 text-white border-white/30"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};
