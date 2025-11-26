import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Copy, ExternalLink, Trash2, BarChart3, Link as LinkIcon, Upload, Download, Power, PowerOff, QrCode } from "lucide-react";
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
  const [isBulkImportDialogOpen, setIsBulkImportDialogOpen] = useState(false);
  const [qrCodeDialogOpen, setQrCodeDialogOpen] = useState(false);
  const [selectedLinkForQR, setSelectedLinkForQR] = useState<string | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [importResults, setImportResults] = useState<{
    total: number;
    successCount: number;
    errorCount: number;
    results: Array<{
      row: number;
      success: boolean;
      shortCode?: string;
      error?: string;
      originalUrl: string;
    }>;
  } | null>(null);
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [title, setTitle] = useState("");
  const [utmSource, setUtmSource] = useState("");
  const [utmMedium, setUtmMedium] = useState("");
  const [utmCampaign, setUtmCampaign] = useState("");
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);

  // Fetch all shortened links
  const { data: links = [], isLoading, refetch } = trpc.links.getAll.useQuery();
  const { data: campaigns = [] } = trpc.campaigns.getAll.useQuery();

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

  // Bulk import mutation
  const bulkImportMutation = trpc.links.bulkImport.useMutation({
    onSuccess: (data) => {
      setImportResults(data);
      toast.success(`Imported ${data.successCount} of ${data.total} links`);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to import CSV");
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        toast.error('Please select a CSV file');
        return;
      }
      setCsvFile(file);
      setImportResults(null);
    }
  };

  const handleBulkImport = async () => {
    if (!csvFile) {
      toast.error('Please select a CSV file');
      return;
    }

    try {
      const csvContent = await csvFile.text();
      bulkImportMutation.mutate({ csvContent });
    } catch (error) {
      toast.error('Failed to read CSV file');
    }
  };

  const handleDownloadTemplate = () => {
    const template = 'originalUrl,title,customAlias,utmSource,utmMedium,utmCampaign\nhttps://example.com/page1,Example Page,page1,email,newsletter,campaign1\nhttps://example.com/page2,Another Page,,social,facebook,campaign2';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'link-import-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Template downloaded');
  };

  const resetBulkImportDialog = () => {
    setCsvFile(null);
    setImportResults(null);
    setIsBulkImportDialogOpen(false);
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
            <div className="flex gap-3">
              <Dialog open={isBulkImportDialogOpen} onOpenChange={setIsBulkImportDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                    <Upload className="w-4 h-4 mr-2" />
                    Bulk Import
                  </Button>
                </DialogTrigger>
              </Dialog>
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

            {/* Bulk Import Dialog */}
            <Dialog open={isBulkImportDialogOpen} onOpenChange={(open) => {
              if (!open) resetBulkImportDialog();
              setIsBulkImportDialogOpen(open);
            }}>
              <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Bulk Import Links</DialogTitle>
                  <DialogDescription>
                    Upload a CSV file to create multiple short links at once
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {/* Template Download */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Download className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-blue-900 mb-1">CSV Template</h4>
                        <p className="text-xs text-blue-700 mb-2">
                          Download the template to see the required format. Required column: originalUrl. Optional: title, customAlias, utmSource, utmMedium, utmCampaign
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDownloadTemplate}
                          className="border-blue-600 text-blue-600 hover:bg-blue-100"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download Template
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* File Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="csvFile">Select CSV File</Label>
                    <Input
                      id="csvFile"
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                    {csvFile && (
                      <p className="text-sm text-green-600 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                        {csvFile.name} selected
                      </p>
                    )}
                  </div>

                  {/* Import Results */}
                  {importResults && (
                    <div className="space-y-3">
                      <div className="bg-slate-50 border rounded-lg p-4">
                        <h4 className="font-medium text-sm mb-2">Import Summary</h4>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-slate-900">{importResults.total}</div>
                            <div className="text-xs text-slate-600">Total Rows</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-green-600">{importResults.successCount}</div>
                            <div className="text-xs text-slate-600">Successful</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-red-600">{importResults.errorCount}</div>
                            <div className="text-xs text-slate-600">Failed</div>
                          </div>
                        </div>
                      </div>

                      {/* Results Table */}
                      {importResults.results.length > 0 && (
                        <div className="border rounded-lg overflow-hidden">
                          <div className="max-h-[300px] overflow-y-auto">
                            <Table>
                              <TableHeader className="bg-slate-50 sticky top-0">
                                <TableRow>
                                  <TableHead className="w-16">Row</TableHead>
                                  <TableHead>URL</TableHead>
                                  <TableHead className="w-24">Status</TableHead>
                                  <TableHead>Short Code / Error</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {importResults.results.map((result, idx) => (
                                  <TableRow key={idx}>
                                    <TableCell className="font-mono text-xs">{result.row}</TableCell>
                                    <TableCell className="text-xs truncate max-w-[200px]" title={result.originalUrl}>
                                      {result.originalUrl}
                                    </TableCell>
                                    <TableCell>
                                      {result.success ? (
                                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Success</Badge>
                                      ) : (
                                        <Badge variant="destructive">Failed</Badge>
                                      )}
                                    </TableCell>
                                    <TableCell className="text-xs">
                                      {result.success ? (
                                        <code className="bg-slate-100 px-2 py-1 rounded">{result.shortCode}</code>
                                      ) : (
                                        <span className="text-red-600">{result.error}</span>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={resetBulkImportDialog}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={handleBulkImport}
                    disabled={!csvFile || bulkImportMutation.isPending}
                    className="bg-gradient-to-r from-blue-600 to-teal-600"
                  >
                    {bulkImportMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Import Links
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            </div>
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
                            {!link.isActive && (
                              <Badge variant="destructive" className="text-xs">
                                Inactive
                              </Badge>
                            )}
                            {link.isExpired && link.isActive && (
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
                              onClick={() => {
                                setSelectedLinkForQR(link.shortCode);
                                setQrCodeDialogOpen(true);
                              }}
                            >
                              <QrCode className="w-4 h-4" />
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

      {/* QR Code Dialog */}
      <Dialog open={qrCodeDialogOpen} onOpenChange={setQrCodeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code</DialogTitle>
            <DialogDescription>
              Scan this QR code to access the shortened link
            </DialogDescription>
          </DialogHeader>
          <QRCodeDisplay shortCode={selectedLinkForQR || ""} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// QR Code Display Component
function QRCodeDisplay({ shortCode }: { shortCode: string }) {
  const { data, isLoading } = trpc.links.generateQRCode.useQuery(
    { shortCode, size: 300 },
    { enabled: !!shortCode }
  );

  const handleDownload = () => {
    if (!data?.qrCode) return;

    const link = document.createElement("a");
    link.href = data.qrCode;
    link.download = `qr-${data.shortCode}.png`;
    link.click();
    toast.success("QR code downloaded");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-center bg-white p-4 rounded-lg border">
        <img src={data.qrCode} alt="QR Code" className="w-64 h-64" />
      </div>
      <div className="space-y-2">
        <div className="text-sm">
          <span className="font-medium">Short URL:</span>
          <code className="ml-2 text-sm bg-slate-100 px-2 py-1 rounded">
            {data.shortUrl}
          </code>
        </div>
        {data.title && (
          <div className="text-sm">
            <span className="font-medium">Title:</span>
            <span className="ml-2 text-slate-600">{data.title}</span>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Button onClick={handleDownload} className="flex-1">
          <Download className="w-4 h-4 mr-2" />
          Download QR Code
        </Button>
      </div>
    </div>
  );
}
