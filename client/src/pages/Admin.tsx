import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import {
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Mail,
  MapPin,
  Phone,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type LeadStatus = "new" | "contacted" | "qualified" | "closed";

export default function Admin() {
  const { user, loading, isAuthenticated } = useAuth();
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState<number | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState<"general" | "call" | "email" | "meeting">("general");

  // Fetch leads
  const { data: leads = [], isLoading: leadsLoading, refetch } = trpc.leads.list.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // Fetch selected lead details
  const { data: leadDetails } = trpc.leads.getById.useQuery(
    { id: selectedLead! },
    { enabled: selectedLead !== null }
  );

  // Fetch notes for selected lead
  const { data: leadNotes = [], refetch: refetchNotes } = trpc.leads.getNotes.useQuery(
    { leadId: selectedLead! },
    { enabled: selectedLead !== null }
  );

  // Mutations
  const updateStatusMutation = trpc.leads.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Lead status updated successfully");
      refetch();
      refetchNotes();
    },
    onError: () => {
      toast.error("Failed to update lead status");
    },
  });

  const addNoteMutation = trpc.leads.addNote.useMutation({
    onSuccess: () => {
      toast.success("Note added successfully");
      setNewNote("");
      refetchNotes();
    },
    onError: () => {
      toast.error("Failed to add note");
    },
  });

  // Filter and search leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
      const matchesSearch =
        searchQuery === "" ||
        lead.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone.includes(searchQuery) ||
        lead.propertyZip.includes(searchQuery);
      return matchesStatus && matchesSearch;
    });
  }, [leads, statusFilter, searchQuery]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = leads.length;
    const newLeads = leads.filter((l) => l.status === "new").length;
    const contacted = leads.filter((l) => l.status === "contacted").length;
    const qualified = leads.filter((l) => l.status === "qualified").length;
    const closed = leads.filter((l) => l.status === "closed").length;
    const conversionRate = total > 0 ? ((closed / total) * 100).toFixed(1) : "0.0";

    return { total, newLeads, contacted, qualified, closed, conversionRate };
  }, [leads]);

  const handleStatusChange = (leadId: number, newStatus: LeadStatus) => {
    updateStatusMutation.mutate({ id: leadId, status: newStatus });
  };

  const handleAddNote = () => {
    if (!selectedLead || !newNote.trim()) return;
    addNoteMutation.mutate({
      leadId: selectedLead,
      note: newNote,
      noteType,
    });
  };

  const utils = trpc.useUtils();

  const handleExportCSV = async () => {
    try {
      // Get lead IDs to export (filtered leads)
      const leadIds = filteredLeads.map(lead => lead.id);
      
      // Call the export API
      const result = await utils.leads.exportCSV.fetch({ leadIds });
      
      if (result) {
        // Create a blob from the CSV string
        const blob = new Blob([result.csv], { type: 'text/csv;charset=utf-8;' });
        
        // Create a download link
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', result.filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast.success(`Exported ${result.count} leads to CSV`);
      }
    } catch (error) {
      console.error('CSV export error:', error);
      toast.error("Failed to export leads");
    }
  };

  const openLeadDetail = (leadId: number) => {
    setSelectedLead(leadId);
    setIsDetailOpen(true);
  };

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "contacted":
        return "bg-yellow-100 text-yellow-800";
      case "qualified":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: LeadStatus) => {
    switch (status) {
      case "new":
        return <Clock className="h-4 w-4" />;
      case "contacted":
        return <Phone className="h-4 w-4" />;
      case "qualified":
        return <CheckCircle2 className="h-4 w-4" />;
      case "closed":
        return <XCircle className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A6A6] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You must be logged in as an administrator to access this page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#0A2342] text-white py-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">Lead Management Dashboard</h1>
          <p className="text-gray-300 mt-2">Welcome back, {user?.name || "Admin"}</p>
        </div>
      </div>

      <div className="container mx-auto py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Leads</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.newLeads}</div>
              <p className="text-xs text-muted-foreground">Awaiting contact</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Qualified</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.qualified}</div>
              <p className="text-xs text-muted-foreground">Ready to close</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#00A6A6]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">{stats.closed} closed</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search by name, email, phone, or ZIP..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="w-full md:w-48">
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leads Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Leads ({filteredLeads.length})</CardTitle>
                <CardDescription>
                  Click on a lead to view details and add notes
                </CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={handleExportCSV}
                disabled={filteredLeads.length === 0}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {leadsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00A6A6] mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading leads...</p>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No leads found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Property ZIP</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.map((lead) => (
                      <TableRow
                        key={lead.id}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => openLeadDetail(lead.id)}
                      >
                        <TableCell className="font-medium">{lead.firstName}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1 text-sm">
                            <div className="flex items-center gap-2">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span className="text-xs">{lead.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <span className="text-xs">{lead.phone}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            {lead.propertyZip}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              lead.status
                            )}`}
                          >
                            {getStatusIcon(lead.status)}
                            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Select
                            value={lead.status}
                            onValueChange={(value: LeadStatus) =>
                              handleStatusChange(lead.id, value)
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="contacted">Contacted</SelectItem>
                              <SelectItem value="qualified">Qualified</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lead Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
            <DialogDescription>
              View and manage lead information and activity history
            </DialogDescription>
          </DialogHeader>

          {leadDetails && (
            <div className="space-y-6">
              {/* Lead Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Name</Label>
                  <p className="text-base font-medium">{leadDetails.firstName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Status</Label>
                  <p>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        leadDetails.status
                      )}`}
                    >
                      {getStatusIcon(leadDetails.status)}
                      {leadDetails.status.charAt(0).toUpperCase() + leadDetails.status.slice(1)}
                    </span>
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Email</Label>
                  <p className="text-base">{leadDetails.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Phone</Label>
                  <p className="text-base">{leadDetails.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Property ZIP</Label>
                  <p className="text-base">{leadDetails.propertyZip}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Source</Label>
                  <p className="text-base">{leadDetails.source}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Created</Label>
                  <p className="text-base">
                    {new Date(leadDetails.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Last Updated</Label>
                  <p className="text-base">
                    {new Date(leadDetails.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Notes Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Activity & Notes</h3>

                {/* Add New Note */}
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <Label htmlFor="newNote">Add New Note</Label>
                  <div className="flex gap-2 mt-2">
                    <Select value={noteType} onValueChange={(value: any) => setNoteType(value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="call">Call</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                      </SelectContent>
                    </Select>
                    <Textarea
                      id="newNote"
                      placeholder="Enter note details..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      rows={2}
                      className="flex-1"
                    />
                  </div>
                  <Button
                    onClick={handleAddNote}
                    disabled={!newNote.trim() || addNoteMutation.isPending}
                    className="mt-2 bg-[#00A6A6] hover:bg-[#008888]"
                  >
                    Add Note
                  </Button>
                </div>

                {/* Notes List */}
                <div className="space-y-3">
                  {leadNotes.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No notes yet</p>
                  ) : (
                    leadNotes.map((note) => (
                      <div key={note.id} className="p-3 bg-white border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-xs font-medium text-gray-500 uppercase">
                            {note.noteType}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(note.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.note}</p>
                        {note.createdBy && (
                          <p className="text-xs text-gray-500 mt-2">By: {note.createdBy}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
