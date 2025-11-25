import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, TrendingDown, TrendingUp, Users } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

/**
 * ConversionFunnel - Admin-only page showing complete conversion funnel analysis
 * Tracks: Visitors → Phone Calls → Bookings
 * Shows conversion rates and identifies optimization opportunities
 */
export default function ConversionFunnel() {
  const { user, loading, isAuthenticated } = useAuth();
  const [dateRange] = useState<{ startDate?: Date; endDate?: Date }>({});

  // Fetch funnel data
  const { data: overview, isLoading: overviewLoading } = trpc.funnel.getOverview.useQuery(dateRange);
  const { data: pageMetrics, isLoading: pageLoading } = trpc.funnel.getByPage.useQuery(dateRange);

  // Auth check
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Admin access required to view conversion funnel analytics.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Admin Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Conversion Funnel Analysis</h1>
              <p className="text-gray-600 mt-1">Track visitor journey from page view to booking</p>
            </div>
            <Link href="/admin/analytics">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Analytics
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 space-y-8">
        {/* Funnel Overview */}
        {overviewLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : overview ? (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overview.totalVisitors}</div>
                  <p className="text-xs text-muted-foreground mt-1">Unique sessions tracked</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Phone Calls</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overview.totalCalls}</div>
                  <p className="text-xs text-green-600 mt-1">{overview.visitorToCallRate}% conversion rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Consultations Booked</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overview.totalBookings}</div>
                  <p className="text-xs text-green-600 mt-1">{overview.callToBookingRate}% of calls convert</p>
                </CardContent>
              </Card>
            </div>

            {/* Funnel Visualization */}
            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>Visualizing the complete user journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Stage 1: Visitors */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">Stage 1: Page Visitors</h3>
                        <p className="text-sm text-gray-600">Unique visitors to the site</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{overview.totalVisitors}</div>
                        <div className="text-sm text-gray-600">100%</div>
                      </div>
                    </div>
                    <div className="w-full h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold">
                      {overview.totalVisitors} Visitors
                    </div>
                  </div>

                  {/* Drop-off indicator */}
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <TrendingDown className="h-8 w-8 text-red-500 mx-auto mb-2" />
                      <p className="text-sm font-medium text-red-600">
                        {overview.totalVisitors - overview.totalCalls} visitors did not call
                        ({(100 - overview.visitorToCallRate).toFixed(1)}% drop-off)
                      </p>
                    </div>
                  </div>

                  {/* Stage 2: Phone Calls */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">Stage 2: Phone Calls</h3>
                        <p className="text-sm text-gray-600">Visitors who clicked to call</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{overview.totalCalls}</div>
                        <div className="text-sm text-green-600">{overview.visitorToCallRate}%</div>
                      </div>
                    </div>
                    <div 
                      className="h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white font-semibold"
                      style={{ width: `${Math.max(overview.visitorToCallRate, 10)}%` }}
                    >
                      {overview.totalCalls} Calls
                    </div>
                  </div>

                  {/* Drop-off indicator */}
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <TrendingDown className="h-8 w-8 text-red-500 mx-auto mb-2" />
                      <p className="text-sm font-medium text-red-600">
                        {overview.totalCalls - overview.totalBookings} calls did not book
                        ({(100 - overview.callToBookingRate).toFixed(1)}% drop-off)
                      </p>
                    </div>
                  </div>

                  {/* Stage 3: Bookings */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">Stage 3: Consultations Booked</h3>
                        <p className="text-sm text-gray-600">Completed booking appointments</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{overview.totalBookings}</div>
                        <div className="text-sm text-green-600">{overview.overallConversionRate}% overall</div>
                      </div>
                    </div>
                    <div 
                      className="h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold"
                      style={{ width: `${Math.max(overview.overallConversionRate * 10, 10)}%` }}
                    >
                      {overview.totalBookings} Bookings
                    </div>
                  </div>

                  {/* Overall Conversion Rate */}
                  <div className="bg-gray-100 rounded-lg p-6 text-center">
                    <p className="text-sm text-gray-600 mb-2">Overall Conversion Rate</p>
                    <p className="text-4xl font-bold text-purple-600">{overview.overallConversionRate}%</p>
                    <p className="text-sm text-gray-600 mt-2">
                      {overview.totalBookings} bookings from {overview.totalVisitors} visitors
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Page-Level Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Conversion by Page</CardTitle>
                <CardDescription>Identify which pages drive the most conversions</CardDescription>
              </CardHeader>
              <CardContent>
                {pageLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : pageMetrics && pageMetrics.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Page</th>
                          <th className="text-right py-3 px-4">Visitors</th>
                          <th className="text-right py-3 px-4">Calls</th>
                          <th className="text-right py-3 px-4">Bookings</th>
                          <th className="text-right py-3 px-4">Visitor→Call</th>
                          <th className="text-right py-3 px-4">Call→Booking</th>
                          <th className="text-right py-3 px-4">Overall</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pageMetrics.map((page, idx) => (
                          <tr key={idx} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="font-medium">{page.pageTitle}</div>
                              <div className="text-sm text-gray-500">{page.pagePath}</div>
                            </td>
                            <td className="text-right py-3 px-4">{page.visitors}</td>
                            <td className="text-right py-3 px-4">{page.calls}</td>
                            <td className="text-right py-3 px-4">{page.bookings}</td>
                            <td className="text-right py-3 px-4">
                              <span className={page.visitorToCallRate > overview.visitorToCallRate ? "text-green-600 font-medium" : ""}>
                                {page.visitorToCallRate}%
                              </span>
                            </td>
                            <td className="text-right py-3 px-4">
                              <span className={page.callToBookingRate > overview.callToBookingRate ? "text-green-600 font-medium" : ""}>
                                {page.callToBookingRate}%
                              </span>
                            </td>
                            <td className="text-right py-3 px-4">
                              <span className={page.overallConversionRate > overview.overallConversionRate ? "text-green-600 font-medium" : ""}>
                                {page.overallConversionRate}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">No page data available yet. Start tracking page views to see metrics.</p>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="py-12">
              <p className="text-center text-gray-500">No funnel data available yet. Page view tracking is now active.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
