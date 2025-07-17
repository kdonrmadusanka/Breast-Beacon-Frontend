import { useDICOMStore } from "../../store/dicomStore";
import Slider from "../ui/Slider";
import Toggle from "../ui/Toggle";

const WindowLevelControls = () => {
  const { viewportSettings, actions } = useDICOMStore();

  return (
    <div className="bg-white p-4 rounded-lg shadow dark:bg-gray-800">
      <h3 className="font-medium mb-3 text-gray-900 dark:text-gray-100">
        Image Adjustments
      </h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Window Width
          </label>
          <Slider
            value={[viewportSettings.windowWidth]}
            onValueChange={(value: number[]) =>
              actions.adjustWindowLevel(value[0], viewportSettings.windowCenter)
            }
            min={100}
            max={4000}
            step={10}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Window Center
          </label>
          <Slider
            value={[viewportSettings.windowCenter]}
            onValueChange={(value: number[]) =>
              actions.adjustWindowLevel(viewportSettings.windowWidth, value[0])
            }
            min={-1000}
            max={3000}
            step={10}
          />
        </div>
        <Toggle
          label="Invert Colors"
          checked={viewportSettings.invert}
          onChange={actions.toggleInvert}
        />
      </div>
    </div>
  );
};

export default WindowLevelControls;
