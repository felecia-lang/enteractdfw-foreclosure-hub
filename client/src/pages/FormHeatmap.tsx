import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Clock, MousePointerClick } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function FormHeatmap() {
  const [days, setDays] = useState(30);

  const { data: heatmapData, isLoading, error } = trpc.formHeatmap.getHeatmapData.useQuery({
    formName: "contact_form",
    days,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading heatmap data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load heatmap data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const fieldMetrics = heatmapData?.fieldMetrics || [];
  const totalInteractions = heatmapData?.totalInteractions || 0;

  // Sort fields by typical form order
  const fieldOrder = ["name", "email", "phone", "message"];
  const sortedFields = fieldMetrics.sort((a, b) => {
    const aIndex = fieldOrder.indexOf(a.fieldName);
    const bIndex = fieldOrder.indexOf(b.fieldName);
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  });

  // Calculate engagement intensity (for color coding)
  const maxFocusCount = Math.max(...fieldMetrics.map((f) => f.focusCount), 1);
  
  const getEngagementColor = (focusCount: number) => {
    const intensity = (focusCount / maxFocusCount) * 100;
    if (intensity >= 75) return "bg-red-100 border-red-300 text-red-900";
    if (intensity >= 50) return "bg-orange-100 border-orange-300 text-orange-900";
    if (intensity >= 25) return "bg-yellow-100 border-yellow-300 text-yellow-900";
    return "bg-green-100 border-green-300 text-green-900";
  };

  const getFieldDisplayName = (fieldName: string) => {
    const names: Record<string, string> = {
      name: "Name",
      email: "Email",
      phone: "Phone",
      message: "Message",
    };
    return names[fieldName] || fieldName;
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Form Heatmap</h1>
          <p className="text-muted-foreground mt-2">
            Visualize user interactions and identify drop-off points on the contact form
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2">
          <Button
            variant={days === 7 ? "default" : "outline"}
            onClick={() => setDays(7)}
            size="sm"
          >
            7 Days
          </Button>
          <Button
            variant={days === 30 ? "default" : "outline"}
            onClick={() => setDays(30)}
            size="sm"
          >
            30 Days
          </Button>
          <Button
            variant={days === 90 ? "default" : "outline"}
            onClick={() => setDays(90)}
            size="sm"
          >
            90 Days
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Interactions</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInteractions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              All field interactions tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fields Tracked</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fieldMetrics.length}</div>
            <p className="text-xs text-muted-foreground">
              Form fields monitored
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Time per Field</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fieldMetrics.length > 0
                ? Math.round(
                    fieldMetrics.reduce((sum, f) => sum + f.avgTimeSec, 0) / fieldMetrics.length
                  )
                : 0}s
            </div>
            <p className="text-xs text-muted-foreground">
              Average engagement time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fieldMetrics.length > 0
                ? Math.round(
                    fieldMetrics.reduce((sum, f) => sum + f.completionRate, 0) / fieldMetrics.length
                  )
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Fields completed on average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Field-by-Field Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>Field Engagement Heatmap</CardTitle>
          <CardDescription>
            Color intensity indicates engagement level (red = high, green = low)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sortedFields.map((field) => (
            <div
              key={field.fieldName}
              className={`p-4 border-2 rounded-lg ${getEngagementColor(field.focusCount)}`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">{getFieldDisplayName(field.fieldName)}</h3>
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-medium">{field.focusCount} focuses</span>
                  <span className="font-medium">{field.avgTimeSec}s avg</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-xs opacity-75 mb-1">Unique Sessions</p>
                  <p className="font-semibold text-base">{field.uniqueSessions}</p>
                </div>
                <div>
                  <p className="text-xs opacity-75 mb-1">Completion Rate</p>
                  <p className="font-semibold text-base">{field.completionRate}%</p>
                </div>
                <div>
                  <p className="text-xs opacity-75 mb-1">Changes Made</p>
                  <p className="font-semibold text-base">{field.changeCount}</p>
                </div>
                <div>
                  <p className="text-xs opacity-75 mb-1">Abandonments</p>
                  <p className="font-semibold text-base flex items-center gap-1">
                    {field.abandonCount}
                    {field.abandonmentRate > 20 && (
                      <AlertTriangle className="h-3 w-3" />
                    )}
                  </p>
                </div>
              </div>

              {/* Progress bar for completion rate */}
              <div className="mt-3">
                <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-current opacity-60"
                    style={{ width: `${field.completionRate}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Insights & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Insights & Recommendations</CardTitle>
          <CardDescription>
            Actionable insights based on user interaction patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sortedFields.map((field) => {
            const insights = [];

            // High abandonment rate
            if (field.abandonmentRate > 20) {
              insights.push({
                type: "warning",
                icon: AlertTriangle,
                title: `High abandonment on ${getFieldDisplayName(field.fieldName)}`,
                description: `${field.abandonmentRate}% of users abandon this field. Consider simplifying the label, placeholder, or validation requirements.`,
              });
            }

            // Low completion rate
            if (field.completionRate < 50) {
              insights.push({
                type: "warning",
                icon: TrendingDown,
                title: `Low completion rate for ${getFieldDisplayName(field.fieldName)}`,
                description: `Only ${field.completionRate}% of users complete this field. Review if it's truly required or if the format is unclear.`,
              });
            }

            // High engagement time
            if (field.avgTimeSec > 30) {
              insights.push({
                type: "info",
                icon: Clock,
                title: `Users spend ${field.avgTimeSec}s on ${getFieldDisplayName(field.fieldName)}`,
                description: `This is longer than average. Consider adding helper text, examples, or auto-formatting to reduce friction.`,
              });
            }

            // Good performance
            if (field.completionRate >= 80 && field.abandonmentRate < 10) {
              insights.push({
                type: "success",
                icon: CheckCircle2,
                title: `${getFieldDisplayName(field.fieldName)} performing well`,
                description: `${field.completionRate}% completion rate with low abandonment. This field is optimized.`,
              });
            }

            return insights.map((insight, idx) => (
              <Alert
                key={`${field.fieldName}-${idx}`}
                variant={insight.type === "warning" ? "destructive" : "default"}
                className={
                  insight.type === "success"
                    ? "border-green-500 bg-green-50"
                    : insight.type === "info"
                    ? "border-blue-500 bg-blue-50"
                    : ""
                }
              >
                <insight.icon className="h-4 w-4" />
                <AlertTitle>{insight.title}</AlertTitle>
                <AlertDescription>{insight.description}</AlertDescription>
              </Alert>
            ));
          })}

          {sortedFields.every(
            (f) => f.completionRate >= 80 && f.abandonmentRate < 10
          ) && (
            <Alert className="border-green-500 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-900">Excellent Form Performance!</AlertTitle>
              <AlertDescription className="text-green-800">
                All fields show strong engagement and completion rates. Your form is well-optimized.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
