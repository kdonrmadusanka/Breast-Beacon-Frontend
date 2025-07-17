import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiPlus,
  FiTrash2,
  FiSave,
  FiCalendar,
  FiAlertCircle,
} from "react-icons/fi";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { Checkbox } from "../../components/ui/Checkbox";
import { Label } from "../../components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/Select";
import { DatePicker } from "../../components/ui/DatePicker";

type TreatmentStep = {
  id: string;
  name: string;
  description: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
  completed: boolean;
};

export const TreatmentPlanEditor = () => {
  const [patientName, setPatientName] = useState("Sarah Johnson");
  const [diagnosis, setDiagnosis] = useState(
    "BI-RADS 4 - Suspicious abnormality"
  );
  const [steps, setSteps] = useState<TreatmentStep[]>([
    {
      id: "1",
      name: "Diagnostic Mammogram",
      description: "Additional views needed for complete assessment",
      frequency: "Once",
      startDate: new Date(),
      completed: false,
    },
    {
      id: "2",
      name: "Ultrasound-guided Biopsy",
      description: "Targeted biopsy of suspicious area",
      frequency: "Once",
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      completed: false,
    },
  ]);
  const [errors, setErrors] = useState<{
    patientName?: string;
    diagnosis?: string;
    steps: { [key: string]: { name?: string; description?: string } };
  }>({ steps: {} });

  const addNewStep = () => {
    const newStep: TreatmentStep = {
      id: Date.now().toString(),
      name: "",
      description: "",
      frequency: "Weekly",
      startDate: new Date(),
      completed: false,
    };
    setSteps([...steps, newStep]);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter((step) => step.id !== id));
    setErrors((prev) => {
      const newSteps = { ...prev.steps };
      delete newSteps[id];
      return { ...prev, steps: newSteps };
    });
  };

  const updateStep = (id: string, field: keyof TreatmentStep, value: any) => {
    setSteps(
      steps.map((step) => (step.id === id ? { ...step, [field]: value } : step))
    );
    if (field === "name" || field === "description") {
      setErrors((prev) => ({
        ...prev,
        steps: {
          ...prev.steps,
          [id]: {
            ...prev.steps[id],
            [field]: undefined,
          },
        },
      }));
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = { steps: {} };
    let isValid = true;

    if (!patientName.trim()) {
      newErrors.patientName = "Patient name is required";
      isValid = false;
    }
    if (!diagnosis.trim()) {
      newErrors.diagnosis = "Diagnosis is required";
      isValid = false;
    }

    steps.forEach((step) => {
      const stepErrors: { name?: string; description?: string } = {};
      if (!step.name.trim()) {
        stepErrors.name = "Step name is required";
        isValid = false;
      }
      if (!step.description.trim()) {
        stepErrors.description = "Description is required";
        isValid = false;
      }
      if (Object.keys(stepErrors).length) {
        newErrors.steps[step.id] = stepErrors;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const savePlan = () => {
    if (!validateForm()) {
      console.log("Validation failed", errors);
      return;
    }
    console.log("Saving plan:", { patientName, diagnosis, steps });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Treatment Plan</h1>
        <Button
          text="Save Plan"
          icon={FiSave}
          variant="filled"
          size="medium"
          color="primary"
          onClick={savePlan}
          disabled={false}
        />
      </div>

      <Card className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="patientName">Patient Name</Label>
            <Input
              label="Patient Name"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              size="medium"
              color="primary"
              error={errors.patientName}
              required={true}
            />
          </div>
          <div>
            <Label htmlFor="diagnosis">Diagnosis</Label>
            <Input
              label="Diagnosis"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              size="medium"
              color="primary"
              error={errors.diagnosis}
              required={true}
            />
          </div>
        </div>
      </Card>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Treatment Steps</h2>
          <Button
            text="Add Step"
            icon={FiPlus}
            variant="outlined"
            size="medium"
            color="primary"
            onClick={addNewStep}
          />
        </div>

        {steps.map((step) => (
          <Card key={step.id} className="p-4 mb-4">
            <div className="flex justify-end">
              <Button
                text=""
                icon={FiTrash2}
                variant="outlined"
                size="small"
                color="accent"
                onClick={() => removeStep(step.id)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor={`stepName-${step.id}`}>Step Name</Label>
                <Input
                  label="Step Name"
                  value={step.name}
                  onChange={(e) => updateStep(step.id, "name", e.target.value)}
                  size="medium"
                  color="primary"
                  error={errors.steps[step.id]?.name}
                  required={true}
                />
              </div>
              <div>
                <Label>Frequency</Label>
                <Select
                  value={step.frequency}
                  onValueChange={(value) =>
                    updateStep(step.id, "frequency", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Once">Once</SelectItem>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mb-4">
              <Label>Description</Label>
              <Textarea
                value={step.description}
                onChange={(e) =>
                  updateStep(step.id, "description", e.target.value)
                }
                rows={3}
                className={
                  errors.steps[step.id]?.description ? "border-red-500" : ""
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Start Date</Label>
                <DatePicker
                  selected={step.startDate}
                  onSelect={(date) =>
                    date && updateStep(step.id, "startDate", date)
                  }
                  trigger={
                    <Button
                      text={step.startDate.toLocaleDateString()}
                      icon={FiCalendar}
                      variant="outlined"
                      size="medium"
                      color="primary"
                    />
                  }
                />
              </div>
              <div>
                <Label>End Date (Optional)</Label>
                <DatePicker
                  selected={step.endDate}
                  onSelect={(date) =>
                    updateStep(step.id, "endDate", date || undefined)
                  }
                  trigger={
                    <Button
                      text={
                        step.endDate
                          ? step.endDate.toLocaleDateString()
                          : "Select date"
                      }
                      icon={FiCalendar}
                      variant="outlined"
                      size="medium"
                      color="primary"
                    />
                  }
                />
              </div>
              <div className="flex items-end">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`completed-${step.id}`}
                    checked={step.completed}
                    onCheckedChange={(checked) =>
                      updateStep(step.id, "completed", checked)
                    }
                  />
                  <Label htmlFor={`completed-${step.id}`}>Completed</Label>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {steps.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <FiAlertCircle className="h-12 w-12 text-gray-400" />
            <h3 className="text-lg font-medium">No treatment steps added</h3>
            <p className="text-sm text-gray-500">
              Click "Add Step" to create a treatment plan
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TreatmentPlanEditor;
