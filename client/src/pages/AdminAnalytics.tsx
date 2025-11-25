import { useState, useMemo } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Phone, TrendingUp, Calendar, Filter, Download } from "lucide-react";
import { Link } from "wouter";
import { APP_LOGO } from "@/const";

export default function AdminAnalytics() {
  const { user, loading: authLoading } = useAuth();
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedPage, setSelectedPage] = useState<string>("all");

  // Fetch analytics data - always call hooks, use enabled to control execution
  const { data: callStats, isLoading: statsLoading } = trpc.tracking.getCallStats.useQuery(
    undefined,
    { enabled: user?.role === "admin" }
  );
  
  const { data: volumeData, isLoading: volumeLoading } = trpc.tracking.getCallVolumeByDate.useQuery(
    {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    },
    { enabled: user?.role === "admin" }
  );

  const { data: recentCalls, isLoading: callsLoading } = trpc.tracking.getRecentCalls.useQuery(
    {
      limit: 100,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      pagePath: selectedPage !== "all" ? selectedPage : undefined,
    },
    { enabled: user?.role === "admin" }
  );

  // Calculate total calls
  const totalCalls = useMemo(() => {
    return callStats?.reduce((sum, stat) => sum + Number(stat.callCount), 0) || 0;
  }, [callStats]);

  // Prepare chart data for call volume (reverse to show chronologically)
  const volumeChartData = useMemo(() => {
    if (!volumeData) return [];
    return [...volumeData].reverse().map(item => ({
      date: item.date,
      calls: Number(item.callCount),
    }));
  }, [volumeData]);

  // Prepare chart data for calls by page (top 10)
  const pageChartData = useMemo(() => {
    if (!callStats) return [];
    return callStats.slice(0, 10).map(stat => ({
      page: stat.pageTitle || stat.pagePath.substring(0, 30),
      calls: Number(stat.callCount),
    }));
  }, [callStats]);

  // Get unique pages for filter
  const uniquePages = useMemo(() => {
    if (!callStats) return [];
    return callStats.map(stat => ({
      path: stat.pagePath,
      title: stat.pageTitle || stat.pagePath,
    }));
  }, [callStats]);

  const handleClearFilters = () => {
    setStartDate("");
    setEndDate("");
    setSelectedPage("all");
  };

  const handleExportCSV = () => {
    if (!recentCalls || recentCalls.length === 0) return;

    const headers = ["Date", "Time", "Page", "Phone Number", "User Email", "IP Address"];
    const rows = recentCalls.map(call => [
      new Date(call.clickedAt).toLocaleDateString(),
      new Date(call.clickedAt).toLocaleTimeString(),
      call.pageTitle || call.pagePath,
      call.phoneNumber,
      call.userEmail || "Anonymous",
      call.ipAddress || "N/A",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `call-tracking-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Check if user is admin
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You must be an administrator to view this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50 shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <img src={APP_LOGO} alt="EnterActDFW" className="h-10" />
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Admin: {user.name}</span>
            <Button variant="outline" size="sm" asChild>
              <Link href="/">Back to Site</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Call Tracking Analytics</h1>
          <p className="text-muted-foreground">
            Monitor phone call conversions and analyze which pages drive the most engagement.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCalls}</div>
              <p className="text-xs text-muted-foreground mt-1">
                All-time phone call clicks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Pages</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{callStats?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Pages with call activity
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Date Range</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{volumeData?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Days with call data
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Call Volume Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Call Volume Over Time</CardTitle>
              <CardDescription>Daily phone call clicks</CardDescription>
            </CardHeader>
            <CardContent>
              {volumeLoading ? (
                <div className="h-[300px] flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : volumeChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={volumeChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="calls" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      name="Phone Calls"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No call data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Pages by Calls */}
          <Card>
            <CardHeader>
              <CardTitle>Top Pages by Calls</CardTitle>
              <CardDescription>Pages driving the most phone calls</CardDescription>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="h-[300px] flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : pageChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={pageChartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis 
                      dataKey="page" 
                      type="category" 
                      width={150}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="calls" 
                      fill="hsl(var(--primary))" 
                      name="Phone Calls"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No call data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
            <CardDescription>Filter call log by date range and page</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="page">Page</Label>
                <Select value={selectedPage} onValueChange={setSelectedPage}>
                  <SelectTrigger id="page">
                    <SelectValue placeholder="All pages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Pages</SelectItem>
                    {uniquePages.map((page) => (
                      <SelectItem key={page.path} value={page.path}>
                        {page.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 flex items-end gap-2">
                <Button variant="outline" onClick={handleClearFilters} className="flex-1">
                  Clear Filters
                </Button>
                <Button onClick={handleExportCSV} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call Log Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Call Log</CardTitle>
            <CardDescription>
              Showing {recentCalls?.length || 0} recent phone call clicks
            </CardDescription>
          </CardHeader>
          <CardContent>
            {callsLoading ? (
              <div className="h-[200px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : recentCalls && recentCalls.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Page</TableHead>
                      <TableHead>Phone Number</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentCalls.map((call) => (
                      <TableRow key={call.id}>
                        <TableCell className="whitespace-nowrap">
                          <div className="text-sm">
                            {new Date(call.clickedAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(call.clickedAt).toLocaleTimeString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[200px] truncate" title={call.pageTitle || call.pagePath}>
                            {call.pageTitle || call.pagePath}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {call.pagePath}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {call.phoneNumber}
                        </TableCell>
                        <TableCell>
                          {call.userEmail ? (
                            <div className="text-sm">{call.userEmail}</div>
                          ) : (
                            <div className="text-sm text-muted-foreground">Anonymous</div>
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {call.ipAddress || "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                No call data available for the selected filters
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
