import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { AlertCircle, Calendar, CheckCircle2, Clock, TrendingUp, Loader2, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { TimelineStatusCard } from "@/components/TimelineStatusCard";

export default function MyTimeline() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { data: timelineData, isLoading: timelineLoading, refetch } = trpc.userTimeline.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: recommendationsData } = trpc.userTimeline.getRecommendations.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  // Fetch GHL timeline status
  const { data: ghlStatus, isLoading: ghlLoading } = trpc.dashboard.getTimelineStatus.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const updateActionMutation = trpc.userTimeline.updateAction.useMutation();

  const handleActionToggle = async (milestoneId: string, actionIndex: number, currentlyCompleted: boolean) => {
    try {
      await updateActionMutation.mutateAsync({
        milestoneId,
        actionIndex,
        completed: !currentlyCompleted,
      });
      
      toast.success(currentlyCompleted ? "Action marked as incomplete" : "Action completed!");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to update action status");
    }
  };

  // Show loading state
  if (authLoading || timelineLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-teal-600" />
          <p className="mt-4 text-gray-600">Loading your timeline...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer">
                <img src={APP_LOGO} alt={APP_TITLE} className="h-10" />
              </div>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/">
                <span className="text-gray-700 hover:text-teal-600 cursor-pointer">Home</span>
              </Link>
              <Link href="/knowledge-base">
                <span className="text-gray-700 hover:text-teal-600 cursor-pointer">Knowledge Base</span>
              </Link>
            </nav>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <Card className="max-w-md w-full mx-4">
            <CardHeader>
              <CardTitle>Sign In Required</CardTitle>
              <CardDescription>
                Please sign in to view and manage your personalized foreclosure timeline.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <a href={getLoginUrl()}>Sign In to Continue</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show empty state if no timeline exists
  if (!timelineData) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer">
                <img src={APP_LOGO} alt={APP_TITLE} className="h-10" />
              </div>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/">
                <span className="text-gray-700 hover:text-teal-600 cursor-pointer">Home</span>
              </Link>
              <Link href="/knowledge-base">
                <span className="text-gray-700 hover:text-teal-600 cursor-pointer">Knowledge Base</span>
              </Link>
              <span className="text-gray-900 font-medium">My Timeline</span>
            </nav>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <Card className="max-w-2xl w-full mx-4">
            <CardHeader>
              <CardTitle>Create Your Timeline</CardTitle>
              <CardDescription>
                You haven't created a foreclosure timeline yet. Calculate your personalized timeline to track your progress and stay on top of critical deadlines.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                <h3 className="font-semibold text-teal-900 mb-2">What You'll Get:</h3>
                <ul className="space-y-2 text-sm text-teal-800">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>Personalized timeline with all Texas foreclosure milestones</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>Action items for each milestone to keep you on track</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>Progress tracking to see what you've completed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>Personalized recommendations based on your situation</span>
                  </li>
                </ul>
              </div>
              <Button asChild className="w-full" size="lg">
                <Link href="/knowledge-base/notice-of-default">
                  Calculate My Timeline
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { milestones, progress, noticeDate } = timelineData;
  const today = new Date();
  const noticeDateTime = new Date(noticeDate);
  const daysSinceNotice = Math.ceil((today.getTime() - noticeDateTime.getTime()) / (1000 * 60 * 60 * 24));

  // Get urgency color
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "text-red-600 bg-red-50 border-red-200";
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "past":
        return <CheckCircle2 className="h-5 w-5 text-gray-400" />;
      case "current":
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case "upcoming":
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <img src={APP_LOGO} alt={APP_TITLE} className="h-10" />
            </div>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/">
              <span className="text-gray-700 hover:text-teal-600 cursor-pointer">Home</span>
            </Link>
            <Link href="/knowledge-base">
              <span className="text-gray-700 hover:text-teal-600 cursor-pointer">Knowledge Base</span>
            </Link>
            <span className="text-gray-900 font-medium">My Timeline</span>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Foreclosure Timeline</h1>
          <p className="text-gray-600">
            Track your progress and stay on top of critical deadlines. You're {daysSinceNotice} days into your foreclosure timeline.
          </p>
        </div>

        {/* GHL Timeline Status Card */}
        {ghlStatus && (
          <div className="mb-8">
            <TimelineStatusCard {...ghlStatus} />
          </div>
        )}

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Overall Progress</CardTitle>
                <CardDescription>
                  {progress.completedActions} of {progress.totalActions} actions completed
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-teal-600">{progress.completionPercentage}%</div>
                <div className="text-sm text-gray-500">Complete</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progress.completionPercentage} className="h-3" />
          </CardContent>
        </Card>

        {/* Recommendations */}
        {recommendationsData && recommendationsData.recommendations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-teal-600" />
              Recommended Next Steps
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recommendationsData.recommendations.map((rec) => (
                <Card key={rec.id} className={rec.priority === "high" ? "border-teal-300 bg-teal-50/50" : ""}>
                  <CardHeader>
                    <CardTitle className="text-lg">{rec.title}</CardTitle>
                    <CardDescription>{rec.description}</CardDescription>
                  </CardHeader>
                  {rec.actionUrl && rec.actionText && (
                    <CardContent>
                      <Button asChild variant="default" className="w-full">
                        {rec.actionUrl.startsWith("tel:") ? (
                          <a href={rec.actionUrl}>{rec.actionText}</a>
                        ) : (
                          <Link href={rec.actionUrl}>{rec.actionText}</Link>
                        )}
                      </Button>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Timeline Milestones */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-teal-600" />
            Your Timeline
          </h2>
          <div className="space-y-6">
            {milestones.map((milestone: any, milestoneIndex: number) => {
              const milestoneDate = new Date(milestone.date);
              const daysUntil = Math.ceil((milestoneDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              const isPast = daysUntil < 0;
              const isCurrent = milestone.status === "current";

              return (
                <Card
                  key={milestone.id}
                  className={`${isCurrent ? "border-orange-300 bg-orange-50/30" : ""} ${
                    isPast ? "opacity-75" : ""
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(milestone.status)}
                          <CardTitle className="text-lg">{milestone.title}</CardTitle>
                          <span
                            className={`text-xs px-2 py-1 rounded-full border ${getUrgencyColor(
                              milestone.urgency
                            )}`}
                          >
                            {milestone.urgency}
                          </span>
                        </div>
                        <CardDescription>{milestone.description}</CardDescription>
                        <div className="mt-2 flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Calendar className="h-4 w-4" />
                            {milestoneDate.toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                          {!isPast && (
                            <div className="flex items-center gap-1 text-gray-600">
                              <Clock className="h-4 w-4" />
                              {daysUntil === 0
                                ? "Today"
                                : daysUntil === 1
                                ? "Tomorrow"
                                : `${daysUntil} days away`}
                            </div>
                          )}
                          {isPast && (
                            <div className="text-gray-500">
                              {Math.abs(daysUntil)} day{Math.abs(daysUntil) !== 1 ? "s" : ""} ago
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-semibold text-gray-900 mb-3">Action Items:</h4>
                    <div className="space-y-2">
                      {milestone.actionItems.map((action: string, actionIndex: number) => {
                        const progressKey = `${milestone.id}-${actionIndex}`;
                        const isCompleted = progress.progressMap[progressKey] || false;

                        return (
                          <div key={actionIndex} className="flex items-start gap-3 p-2 rounded hover:bg-gray-50">
                            <Checkbox
                              id={`action-${milestone.id}-${actionIndex}`}
                              checked={isCompleted}
                              onCheckedChange={() => handleActionToggle(milestone.id, actionIndex, isCompleted)}
                              disabled={updateActionMutation.isPending}
                            />
                            <label
                              htmlFor={`action-${milestone.id}-${actionIndex}`}
                              className={`flex-1 text-sm cursor-pointer ${
                                isCompleted ? "line-through text-gray-500" : "text-gray-700"
                              }`}
                            >
                              {action}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Help Section */}
        <Card className="mt-8 bg-teal-50 border-teal-200">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>
              Our foreclosure specialists are here to guide you through every step of the process.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="flex-1">
                <a href="tel:832-346-9569">Call Us: (844) 981-2937</a>
              </Button>
              <Button asChild variant="outline" size="lg" className="flex-1">
                <Link href="/knowledge-base">Browse Knowledge Base</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
