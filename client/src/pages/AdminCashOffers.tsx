import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Eye, Filter, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";

type CashOfferStatus = "new" | "reviewing" | "offer_sent" | "accepted" | "declined" | "closed";

const statusColors: Record<CashOfferStatus, string> = {
  new: "bg-blue-500",
  reviewing: "bg-yellow-500",
  offer_sent: "bg-purple-500",
  accepted: "bg-green-500",
  declined: "bg-red-500",
  closed: "bg-gray-500",
};

const statusLabels: Record<CashOfferStatus, string> = {
  new: "New",
  reviewing: "Reviewing",
  offer_sent: "Offer Sent",
  accepted: "Accepted",
  declined: "Declined",
  closed: "Closed",
};

export default function AdminCashOffers() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [statusFilter, setStatusFilter] = useState<CashOfferStatus | "all">("all");
  const [selectedRequest, setSelectedRequest] = useState<number | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/");
    }
  }, [authLoading, user, setLocation]);

  // Fetch cash offers based on filter
  const { data: requests, isLoading, refetch } = trpc.cashOffers.list.useQuery(
    statusFilter === "all" ? undefined : { status: statusFilter },
    {
      enabled: user?.role === "admin",
    }
  );

  // Fetch selected request details
  const { data: requestDetail } = trpc.cashOffers.getById.useQuery(
    { id: selectedRequest! },
    {
      enabled: selectedRequest !== null,
    }
  );

  // Update status mutation
  const updateStatusMutation = trpc.cashOffers.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Status updated successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update status");
    },
  });

  // Update notes mutation
  const updateNotesMutation = trpc.cashOffers.updateNotes.useMutation({
    onSuccess: () => {
      toast.success("Notes saved successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save notes");
    },
  });

  const handleStatusChange = (id: number, status: CashOfferStatus) => {
    updateStatusMutation.mutate({ id, status });
  };

  const handleViewDetails = (id: number) => {
    setSelectedRequest(id);
    setShowDetailDialog(true);
  };

  const handleSaveNotes = (id: number, notes: string) => {
    updateNotesMutation.mutate({ id, notes });
  };

  // Check authentication and authorization
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have permission to access this page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Count by status
  const statusCounts = requests?.reduce((acc, req) => {
    acc[req.status] = (acc[req.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Cash Offer Requests</h1>
          <p className="text-muted-foreground">
            Manage and track all incoming cash offer requests
          </p>
        </div>

        {/* Status overview cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {(["new", "reviewing", "offer_sent", "accepted", "declined", "closed"] as CashOfferStatus[]).map((status) => (
            <Card key={status} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter(status)}>
              <CardHeader className="p-4">
                <CardTitle className="text-sm font-medium">{statusLabels[status]}</CardTitle>
                <div className="text-2xl font-bold">{statusCounts[status] || 0}</div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Filter controls */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <CardTitle className="text-lg">Filter Requests</CardTitle>
              </div>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as CashOfferStatus | "all")}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Requests</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="reviewing">Reviewing</SelectItem>
                  <SelectItem value="offer_sent">Offer Sent</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
        </Card>

        {/* Requests table */}
        <Card>
          <CardHeader>
            <CardTitle>
              {statusFilter === "all" ? "All Requests" : `${statusLabels[statusFilter]} Requests`}
              {requests && ` (${requests.length})`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : requests && requests.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Photos</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="whitespace-nowrap">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{request.fullName}</div>
                            <div className="text-sm text-muted-foreground">{request.email}</div>
                            <div className="text-sm text-muted-foreground">{request.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{request.street}</div>
                            <div className="text-muted-foreground">
                              {request.city}, {request.state} {request.zipCode}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{request.bedrooms} bed, {request.bathrooms} bath</div>
                            <div className="text-muted-foreground">{request.squareFeet} sqft</div>
                            <div className="text-muted-foreground">Built: {request.yearBuilt}</div>
                            <div className="text-muted-foreground capitalize">{request.condition.replace(/_/g, " ")}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {Array.isArray(request.photoUrls) ? request.photoUrls.length : 0} photos
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={request.status}
                            onValueChange={(value) => handleStatusChange(request.id, value as CashOfferStatus)}
                            disabled={updateStatusMutation.isPending}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue>
                                <Badge className={statusColors[request.status]}>
                                  {statusLabels[request.status]}
                                </Badge>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="reviewing">Reviewing</SelectItem>
                              <SelectItem value="offer_sent">Offer Sent</SelectItem>
                              <SelectItem value="accepted">Accepted</SelectItem>
                              <SelectItem value="declined">Declined</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(request.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No cash offer requests found.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cash Offer Request Details</DialogTitle>
            <DialogDescription>
              View property details, photos, and manage internal notes
            </DialogDescription>
          </DialogHeader>

          {requestDetail && (
            <div className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="font-semibold mb-2">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label>Full Name</Label>
                    <p>{requestDetail.fullName}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p>{requestDetail.email}</p>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <p>{requestDetail.phone}</p>
                  </div>
                  <div>
                    <Label>Submitted</Label>
                    <p>{new Date(requestDetail.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Property Information */}
              <div>
                <h3 className="font-semibold mb-2">Property Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="col-span-2">
                    <Label>Address</Label>
                    <p>{requestDetail.street}, {requestDetail.city}, {requestDetail.state} {requestDetail.zipCode}</p>
                  </div>
                  <div>
                    <Label>Bedrooms</Label>
                    <p>{requestDetail.bedrooms}</p>
                  </div>
                  <div>
                    <Label>Bathrooms</Label>
                    <p>{requestDetail.bathrooms}</p>
                  </div>
                  <div>
                    <Label>Square Feet</Label>
                    <p>{requestDetail.squareFeet}</p>
                  </div>
                  <div>
                    <Label>Year Built</Label>
                    <p>{requestDetail.yearBuilt}</p>
                  </div>
                  <div className="col-span-2">
                    <Label>Condition</Label>
                    <p className="capitalize">{requestDetail.condition.replace(/_/g, " ")}</p>
                  </div>
                </div>
              </div>

              {/* Homeowner Notes */}
              {requestDetail.additionalNotes && (
                <div>
                  <h3 className="font-semibold mb-2">Homeowner Notes</h3>
                  <p className="text-sm bg-gray-50 p-3 rounded-md">{requestDetail.additionalNotes}</p>
                </div>
              )}

              {/* Property Photos */}
              {Array.isArray(requestDetail.photoUrls) && requestDetail.photoUrls.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Property Photos ({requestDetail.photoUrls.length})</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {requestDetail.photoUrls.map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block aspect-video bg-gray-100 rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
                      >
                        <img
                          src={url}
                          alt={`Property photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Internal Notes */}
              <div>
                <h3 className="font-semibold mb-2">Internal Notes (Admin Only)</h3>
                <Textarea
                  placeholder="Add internal notes about this request..."
                  defaultValue={requestDetail.internalNotes || ""}
                  rows={4}
                  onBlur={(e) => handleSaveNotes(requestDetail.id, e.target.value)}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Notes are saved automatically when you click outside the text area
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
