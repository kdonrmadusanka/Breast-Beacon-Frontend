import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileSearch,
  Activity,
  ClipboardList,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Card } from "./../../components/ui/Index";
import { MammogramVisualizer } from "../../mammogram/MammogramVisualizer";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/Tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";
import { analysisService } from "../../services/api";
import { useParams } from "react-router-dom";

// Create wrapper components for Lucide icons to make them compatible with Card's icon prop
const FileSearchIconWrapper = ({ className }: { className?: string }) => (
  <FileSearch className={className} />
);

const ActivityIconWrapper = ({ className }: { className?: string }) => (
  <Activity className={className} />
);

const ClipboardListIconWrapper = ({ className }: { className?: string }) => (
  <ClipboardList className={className} />
);

interface AnalysisData {
  imageUrl: string;
  maskUrl?: string;
  prediction: string;
  confidence: number;
  regions?: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    confidence: number;
  }>;
  details?: Array<{
    metric: string;
    value: string;
    normalRange: string;
  }>;
  recommendation?: string;
}

export const ViewResults = () => {
  const [activeTab, setActiveTab] = useState("visualization");
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get analysis ID from route parameters or use a default
  const { analysisId } = useParams<{ analysisId: string }>();

  useEffect(() => {
    const fetchResults = async () => {
      if (!analysisId) {
        setError("No analysis ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await analysisService.getAnalysisResults(analysisId);
        setAnalysisData(response);
      } catch (err) {
        console.error("Error fetching results:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch analysis results"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [analysisId]);

  // Loading state
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 flex items-center justify-center min-h-[400px]"
      >
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="text-muted-foreground">Loading analysis results...</p>
        </div>
      </motion.div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6"
      >
        <div className="p-4 border rounded-lg bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900/50 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">Error Loading Results</h4>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  // No data state
  if (!analysisData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6"
      >
        <div className="p-4 border rounded-lg bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-900/50 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">No Results Found</h4>
            <p className="text-sm text-muted-foreground">
              Analysis results are not available for this study.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-8"
    >
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Mammogram Results</h1>
        <p className="text-muted-foreground">
          Detailed analysis of your recent mammogram scan
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card
          title="Diagnosis"
          subtitle={analysisData.prediction || "N/A"}
          content="BI-RADS Assessment"
          icon={FileSearchIconWrapper}
          className="bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-900/50"
        />
        <Card
          title="Confidence"
          subtitle={`${Math.round((analysisData.confidence || 0) * 100)}%`}
          content="AI prediction confidence"
          icon={ActivityIconWrapper}
          className="bg-purple-50 border-purple-100 dark:bg-purple-900/20 dark:border-purple-900/50"
        />
        <Card
          title="Recommendation"
          subtitle={analysisData.recommendation ? "Biopsy" : "N/A"}
          content={analysisData.recommendation || "No recommendation"}
          icon={ClipboardListIconWrapper}
          className="bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-900/50"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="visualization">Visualization</TabsTrigger>
          <TabsTrigger value="details">Detailed Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="visualization">
          <MammogramVisualizer
            imageUrl={analysisData.imageUrl}
            maskUrl={analysisData.maskUrl}
            regions={analysisData.regions}
          />
        </TabsContent>

        <TabsContent value="details">
          <div className="space-y-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead>Your Value</TableHead>
                  <TableHead>Normal Range</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(analysisData.details || []).map((detail, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {detail.metric}
                    </TableCell>
                    <TableCell>{detail.value}</TableCell>
                    <TableCell>{detail.normalRange}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {analysisData.details && analysisData.details.length === 0 && (
              <div className="p-4 border rounded-lg bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-900/50 text-center">
                <p className="text-muted-foreground">
                  No detailed metrics available
                </p>
              </div>
            )}

            <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-900/50 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium mb-1">Important Note</h4>
                <p className="text-sm text-muted-foreground">
                  This AI analysis is for preliminary assessment only. Please
                  consult with your healthcare provider for definitive diagnosis
                  and treatment planning.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};
