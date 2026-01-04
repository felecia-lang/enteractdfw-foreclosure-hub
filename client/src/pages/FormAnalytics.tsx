import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, TrendingUp, Users, CheckCircle, AlertCircle } from "lucide-react";

export default function FormAnalytics() {
  const [days, setDays] = useState(30);
  
  const { data: metrics, isLoading, error, refetch } = trpc.formAnalytics.getMetrics.useQuery({
    formName: "contact_form",
    days,
  });

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-red-600">
              <AlertCircle className="h-12 w-12 mx-auto mb-4" />
              <p>Failed to load analytics data</p>
              <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
              <Button onClick={() => refetch()} className="mt-4">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Contact Form Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Track engagement and conversion metrics for your contact form
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={days === 7 ? "default" : "outline"}
          onClick={() => setDays(7)}
        >
          Last 7 Days
        </Button>
        <Button
          variant={days === 30 ? "default" : "outline"}
          onClick={() => setDays(30)}
        >
          Last 30 Days
        </Button>
        <Button
          variant={days === 90 ? "default" : "outline"}
          onClick={() => setDays(90)}
        >
          Last 90 Days
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Form Views</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.views || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total visitors who saw the form
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Form Starts</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.starts || 0}</div>
            <p className="text-xs text-muted-foreground">
              {metrics?.startRate || 0}% of views started filling
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completions</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.completions || 0}</div>
            <p className="text-xs text-muted-foreground">
              {metrics?.completionRate || 0}% of starts completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.errors || 0}</div>
            <p className="text-xs text-muted-foreground">
              Submission or validation errors
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
          <CardDescription>
            Track how visitors progress through the form
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Views</span>
                <span className="text-sm text-muted-foreground">{metrics?.views || 0}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-4">
                <div
                  className="bg-primary h-4 rounded-full"
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Starts</span>
                <span className="text-sm text-muted-foreground">
                  {metrics?.starts || 0} ({metrics?.startRate || 0}%)
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-4">
                <div
                  className="bg-primary h-4 rounded-full"
                  style={{
                    width: `${metrics?.startRate || 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Completions</span>
                <span className="text-sm text-muted-foreground">
                  {metrics?.completions || 0} ({metrics?.overallConversionRate || 0}%)
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-4">
                <div
                  className="bg-green-600 h-4 rounded-full"
                  style={{
                    width: `${metrics?.overallConversionRate || 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Insights & Recommendations</CardTitle>
          <CardDescription>
            Based on your form analytics data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics && metrics.views > 0 && metrics.startRate < 50 && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                  Low Start Rate ({metrics.startRate}%)
                </h4>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Less than half of visitors who see the form are starting to fill it out. Consider:
                </p>
                <ul className="text-sm text-yellow-800 dark:text-yellow-200 list-disc ml-5 mt-2">
                  <li>Making the form more prominent on the page</li>
                  <li>Adding a compelling call-to-action above the form</li>
                  <li>Reducing the number of required fields</li>
                </ul>
              </div>
            )}

            {metrics && metrics.starts > 0 && metrics.completionRate < 70 && (
              <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
                <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                  Low Completion Rate ({metrics.completionRate}%)
                </h4>
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  Many visitors start the form but don't complete it. Consider:
                </p>
                <ul className="text-sm text-orange-800 dark:text-orange-200 list-disc ml-5 mt-2">
                  <li>Simplifying form fields and validation</li>
                  <li>Adding progress indicators</li>
                  <li>Providing clear error messages</li>
                  <li>Testing on mobile devices</li>
                </ul>
              </div>
            )}

            {metrics && metrics.completionRate >= 70 && (
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  Great Completion Rate! ({metrics.completionRate}%)
                </h4>
                <p className="text-sm text-green-800 dark:text-green-200">
                  Your form is performing well. Most visitors who start the form complete it successfully.
                </p>
              </div>
            )}

            {metrics && metrics.errors > metrics.completions * 0.1 && (
              <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                  High Error Rate
                </h4>
                <p className="text-sm text-red-800 dark:text-red-200">
                  You're seeing a significant number of errors. Check:
                </p>
                <ul className="text-sm text-red-800 dark:text-red-200 list-disc ml-5 mt-2">
                  <li>Validation rules are not too strict</li>
                  <li>Error messages are clear and helpful</li>
                  <li>reCAPTCHA is not blocking legitimate users</li>
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
