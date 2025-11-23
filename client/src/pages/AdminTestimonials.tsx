import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CheckCircle, XCircle, Edit, Trash2, Eye, Calendar, MapPin, User } from "lucide-react";

type Testimonial = {
  id: number;
  name: string;
  location: string;
  situation: string;
  story: string;
  outcome: string;
  permissionToPublish: "yes" | "no";
  email: string | null;
  phone: string | null;
  status: "pending" | "approved" | "rejected";
  theme: "loan_modification" | "foreclosure_prevention" | "short_sale" | "cash_offer" | "deed_in_lieu" | "bankruptcy_alternative" | "job_loss" | "medical_emergency" | "divorce" | "other" | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export default function AdminTestimonials() {
  const [statusFilter, setStatusFilter] = useState<"pending" | "approved" | "rejected" | undefined>(undefined);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [deletingTestimonialId, setDeletingTestimonialId] = useState<number | null>(null);
  const [viewingTestimonial, setViewingTestimonial] = useState<Testimonial | null>(null);

  const utils = trpc.useUtils();
  const { data: testimonials, isLoading } = trpc.testimonials.list.useQuery({ status: statusFilter });
  
  const updateStatusMutation = trpc.testimonials.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Testimonial status updated successfully");
      utils.testimonials.list.invalidate();
    },
    onError: (error) => {
      toast.error(`Failed to update status: ${error.message}`);
    },
  });

  const updateMutation = trpc.testimonials.update.useMutation({
    onSuccess: () => {
      toast.success("Testimonial updated successfully");
      utils.testimonials.list.invalidate();
      setEditingTestimonial(null);
    },
    onError: (error) => {
      toast.error(`Failed to update testimonial: ${error.message}`);
    },
  });

  const deleteMutation = trpc.testimonials.delete.useMutation({
    onSuccess: () => {
      toast.success("Testimonial deleted successfully");
      utils.testimonials.list.invalidate();
      setDeletingTestimonialId(null);
    },
    onError: (error) => {
      toast.error(`Failed to delete testimonial: ${error.message}`);
    },
  });

  const handleApprove = (id: number) => {
    updateStatusMutation.mutate({ id, status: "approved" });
  };

  const handleReject = (id: number) => {
    updateStatusMutation.mutate({ id, status: "rejected" });
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
  };

  const handleSaveEdit = () => {
    if (!editingTestimonial) return;
    
    updateMutation.mutate({
      id: editingTestimonial.id,
      name: editingTestimonial.name,
      location: editingTestimonial.location,
      situation: editingTestimonial.situation,
      story: editingTestimonial.story,
      outcome: editingTestimonial.outcome,
    });
  };

  const handleDelete = () => {
    if (deletingTestimonialId) {
      deleteMutation.mutate({ id: deletingTestimonialId });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-500">Pending</Badge>;
    }
  };

  const getPermissionBadge = (permission: string) => {
    return permission === "yes" ? (
      <Badge className="bg-blue-500">Can Publish</Badge>
    ) : (
      <Badge variant="outline">Internal Only</Badge>
    );
  };

  const pendingCount = testimonials?.filter(t => t.status === "pending").length || 0;
  const approvedCount = testimonials?.filter(t => t.status === "approved").length || 0;
  const rejectedCount = testimonials?.filter(t => t.status === "rejected").length || 0;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Testimonial Management</h1>
        <p className="text-muted-foreground">
          Review, approve, and manage user-submitted testimonials
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="cursor-pointer hover:bg-accent" onClick={() => setStatusFilter(undefined)}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">All Testimonials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testimonials?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:bg-accent" onClick={() => setStatusFilter("pending")}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-accent" onClick={() => setStatusFilter("approved")}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-accent" onClick={() => setStatusFilter("rejected")}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Indicator */}
      {statusFilter && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtering by:</span>
          <Badge>{statusFilter}</Badge>
          <Button variant="ghost" size="sm" onClick={() => setStatusFilter(undefined)}>
            Clear filter
          </Button>
        </div>
      )}

      {/* Testimonials List */}
      {isLoading ? (
        <div className="text-center py-12">Loading testimonials...</div>
      ) : testimonials && testimonials.length > 0 ? (
        <div className="space-y-4">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      {getStatusBadge(testimonial.status)}
                      {getPermissionBadge(testimonial.permissionToPublish)}
                      {testimonial.theme && (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          {testimonial.theme.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {testimonial.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(testimonial.createdAt).toLocaleDateString()}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewingTestimonial(testimonial)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(testimonial)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeletingTestimonialId(testimonial.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold text-sm">Situation:</span>
                    <p className="text-sm text-muted-foreground">{testimonial.situation}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-sm">Story:</span>
                    <p className="text-sm text-muted-foreground line-clamp-2">{testimonial.story}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-sm">Outcome:</span>
                    <p className="text-sm text-muted-foreground line-clamp-2">{testimonial.outcome}</p>
                  </div>
                </div>

                {testimonial.status === "pending" && (
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={() => handleApprove(testimonial.id)}
                      disabled={updateStatusMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleReject(testimonial.id)}
                      disabled={updateStatusMutation.isPending}
                      variant="destructive"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No testimonials found{statusFilter ? ` with status "${statusFilter}"` : ""}.
          </CardContent>
        </Card>
      )}

      {/* View Testimonial Dialog */}
      <Dialog open={!!viewingTestimonial} onOpenChange={() => setViewingTestimonial(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Testimonial Details</DialogTitle>
            <DialogDescription>Full testimonial information</DialogDescription>
          </DialogHeader>
          {viewingTestimonial && (
            <div className="space-y-4">
              <div className="flex gap-2">
                {getStatusBadge(viewingTestimonial.status)}
                {getPermissionBadge(viewingTestimonial.permissionToPublish)}
              </div>
              
              <div>
                <Label>Name</Label>
                <p className="text-sm">{viewingTestimonial.name}</p>
              </div>
              
              <div>
                <Label>Location</Label>
                <p className="text-sm">{viewingTestimonial.location}</p>
              </div>
              
              <div>
                <Label>Situation</Label>
                <p className="text-sm">{viewingTestimonial.situation}</p>
              </div>
              
              <div>
                <Label>Story</Label>
                <p className="text-sm whitespace-pre-wrap">{viewingTestimonial.story}</p>
              </div>
              
              <div>
                <Label>Outcome</Label>
                <p className="text-sm whitespace-pre-wrap">{viewingTestimonial.outcome}</p>
              </div>
              
              {viewingTestimonial.email && (
                <div>
                  <Label>Email</Label>
                  <p className="text-sm">{viewingTestimonial.email}</p>
                </div>
              )}
              
              {viewingTestimonial.phone && (
                <div>
                  <Label>Phone</Label>
                  <p className="text-sm">{viewingTestimonial.phone}</p>
                </div>
              )}
              
              <div>
                <Label>Submitted</Label>
                <p className="text-sm">{new Date(viewingTestimonial.createdAt).toLocaleString()}</p>
              </div>
              
              {viewingTestimonial.publishedAt && (
                <div>
                  <Label>Published</Label>
                  <p className="text-sm">{new Date(viewingTestimonial.publishedAt).toLocaleString()}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Testimonial Dialog */}
      <Dialog open={!!editingTestimonial} onOpenChange={() => setEditingTestimonial(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Testimonial</DialogTitle>
            <DialogDescription>Make changes to the testimonial content</DialogDescription>
          </DialogHeader>
          {editingTestimonial && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editingTestimonial.name}
                  onChange={(e) =>
                    setEditingTestimonial({ ...editingTestimonial, name: e.target.value })
                  }
                />
              </div>
              
              <div>
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={editingTestimonial.location}
                  onChange={(e) =>
                    setEditingTestimonial({ ...editingTestimonial, location: e.target.value })
                  }
                />
              </div>
              
              <div>
                <Label htmlFor="edit-situation">Situation</Label>
                <Input
                  id="edit-situation"
                  value={editingTestimonial.situation}
                  onChange={(e) =>
                    setEditingTestimonial({ ...editingTestimonial, situation: e.target.value })
                  }
                />
              </div>
              
              <div>
                <Label htmlFor="edit-story">Story</Label>
                <Textarea
                  id="edit-story"
                  value={editingTestimonial.story}
                  onChange={(e) =>
                    setEditingTestimonial({ ...editingTestimonial, story: e.target.value })
                  }
                  rows={6}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-outcome">Outcome</Label>
                <Textarea
                  id="edit-outcome"
                  value={editingTestimonial.outcome}
                  onChange={(e) =>
                    setEditingTestimonial({ ...editingTestimonial, outcome: e.target.value })
                  }
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-theme">Theme Category</Label>
                <select
                  id="edit-theme"
                  value={editingTestimonial.theme || ""}
                  onChange={(e) =>
                    setEditingTestimonial({ ...editingTestimonial, theme: e.target.value as Testimonial["theme"] })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">No Theme</option>
                  <option value="loan_modification">Loan Modification</option>
                  <option value="foreclosure_prevention">Foreclosure Prevention</option>
                  <option value="short_sale">Short Sale</option>
                  <option value="cash_offer">Cash Offer</option>
                  <option value="deed_in_lieu">Deed in Lieu</option>
                  <option value="bankruptcy_alternative">Bankruptcy Alternative</option>
                  <option value="job_loss">Job Loss</option>
                  <option value="medical_emergency">Medical Emergency</option>
                  <option value="divorce">Divorce</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTestimonial(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={updateMutation.isPending}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingTestimonialId} onOpenChange={() => setDeletingTestimonialId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the testimonial.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
