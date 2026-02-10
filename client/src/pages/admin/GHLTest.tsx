import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { trpc } from "@/lib/trpc";
import { Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function GHLTest() {
  const [testResult, setTestResult] = useState<any>(null);
  const [fieldMappingData, setFieldMappingData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    propertyAddress: "",
    propertyZip: "",
    foreclosureStage: "",
  });

  const { data: status, isLoading: statusLoading } = trpc.ghlTest.getStatus.useQuery();
  const testConnectionMutation = trpc.ghlTest.testConnection.useMutation();
  const testFieldMappingMutation = trpc.ghlTest.testFieldMapping.useMutation();

  const handleTestConnection = async () => {
    setTestResult(null);
    try {
      const result = await testConnectionMutation.mutateAsync();
      setTestResult(result);
      
      if (result.success) {
        toast.success("GHL Connection Test Successful!", {
          description: "Check your GHL dashboard for the test contact.",
        });
      } else {
        toast.error("GHL Connection Test Failed", {
          description: result.error,
        });
      }
    } catch (error) {
      toast.error("Test failed", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const handleTestFieldMapping = async () => {
    setTestResult(null);
    
    // Validate required fields
    if (!fieldMappingData.email || !fieldMappingData.firstName || !fieldMappingData.phone || !fieldMappingData.propertyZip) {
      toast.error("Missing required fields", {
        description: "Please fill in Email, First Name, Phone, and Property ZIP",
      });
      return;
    }

    try {
      const result = await testFieldMappingMutation.mutateAsync(fieldMappingData);
      setTestResult(result);
      
      if (result.success) {
        toast.success("Field Mapping Test Successful!", {
          description: "All fields were correctly mapped to GHL.",
        });
      } else {
        toast.error("Field Mapping Test Failed", {
          description: result.error,
        });
      }
    } catch (error) {
      toast.error("Test failed", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">GoHighLevel Integration Test</h1>
        <p className="text-muted-foreground">
          Test and verify your GHL API connection and field mapping configuration.
        </p>
      </div>

      {/* Configuration Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Configuration Status</CardTitle>
          <CardDescription>Current GHL API configuration</CardDescription>
        </CardHeader>
        <CardContent>
          {statusLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Checking configuration...</span>
            </div>
          ) : status ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="font-medium">API Key</span>
                <span>{status.details.apiKey}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="font-medium">Location ID</span>
                <span>{status.details.locationId}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="font-medium">API URL</span>
                <span className="text-sm">{status.details.apiUrl}</span>
              </div>
              <Alert variant={status.ready ? "default" : "destructive"} className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {status.ready
                    ? "✅ GHL API is configured and ready to use"
                    : "❌ GHL API is not fully configured. Please set GHL_API_KEY and GHL_LOCATION_ID environment variables."}
                </AlertDescription>
              </Alert>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Connection Test */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>1. Test API Connection</CardTitle>
          <CardDescription>
            Creates a test contact in GHL to verify the API connection is working
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleTestConnection}
            disabled={testConnectionMutation.isPending || !status?.ready}
            className="w-full"
          >
            {testConnectionMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Connection...
              </>
            ) : (
              "Run Connection Test"
            )}
          </Button>

          {testResult && testResult.contactId && (
            <Alert variant={testResult.success ? "default" : "destructive"}>
              {testResult.success ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertDescription>
                {testResult.message}
                {testResult.instructions && (
                  <div className="mt-2 text-sm">
                    <strong>Instructions:</strong> {testResult.instructions}
                  </div>
                )}
                {testResult.contactId && (
                  <div className="mt-2 text-sm">
                    <strong>Contact ID:</strong> {testResult.contactId}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Field Mapping Test */}
      <Card>
        <CardHeader>
          <CardTitle>2. Test Field Mapping</CardTitle>
          <CardDescription>
            Verify that website fields are correctly mapped to GHL custom fields
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="test@example.com"
                value={fieldMappingData.email}
                onChange={(e) =>
                  setFieldMappingData({ ...fieldMappingData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                placeholder="John"
                value={fieldMappingData.firstName}
                onChange={(e) =>
                  setFieldMappingData({ ...fieldMappingData, firstName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={fieldMappingData.lastName}
                onChange={(e) =>
                  setFieldMappingData({ ...fieldMappingData, lastName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                placeholder="555-0100"
                value={fieldMappingData.phone}
                onChange={(e) =>
                  setFieldMappingData({ ...fieldMappingData, phone: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="propertyAddress">Property Address</Label>
              <Input
                id="propertyAddress"
                placeholder="123 Main St"
                value={fieldMappingData.propertyAddress}
                onChange={(e) =>
                  setFieldMappingData({ ...fieldMappingData, propertyAddress: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="propertyZip">Property ZIP *</Label>
              <Input
                id="propertyZip"
                placeholder="75001"
                value={fieldMappingData.propertyZip}
                onChange={(e) =>
                  setFieldMappingData({ ...fieldMappingData, propertyZip: e.target.value })
                }
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="foreclosureStage">Foreclosure Stage</Label>
              <Input
                id="foreclosureStage"
                placeholder="Notice of Default"
                value={fieldMappingData.foreclosureStage}
                onChange={(e) =>
                  setFieldMappingData({ ...fieldMappingData, foreclosureStage: e.target.value })
                }
              />
            </div>
          </div>

          <Button
            onClick={handleTestFieldMapping}
            disabled={testFieldMappingMutation.isPending || !status?.ready}
            className="w-full"
          >
            {testFieldMappingMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Field Mapping...
              </>
            ) : (
              "Run Field Mapping Test"
            )}
          </Button>

          {testResult && testResult.mappedFields && (
            <Alert variant={testResult.success ? "default" : "destructive"}>
              {testResult.success ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertDescription>
                {testResult.message}
                {testResult.contactId && (
                  <div className="mt-2 text-sm">
                    <strong>Contact ID:</strong> {testResult.contactId}
                  </div>
                )}
                {testResult.mappedFields && (
                  <div className="mt-3 space-y-1 text-sm">
                    <strong>Mapped Fields:</strong>
                    <ul className="list-disc list-inside ml-2">
                      <li>Name: {testResult.mappedFields.name}</li>
                      <li>Email: {testResult.mappedFields.email}</li>
                      <li>Phone: {testResult.mappedFields.phone}</li>
                      <li>Property Address: {testResult.mappedFields.propertyAddress || "N/A"}</li>
                      <li>Property ZIP: {testResult.mappedFields.propertyZip}</li>
                      <li>Foreclosure Stage: {testResult.mappedFields.foreclosureStage || "N/A"}</li>
                    </ul>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Integration Summary */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Integration Summary</CardTitle>
          <CardDescription>What gets synced to GHL</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">✅ All Form Submissions</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 space-y-1">
                <li>Contact forms automatically create/update GHL contacts</li>
                <li>All contacts tagged with "Foreclosure_Hub_Lead"</li>
                <li>Custom fields mapped: Property Address, ZIP, Foreclosure Stage</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">✅ Timeline Calculator</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 space-y-1">
                <li>Email submissions sync contact to GHL</li>
                <li>Detailed timeline note added with all calculated dates</li>
                <li>Tagged with "Timeline_Calculator"</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">✅ Saved Timelines</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 space-y-1">
                <li>When users save timeline to dashboard, GHL is notified</li>
                <li>Tagged with "Timeline_Saved" and "Registered_User"</li>
                <li>High engagement signal for follow-up</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">✅ Progress Tracking</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 space-y-1">
                <li>Action item completions tracked in GHL notes</li>
                <li>Completion percentage updated in custom fields</li>
                <li>Shows user engagement level</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
