import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Calendar, CheckCircle2, Clock, TrendingUp, Activity } from "lucide-react";
import { Link } from "wouter";

interface TimelineStatusProps {
  hasData: boolean;
  hasSavedTimeline?: boolean;
  noticeOfDefaultDate?: string;
  foreclosureSaleDate?: string;
  daysUntilSale?: number;
  completionPercentage?: number;
  completedActions?: number;
  totalActions?: number;
  lastActivity?: string;
  engagementLevel?: "high" | "medium" | "low";
  tags?: string[];
  message?: string;
}

export function TimelineStatusCard(props: TimelineStatusProps) {
  // Empty state - no data from GHL
  if (!props.hasData) {
    return (
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Foreclosure Timeline Status
          </CardTitle>
          <CardDescription>
            {props.message || "Start tracking your foreclosure timeline"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              You haven't created a timeline yet. Use our Timeline Calculator to get started!
            </p>
            <Button asChild>
              <Link href="/timeline-calculator">
                <span>Calculate My Timeline</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format dates
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Determine urgency level based on days until sale
  const getUrgencyColor = (days?: number) => {
    if (!days) return "gray";
    if (days <= 7) return "red";
    if (days <= 21) return "orange";
    return "green";
  };

  const urgencyColor = getUrgencyColor(props.daysUntilSale);

  // Engagement badge
  const getEngagementBadge = () => {
    switch (props.engagementLevel) {
      case "high":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">High Engagement</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Active</Badge>;
      case "low":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Getting Started</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className={`border-l-4 border-l-${urgencyColor}-500`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-teal-600" />
              Your Foreclosure Timeline
            </CardTitle>
            <CardDescription>
              Synced from GoHighLevel CRM
            </CardDescription>
          </div>
          {getEngagementBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Critical Dates Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-gray-700">Notice of Default</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {formatDate(props.noticeOfDefaultDate)}
            </p>
          </div>

          <div className={`bg-${urgencyColor}-50 p-4 rounded-lg`}>
            <div className="flex items-center gap-2 mb-2">
              <Clock className={`h-4 w-4 text-${urgencyColor}-600`} />
              <span className="text-sm font-medium text-gray-700">Foreclosure Sale Date</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {formatDate(props.foreclosureSaleDate)}
            </p>
            {props.daysUntilSale !== undefined && (
              <p className={`text-sm text-${urgencyColor}-600 font-medium mt-1`}>
                {props.daysUntilSale > 0 
                  ? `${props.daysUntilSale} days remaining`
                  : props.daysUntilSale === 0
                  ? "Sale is today!"
                  : "Sale date passed"}
              </p>
            )}
          </div>
        </div>

        {/* Progress Tracking Section */}
        {props.completionPercentage !== undefined && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-teal-600" />
                <span className="text-sm font-medium text-gray-700">Action Items Progress</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {props.completedActions || 0} of {props.totalActions || 0} completed
              </span>
            </div>
            <Progress value={props.completionPercentage} className="h-2" />
            <p className="text-xs text-gray-600">
              {props.completionPercentage}% of your action items are complete
            </p>
          </div>
        )}

        {/* Tags Section */}
        {props.tags && props.tags.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Activity Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {props.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag.replace(/_/g, " ")}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Last Activity */}
        {props.lastActivity && (
          <div className="text-xs text-gray-500 pt-2 border-t">
            Last updated: {new Date(props.lastActivity).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </div>
        )}

        {/* Call to Action */}
        <div className="flex gap-3 pt-2">
          <Button asChild variant="default" className="flex-1">
            <Link href="/my-timeline">
              <span>View Full Timeline</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/timeline-calculator">
              <span>Update Timeline</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
