import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Minus, Play, Pause, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function ABTestingDashboard() {
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);
  const [showStatsDialog, setShowStatsDialog] = useState(false);

  // Fetch all tests
  const { data: tests, isLoading, refetch } = trpc.abTesting.getAllTests.useQuery();

  // Fetch test statistics
  const { data: stats } = trpc.abTesting.getTestStats.useQuery(
    { testId: selectedTestId! },
    { enabled: !!selectedTestId && showStatsDialog }
  );

  // Update test status mutation
  const updateStatusMutation = trpc.abTesting.updateTestStatus.useMutation({
    onSuccess: () => {
      toast.success("Test status updated");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update test status");
    },
  });

  const handleViewStats = (testId: number) => {
    setSelectedTestId(testId);
    setShowStatsDialog(true);
  };

  const handleUpdateStatus = (
    testId: number,
    status: "draft" | "active" | "paused" | "completed"
  ) => {
    updateStatusMutation.mutate({ testId, status });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      draft: "outline",
      active: "default",
      paused: "secondary",
      completed: "secondary",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const getImprovementIndicator = (improvement: number) => {
    if (improvement > 0) {
      return (
        <span className="flex items-center gap-1 text-green-600">
          <TrendingUp className="h-4 w-4" />
          +{formatPercentage(improvement)}
        </span>
      );
    } else if (improvement < 0) {
      return (
        <span className="flex items-center gap-1 text-red-600">
          <TrendingDown className="h-4 w-4" />
          {formatPercentage(improvement)}
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-gray-600">
        <Minus className="h-4 w-4" />
        {formatPercentage(0)}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading tests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">A/B Testing Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage and analyze field-level A/B tests for form optimization
          </p>
        </div>
        <Button onClick={() => toast.info("Create test feature coming soon")}>
          Create New Test
        </Button>
      </div>

      {/* Tests Overview */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tests?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tests?.filter((t) => t.status === "active").length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paused Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tests?.filter((t) => t.status === "paused").length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tests?.filter((t) => t.status === "completed").length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tests Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Tests</CardTitle>
          <CardDescription>
            View and manage your A/B tests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tests && tests.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test Name</TableHead>
                  <TableHead>Form</TableHead>
                  <TableHead>Field</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tests.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell className="font-medium">{test.name}</TableCell>
                    <TableCell>{test.formName}</TableCell>
                    <TableCell>{test.fieldName}</TableCell>
                    <TableCell>{getStatusBadge(test.status)}</TableCell>
                    <TableCell>
                      {test.startedAt
                        ? new Date(test.startedAt).toLocaleDateString()
                        : "Not started"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewStats(test.id)}
                        >
                          View Stats
                        </Button>
                        {test.status === "draft" && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleUpdateStatus(test.id, "active")}
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Start
                          </Button>
                        )}
                        {test.status === "active" && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleUpdateStatus(test.id, "paused")}
                          >
                            <Pause className="h-4 w-4 mr-1" />
                            Pause
                          </Button>
                        )}
                        {test.status === "paused" && (
                          <>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleUpdateStatus(test.id, "active")}
                            >
                              <Play className="h-4 w-4 mr-1" />
                              Resume
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(test.id, "completed")}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Complete
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No A/B tests yet</p>
              <Button onClick={() => toast.info("Create test feature coming soon")}>
                Create Your First Test
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics Dialog */}
      <Dialog open={showStatsDialog} onOpenChange={setShowStatsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{stats?.test.name}</DialogTitle>
            <DialogDescription>{stats?.test.description}</DialogDescription>
          </DialogHeader>

          {stats && (
            <Tabs defaultValue="overview" className="mt-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="variants">Variant Details</TabsTrigger>
                <TabsTrigger value="significance">Statistical Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  {stats.variants.map((v) => (
                    <Card key={v.variant.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center justify-between">
                          {v.variant.name}
                          {v.variant.isControl === "yes" && (
                            <Badge variant="outline">Control</Badge>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Conversion Rate</p>
                            <p className="text-2xl font-bold">
                              {formatPercentage(v.conversionRate)}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-xs text-muted-foreground">Impressions</p>
                              <p className="font-semibold">{v.impressions}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Conversions</p>
                              <p className="font-semibold">{v.conversions}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="variants" className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Variant</TableHead>
                      <TableHead>Impressions</TableHead>
                      <TableHead>Focuses</TableHead>
                      <TableHead>Errors</TableHead>
                      <TableHead>Submissions</TableHead>
                      <TableHead>Conversions</TableHead>
                      <TableHead>Engagement</TableHead>
                      <TableHead>Error Rate</TableHead>
                      <TableHead>Conversion</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.variants.map((v) => (
                      <TableRow key={v.variant.id}>
                        <TableCell className="font-medium">
                          {v.variant.name}
                          {v.variant.isControl === "yes" && (
                            <Badge variant="outline" className="ml-2">
                              Control
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{v.impressions}</TableCell>
                        <TableCell>{v.focuses}</TableCell>
                        <TableCell>{v.errors}</TableCell>
                        <TableCell>{v.submissions}</TableCell>
                        <TableCell>{v.conversions}</TableCell>
                        <TableCell>{formatPercentage(v.engagementRate)}</TableCell>
                        <TableCell>{formatPercentage(v.errorRate)}</TableCell>
                        <TableCell>{formatPercentage(v.conversionRate)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="significance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Statistical Significance</CardTitle>
                    <CardDescription>
                      Comparison of treatment variants against control
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {stats.comparisons.length > 0 ? (
                      <div className="space-y-4">
                        {stats.comparisons.map((comparison, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div>
                              <p className="font-semibold">{comparison.treatmentName}</p>
                              <p className="text-sm text-muted-foreground">
                                p-value: {comparison.pValue.toFixed(4)}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              {getImprovementIndicator(comparison.improvement || 0)}
                              {comparison.significant ? (
                                <Badge variant="default">Significant</Badge>
                              ) : (
                                <Badge variant="outline">Not Significant</Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        Not enough data for statistical analysis
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
