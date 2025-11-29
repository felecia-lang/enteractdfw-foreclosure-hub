import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, TrendingUp, Users, MousePointerClick, Globe, ExternalLink } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

export default function AdminLinkAnalytics() {
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "all">("30d");

  // Calculate date range
  const { startDate, endDate } = useMemo(() => {
    const end = new Date();
    let start = new Date();
    
    if (dateRange === "7d") {
      start.setDate(end.getDate() - 7);
    } else if (dateRange === "30d") {
      start.setDate(end.getDate() - 30);
    } else if (dateRange === "90d") {
      start.setDate(end.getDate() - 90);
    } else {
      start = new Date(0); // All time
    }
    
    return { startDate: start, endDate: end };
  }, [dateRange]);

  // Fetch analytics data
  const { data: analytics, isLoading } = trpc.links.getAnalytics.useQuery({
    startDate,
    endDate,
  });

  // Fetch top performing links
  const { data: topLinks } = trpc.links.getTopLinks.useQuery({
    limit: 10,
    startDate,
    endDate,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <p className="text-slate-600">Failed to load analytics data</p>
      </div>
    );
  }

  // Calculate CTR (assuming unique visitors as impressions)
  const ctr = analytics.uniqueVisitors > 0
    ? ((analytics.totalClicks / analytics.uniqueVisitors) * 100).toFixed(2)
    : "0.00";

  // Prepare chart data
  const clicksOverTime = analytics.clicksByDate.map((item) => ({
    date: new Date(item.date as string | number | Date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    clicks: item.clicks,
  })).reverse();

  const deviceData = analytics.clicksByDevice
    .filter((item) => item.deviceType)
    .map((item) => ({
      name: item.deviceType || "Unknown",
      value: item.clicks,
    }));

  const browserData = analytics.clicksByBrowser
    .filter((item) => item.browser)
    .map((item) => ({
      name: item.browser || "Unknown",
      value: item.clicks,
    }));

  const countryData = analytics.clicksByCountry
    .filter((item) => item.country)
    .map((item) => ({
      country: item.country || "Unknown",
      clicks: item.clicks,
    }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Link Analytics</h1>
              <p className="text-slate-600 mt-1">Track performance and engagement metrics</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={dateRange === "7d" ? "default" : "outline"}
                onClick={() => setDateRange("7d")}
                size="sm"
              >
                7 Days
              </Button>
              <Button
                variant={dateRange === "30d" ? "default" : "outline"}
                onClick={() => setDateRange("30d")}
                size="sm"
              >
                30 Days
              </Button>
              <Button
                variant={dateRange === "90d" ? "default" : "outline"}
                onClick={() => setDateRange("90d")}
                size="sm"
              >
                90 Days
              </Button>
              <Button
                variant={dateRange === "all" ? "default" : "outline"}
                onClick={() => setDateRange("all")}
                size="sm"
              >
                All Time
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto py-8 space-y-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
              <MousePointerClick className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalClicks.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across all links
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.uniqueVisitors.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Unique sessions tracked
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Click-Through Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ctr}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Engagement metric
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Countries</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{countryData.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Geographic reach
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Clicks Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Clicks Over Time</CardTitle>
            <CardDescription>Daily click trends for the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={clicksOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device and Browser Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Device Breakdown</CardTitle>
              <CardDescription>Clicks by device type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Browser Distribution</CardTitle>
              <CardDescription>Top browsers used by visitors</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={browserData.slice(0, 5)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Geographic Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
            <CardDescription>Top countries by click volume</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={countryData.slice(0, 10)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="country" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="clicks" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Performing Links */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Links</CardTitle>
            <CardDescription>Links with the most clicks in the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Short Code</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Original URL</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topLinks && topLinks.length > 0 ? (
                  topLinks.map((link, index) => (
                    <TableRow key={link.shortCode}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <code className="bg-slate-100 px-2 py-1 rounded text-sm">
                          {link.shortCode}
                        </code>
                      </TableCell>
                      <TableCell>{link.title || "—"}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        <a
                          href={link.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          {link.originalUrl}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                          {link.clicks}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-slate-500 py-8">
                      No click data available for the selected period
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Referrer Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Top Referral Sources</CardTitle>
            <CardDescription>Where your clicks are coming from</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Referrer</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.clicksByReferrer.slice(0, 10).map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="max-w-md truncate">
                      {item.referer || "Direct / None"}
                    </TableCell>
                    <TableCell className="text-right">{item.clicks}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
