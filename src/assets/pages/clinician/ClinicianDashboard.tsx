import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList,
  User,
  AlertCircle,
  Calendar,
  Filter,
  Search,
} from "lucide-react";
import { Card } from "../../components/ui/Index";
import { Button } from "../../components/ui/Index";
import { Badge } from "../../components/ui/Index";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";
import { Input } from "../../components/ui/Index";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/Tabs";
import { useNavigate } from "react-router-dom";
import { analysisService } from "../../services/api";

type PatientCase = {
  id: string;
  name: string;
  age: number;
  status: "pending" | "reviewed" | "urgent" | "completed" | "processing";
  lastUpdated: string;
  birads?: string;
  nextSteps?: string;
};

// Create a wrapper component for Lucide icons to make them compatible with Button's icon prop
const FilterIconWrapper = ({ className }: { className?: string }) => (
  <Filter className={className} />
);

export const ClinicianDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [cases, setCases] = useState<PatientCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all analyses from the API
        const analyses = await analysisService.getAnalysisResults("all");

        // Transform API data to match our component structure
        const transformedCases: PatientCase[] = analyses.map(
          (analysis: any) => ({
            id: analysis.studyId,
            name:
              analysis.metadata?.patientName ||
              analysis.metadata?.PatientName ||
              "Unknown Patient",
            age:
              analysis.metadata?.patientAge ||
              analysis.metadata?.PatientAge ||
              0,
            status: mapAnalysisStatus(analysis.status),
            lastUpdated:
              analysis.createdAt ||
              analysis.updatedAt ||
              new Date().toISOString(),
            birads:
              analysis.results?.prediction || analysis.results?.birads || "N/A",
            nextSteps:
              analysis.results?.recommendation ||
              analysis.results?.nextSteps ||
              "N/A",
          })
        );

        setCases(transformedCases);
      } catch (error) {
        console.error("Error fetching cases:", error);
        setError("Failed to load patient cases. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  // Map API status to our component status
  const mapAnalysisStatus = (apiStatus: string): PatientCase["status"] => {
    switch (apiStatus?.toLowerCase()) {
      case "pending":
      case "queued":
        return "pending";
      case "completed":
      case "success":
        return "reviewed";
      case "processing":
      case "analyzing":
        return "processing";
      case "urgent":
      case "critical":
        return "urgent";
      default:
        return "pending";
    }
  };

  const filteredCases = cases.filter((caseItem) => {
    const matchesSearch =
      caseItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "all" || caseItem.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const getStatusBadge = (status: PatientCase["status"]) => {
    const variants = {
      pending: { color: "bg-yellow-500", text: "Pending Review" },
      reviewed: { color: "bg-green-500", text: "Reviewed" },
      urgent: { color: "bg-red-500", text: "Urgent" },
      processing: { color: "bg-blue-500", text: "Processing" },
      completed: { color: "bg-gray-500", text: "Completed" },
    };

    const variant = variants[status] || variants.pending;

    return (
      <Badge className={`${variant.color} text-white`}>{variant.text}</Badge>
    );
  };

  const handleViewCase = (caseId: string) => {
    navigate(`/clinician/study-comparison?studyId=${caseId}`);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center py-12"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading patient cases...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center py-12"
      >
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-600 mb-2">
            Error Loading Cases
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button text="Try Again" onClick={handleRefresh} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Patient Cases</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              label="Search cases"
              className="pl-9 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            text="Filters"
            variant="outlined"
            size="small"
            icon={FilterIconWrapper}
          />
          <Button
            text="Refresh"
            variant="outlined"
            size="small"
            onClick={handleRefresh}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full md:w-[500px]">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
          <TabsTrigger value="urgent">Urgent</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Case ID</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>BI-RADS</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCases.map((caseItem) => (
              <TableRow key={caseItem.id}>
                <TableCell className="font-medium">{caseItem.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {caseItem.name}
                  </div>
                </TableCell>
                <TableCell>{caseItem.age || "-"}</TableCell>
                <TableCell>{getStatusBadge(caseItem.status)}</TableCell>
                <TableCell>{caseItem.birads || "-"}</TableCell>
                <TableCell>
                  {caseItem.lastUpdated
                    ? new Date(caseItem.lastUpdated).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>
                  <Button
                    text="View Case"
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewCase(caseItem.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {filteredCases.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-12 gap-2 text-center">
          <ClipboardList className="h-12 w-12 text-gray-400" />
          <h3 className="text-lg font-medium">No cases found</h3>
          <p className="text-sm text-gray-500">
            {searchTerm
              ? "Try a different search term or adjust your filters"
              : "No cases match the current filters"}
          </p>
          {searchTerm && (
            <Button
              text="Clear Search"
              variant="outlined"
              size="small"
              onClick={() => setSearchTerm("")}
            />
          )}
        </div>
      )}
    </motion.div>
  );
};
