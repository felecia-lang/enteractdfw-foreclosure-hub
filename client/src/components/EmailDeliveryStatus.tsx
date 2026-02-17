import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, CheckCircle2, Eye, MousePointerClick, AlertCircle, Clock } from "lucide-react";
import { format } from "date-fns";

/**
 * Email Delivery Status Component
 * 
 * Displays email delivery tracking data from Resend webhooks.
 * Shows email history, delivery status, and engagement metrics for the current user.
 */

interface EmailStatusIconProps {
  status: string;
}

function EmailStatusIcon({ status }: EmailStatusIconProps) {
  switch (status) {
    case "sent":
      return <Clock className="h-4 w-4 text-blue-500" />;
    case "delivered":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case "opened":
      return <Eye className="h-4 w-4 text-purple-500" />;
    case "clicked":
      return <MousePointerClick className="h-4 w-4 text-orange-500" />;
    case "bounced":
    case "failed":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Mail className="h-4 w-4 text-gray-400" />;
  }
}

function EmailStatusBadge({ status }: { status: string }) {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    sent: "secondary",
    delivered: "default",
    opened: "default",
    clicked: "default",
    bounced: "destructive",
    failed: "destructive",
  };

  return (
    <Badge variant={variants[status] || "outline"} className="capitalize">
      {status}
    </Badge>
  );
}

export default function EmailDeliveryStatus() {
  const { data: emails, isLoading: emailsLoading } = trpc.emailTracking.getMyEmails.useQuery();
  const { data: stats, isLoading: statsLoading } = trpc.emailTracking.getMyEmailStats.useQuery();

  if (emailsLoading || statsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Delivery Status
          </CardTitle>
          <CardDescription>Loading email tracking data...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!emails || emails.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Delivery Status
          </CardTitle>
          <CardDescription>
            No emails sent yet. Use the Timeline Calculator to receive your personalized timeline via email!
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Email Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Delivery Metrics
          </CardTitle>
          <CardDescription>Your email engagement statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Emails</p>
              <p className="text-2xl font-bold">{stats?.totalEmails || 0}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Delivery Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {stats?.deliveryRate.toFixed(1) || 0}%
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Open Rate</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats?.openRate.toFixed(1) || 0}%
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Click Rate</p>
              <p className="text-2xl font-bold text-orange-600">
                {stats?.clickRate.toFixed(1) || 0}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email History */}
      <Card>
        <CardHeader>
          <CardTitle>Email History</CardTitle>
          <CardDescription>Recent emails sent to you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {emails.map((email) => (
              <div
                key={email.id}
                className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="mt-1">
                  <EmailStatusIcon status={email.status} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium leading-none">{email.subject}</h4>
                    <EmailStatusBadge status={email.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Type: <span className="capitalize">{email.emailType.replace(/_/g, " ")}</span>
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span>Sent: {format(new Date(email.sentAt), "MMM d, yyyy h:mm a")}</span>
                    {email.deliveredAt && (
                      <span>Delivered: {format(new Date(email.deliveredAt), "MMM d, h:mm a")}</span>
                    )}
                    {email.openedAt && (
                      <span className="text-purple-600 font-medium">
                        Opened: {format(new Date(email.openedAt), "MMM d, h:mm a")}
                      </span>
                    )}
                    {email.clickedAt && (
                      <span className="text-orange-600 font-medium">
                        Clicked: {format(new Date(email.clickedAt), "MMM d, h:mm a")}
                      </span>
                    )}
                    {email.bouncedAt && (
                      <span className="text-red-600 font-medium">
                        Bounced: {format(new Date(email.bouncedAt), "MMM d, h:mm a")}
                      </span>
                    )}
                  </div>
                  {email.bounceReason && (
                    <p className="text-sm text-red-600 mt-2">
                      Bounce Reason: {email.bounceReason}
                    </p>
                  )}
                  {email.clickedUrl && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Clicked URL: <span className="text-blue-600">{email.clickedUrl}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
