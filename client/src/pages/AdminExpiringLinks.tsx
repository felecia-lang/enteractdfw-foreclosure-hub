import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Clock, AlertTriangle, Calendar, ExternalLink } from "lucide-react";

export default function AdminExpiringLinks() {
  const [selectedDays, setSelectedDays] = useState(30);
  
  const { data: expiringLinks = [], refetch, isLoading } = trpc.links.getExpiring.useQuery({
    daysAhead: selectedDays,
  });
  
  const extendMutation = trpc.links.extendExpiration.useMutation();

  const handleExtend = async (shortCode: string, days: number, title: string) => {
    try {
      await extendMutation.mutateAsync({ shortCode, days });
      toast.success(`Extended "${title}" by ${days} days`);
      refetch();
    } catch (error) {
      toast.error("Failed to extend link expiration");
    }
  };

  const getDaysUntilExpiration = (expiresAt: Date | string | null) => {
    if (!expiresAt) return null;
    const now = new Date();
    const expiration = new Date(expiresAt);
    const diffTime = expiration.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyBadge = (daysLeft: number | null) => {
    if (daysLeft === null) return null;
    
    if (daysLeft <= 7) {
      return <Badge variant="destructive" className="flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" />
        {daysLeft} {daysLeft === 1 ? "day" : "days"} left
      </Badge>;
    } else if (daysLeft <= 14) {
      return <Badge variant="default" className="bg-orange-500 flex items-center gap-1">
        <Clock className="w-3 h-3" />
        {daysLeft} days left
      </Badge>;
    } else {
      return <Badge variant="secondary" className="flex items-center gap-1">
        <Calendar className="w-3 h-3" />
        {daysLeft} days left
      </Badge>;
    }
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Expiring Links Dashboard</h1>
          <p className="text-slate-600">Manage links that are expiring soon to prevent broken marketing materials</p>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2">
          <Button
            variant={selectedDays === 7 ? "default" : "outline"}
            onClick={() => setSelectedDays(7)}
          >
            Next 7 Days
          </Button>
          <Button
            variant={selectedDays === 14 ? "default" : "outline"}
            onClick={() => setSelectedDays(14)}
          >
            Next 14 Days
          </Button>
          <Button
            variant={selectedDays === 30 ? "default" : "outline"}
            onClick={() => setSelectedDays(30)}
          >
            Next 30 Days
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Expiring Soon</CardDescription>
              <CardTitle className="text-4xl">{expiringLinks.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                In next {selectedDays} days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Critical (≤7 days)</CardDescription>
              <CardTitle className="text-4xl text-red-600">
                {expiringLinks.filter(link => {
                  const days = getDaysUntilExpiration(link.expiresAt);
                  return days !== null && days <= 7;
                }).length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Requires immediate attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Warning (8-14 days)</CardDescription>
              <CardTitle className="text-4xl text-orange-600">
                {expiringLinks.filter(link => {
                  const days = getDaysUntilExpiration(link.expiresAt);
                  return days !== null && days > 7 && days <= 14;
                }).length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Plan extension soon
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Expiring Links Table */}
        <Card>
          <CardHeader>
            <CardTitle>Links Expiring in Next {selectedDays} Days</CardTitle>
            <CardDescription>
              Extend expiration dates to keep your marketing materials active
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-slate-600">Loading expiring links...</p>
              </div>
            ) : expiringLinks.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Short Code</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Expiration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expiringLinks
                      .sort((a, b) => {
                        const daysA = getDaysUntilExpiration(a.expiresAt) || 999;
                        const daysB = getDaysUntilExpiration(b.expiresAt) || 999;
                        return daysA - daysB;
                      })
                      .map((link: any) => {
                        const daysLeft = getDaysUntilExpiration(link.expiresAt);
                        const shortCode = link.customAlias || link.shortCode;
                        
                        return (
                          <TableRow key={link.id}>
                            <TableCell className="font-mono font-medium">
                              <div className="flex items-center gap-2">
                                <a
                                  href={`/l/${shortCode}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline flex items-center gap-1"
                                >
                                  {shortCode}
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {link.title || "—"}
                            </TableCell>
                            <TableCell className="text-sm text-slate-600">
                              {formatDate(link.expiresAt)}
                            </TableCell>
                            <TableCell>
                              {getUrgencyBadge(daysLeft)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleExtend(shortCode, 30, link.title || shortCode)}
                                  disabled={extendMutation.isPending}
                                >
                                  +30 days
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleExtend(shortCode, 60, link.title || shortCode)}
                                  disabled={extendMutation.isPending}
                                >
                                  +60 days
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleExtend(shortCode, 90, link.title || shortCode)}
                                  disabled={extendMutation.isPending}
                                >
                                  +90 days
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No expiring links</h3>
                <p className="text-slate-600">
                  No links are set to expire in the next {selectedDays} days
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
