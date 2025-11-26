import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Copy, ExternalLink, Trash2, BarChart3, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AdminLinks() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [title, setTitle] = useState("");
  const [utmSource, setUtmSource] = useState("");
  const [utmMedium, setUtmMedium] = useState("");
  const [utmCampaign, setUtmCampaign] = useState("");

  // Fetch all shortened links
  const { data: links, isLoading, refetch } = trpc.links.getAll.useQuery();

  // Create link mutation
  const createMutation = trpc.links.create.useMutation({
    onSuccess: (data) => {
      toast.success("Link created successfully!");
      setIsCreateDialogOpen(false);
      resetForm();
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create link");
    },
  });

  // Delete link mutation
  const deleteMutation = trpc.links.delete.useMutation({
    onSuccess: () => {
      toast.success("Link deleted successfully!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete link");
    },
  });

  const resetForm = () => {
    setOriginalUrl("");
    setCustomAlias("");
    setTitle("");
    setUtmSource("");
    setUtmMedium("");
    setUtmCampaign("");
  };

  const handleCreateLink = () => {
    if (!originalUrl) {
      toast.error("Original URL is required");
      return;
    }

    createMutation.mutate({
      originalUrl,
      customAlias: customAlias || undefined,
      title: title || undefined,
      utmSource: utmSource || undefined,
      utmMedium: utmMedium || undefined,
      utmCampaign: utmCampaign || undefined,
    });
  };

  const handleCopyLink = (shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl);
    toast.success("Link copied to clipboard!");
  };

  const handleDeleteLink = (shortCode: string, title?: string) => {
    if (confirm(`Are you sure you want to delete this link${title ? ` (${title})` : ""}?`)) {
      deleteMutation.mutate({ shortCode });
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Link Management</h1>
              <p className="text-slate-600 mt-1">Create and manage branded short links</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-teal-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Short Link
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create Short Link</DialogTitle>
                  <DialogDescription>
                    Generate a branded short URL with optional UTM parameters for tracking
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="originalUrl">Original URL *</Label>
                    <Input
                      id="originalUrl"
                      placeholder="https://example.com/page"
                      value={originalUrl}
                      onChange={(e) => setOriginalUrl(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title (optional)</Label>
                    <Input
                      id="title"
                      placeholder="Descriptive title for this link"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customAlias">Custom Alias (optional)</Label>
                    <Input
                      id="customAlias"
                      placeholder="my-custom-link"
                      value={customAlias}
                      onChange={(e) => setCustomAlias(e.target.value)}
                    />
                    <p className="text-xs text-slate-500">
                      Leave empty to generate a random 6-character code
                    </p>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-sm mb-3">UTM Parameters (optional)</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="utmSource" className="text-xs">Source</Label>
                        <Input
                          id="utmSource"
                          placeholder="facebook"
                          value={utmSource}
                          onChange={(e) => setUtmSource(e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="utmMedium" className="text-xs">Medium</Label>
                        <Input
                          id="utmMedium"
                          placeholder="social"
                          value={utmMedium}
                          onChange={(e) => setUtmMedium(e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="utmCampaign" className="text-xs">Campaign</Label>
                        <Input
                          id="utmCampaign"
                          placeholder="spring-promo"
                          value={utmCampaign}
                          onChange={(e) => setUtmCampaign(e.target.value)}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreateDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateLink}
                    disabled={createMutation.isPending}
                    className="bg-gradient-to-r from-blue-600 to-teal-600"
                  >
                    {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Create Link
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Links</CardDescription>
              <CardTitle className="text-3xl">{links?.length || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-slate-600">
                <LinkIcon className="w-4 h-4 mr-2" />
                Active shortened links
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Clicks</CardDescription>
              <CardTitle className="text-3xl">
                {links?.reduce((sum, link) => sum + (link.clicks || 0), 0) || 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-slate-600">
                <BarChart3 className="w-4 h-4 mr-2" />
                Across all links
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Avg. Clicks per Link</CardDescription>
              <CardTitle className="text-3xl">
                {links && links.length > 0
                  ? Math.round(links.reduce((sum, link) => sum + (link.clicks || 0), 0) / links.length)
                  : 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-slate-600">
                <BarChart3 className="w-4 h-4 mr-2" />
                Performance metric
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Links Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Shortened Links</CardTitle>
            <CardDescription>
              Manage your branded short URLs and track their performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
              </div>
            ) : links && links.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Short URL</TableHead>
                      <TableHead>Original URL</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="text-center">Clicks</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {links.map((link) => (
                      <TableRow key={link.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="text-sm bg-slate-100 px-2 py-1 rounded">
                              {link.customAlias || link.shortCode}
                            </code>
                            {link.isExpired && (
                              <Badge variant="destructive" className="text-xs">
                                Expired
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate text-sm text-slate-600">
                            {link.originalUrl}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate text-sm">
                            {link.title || <span className="text-slate-400">—</span>}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">{link.clicks}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {formatDate(link.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyLink(link.shortUrl)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(link.shortUrl, "_blank")}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteLink(link.shortCode, link.title || undefined)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <LinkIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No links yet</h3>
                <p className="text-slate-600 mb-4">
                  Create your first shortened link to get started
                </p>
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-teal-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Short Link
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
