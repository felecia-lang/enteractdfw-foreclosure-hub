import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  upsertUserTimeline,
  getUserTimeline,
  getTimelineActionProgress,
  updateActionProgress,
  deleteUserTimeline,
} from "../timelineDb";

/**
 * Milestone schema for validation
 */
const milestoneSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  daysFromNotice: z.number(),
  description: z.string(),
  actionItems: z.array(z.string()),
  urgency: z.enum(["critical", "high", "medium", "low"]),
  status: z.enum(["past", "current", "upcoming"]),
});

/**
 * User timeline router - handles timeline CRUD and progress tracking
 */
export const userTimelineRouter = router({
  /**
   * Save or update the user's timeline
   */
  save: protectedProcedure
    .input(
      z.object({
        noticeDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
        milestones: z.array(milestoneSchema),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const timeline = await upsertUserTimeline({
        userId: ctx.user.id,
        noticeDate: input.noticeDate,
        milestones: input.milestones,
      });

      if (!timeline) {
        throw new Error("Failed to save timeline");
      }

      // Sync to GHL when user saves timeline (high engagement signal)
      try {
        const { trackTimelineSaved } = await import("../ghlEnhanced");
        await trackTimelineSaved({
          email: ctx.user.email || "",
          noticeDate: input.noticeDate,
          milestones: input.milestones.map(m => ({
            title: m.title,
            date: m.date,
            daysFromNotice: m.daysFromNotice,
            urgency: m.urgency,
            status: m.status === "past" ? "passed" as const : m.status,
            actions: m.actionItems,
          })),
        });
      } catch (ghlError) {
        console.error("[Timeline Save] Failed to sync to GHL:", ghlError);
        // Don't fail the request if GHL sync fails
      }

      return {
        success: true,
        timelineId: timeline.id,
      };
    }),

  /**
   * Get the user's timeline with progress data
   */
  get: protectedProcedure.query(async ({ ctx }) => {
    const timeline = await getUserTimeline(ctx.user.id);

    if (!timeline) {
      return null;
    }

    // Parse milestones from JSON
    const milestones = JSON.parse(timeline.milestones);

    // Get progress data
    const progressData = await getTimelineActionProgress(timeline.id);

    // Build progress map for easy lookup
    const progressMap = new Map<string, boolean>();
    progressData.forEach((progress) => {
      const key = `${progress.milestoneId}-${progress.actionIndex}`;
      progressMap.set(key, progress.completed === "yes");
    });

    // Calculate overall progress statistics
    let totalActions = 0;
    let completedActions = 0;

    milestones.forEach((milestone: any) => {
      milestone.actionItems.forEach((_: any, index: number) => {
        totalActions++;
        const key = `${milestone.id}-${index}`;
        if (progressMap.get(key)) {
          completedActions++;
        }
      });
    });

    const completionPercentage = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0;

    return {
      id: timeline.id,
      noticeDate: timeline.noticeDate,
      milestones,
      progress: {
        totalActions,
        completedActions,
        completionPercentage,
        progressMap: Object.fromEntries(progressMap),
      },
      createdAt: timeline.createdAt,
      updatedAt: timeline.updatedAt,
    };
  }),

  /**
   * Update action completion status
   */
  updateAction: protectedProcedure
    .input(
      z.object({
        milestoneId: z.string(),
        actionIndex: z.number().int().min(0),
        completed: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get user's timeline
      const timeline = await getUserTimeline(ctx.user.id);

      if (!timeline) {
        throw new Error("Timeline not found. Please create a timeline first.");
      }

      // Update action progress
      const progress = await updateActionProgress({
        timelineId: timeline.id,
        milestoneId: input.milestoneId,
        actionIndex: input.actionIndex,
        completed: input.completed,
      });

      if (!progress) {
        throw new Error("Failed to update action progress");
      }

      // Track progress in GHL when user completes actions
      if (input.completed && ctx.user.email) {
        try {
          const milestones = JSON.parse(timeline.milestones);
          const milestone = milestones.find((m: any) => m.id === input.milestoneId);
          const actionCompleted = milestone?.actionItems?.[input.actionIndex] || "Action item";

          // Calculate completion percentage
          const progressData = await getTimelineActionProgress(timeline.id);
          const totalActions = milestones.reduce((sum: number, m: any) => sum + (m.actionItems?.length || 0), 0);
          const completedCount = progressData.filter(p => p.completed === "yes").length;
          const completionPercentage = totalActions > 0 ? Math.round((completedCount / totalActions) * 100) : 0;

          const { trackTimelineProgress } = await import("../ghlEnhanced");
          await trackTimelineProgress({
            email: ctx.user.email,
            actionCompleted,
            milestoneTitle: milestone?.title || "Unknown milestone",
            completionPercentage,
          });
        } catch (ghlError) {
          console.error("[Timeline Progress] Failed to track in GHL:", ghlError);
          // Don't fail the request if GHL tracking fails
        }
      }

      return {
        success: true,
        completed: progress.completed === "yes",
      };
    }),

  /**
   * Delete the user's timeline
   */
  delete: protectedProcedure.mutation(async ({ ctx }) => {
    const success = await deleteUserTimeline(ctx.user.id);

    if (!success) {
      throw new Error("Failed to delete timeline");
    }

    return {
      success: true,
    };
  }),

  /**
   * Get personalized recommendations based on timeline status
   */
  getRecommendations: protectedProcedure.query(async ({ ctx }) => {
    const timeline = await getUserTimeline(ctx.user.id);

    if (!timeline) {
      return {
        recommendations: [
          {
            id: "create-timeline",
            title: "Create Your Timeline",
            description: "Start by calculating your personalized foreclosure timeline to understand your key deadlines.",
            priority: "high" as const,
            actionUrl: "/knowledge-base/notice-of-default",
            actionText: "Calculate Timeline",
          },
        ],
      };
    }

    const milestones = JSON.parse(timeline.milestones);
    const progressData = await getTimelineActionProgress(timeline.id);
    const today = new Date();
    const noticeDate = new Date(timeline.noticeDate);

    // Build progress map
    const progressMap = new Map<string, boolean>();
    progressData.forEach((progress) => {
      const key = `${progress.milestoneId}-${progress.actionIndex}`;
      progressMap.set(key, progress.completed === "yes");
    });

    const recommendations: Array<{
      id: string;
      title: string;
      description: string;
      priority: "high" | "medium" | "low";
      actionUrl?: string;
      actionText?: string;
    }> = [];

    // Find current and upcoming milestones
    const currentMilestone = milestones.find((m: any) => m.status === "current");
    const upcomingMilestones = milestones.filter((m: any) => m.status === "upcoming");

    // Recommendation 1: Focus on current milestone
    if (currentMilestone) {
      const incompleteActions = currentMilestone.actionItems.filter((_: any, index: number) => {
        const key = `${currentMilestone.id}-${index}`;
        return !progressMap.get(key);
      });

      if (incompleteActions.length > 0) {
        recommendations.push({
          id: "complete-current-milestone",
          title: `Complete ${currentMilestone.title}`,
          description: `You have ${incompleteActions.length} action${incompleteActions.length > 1 ? "s" : ""} remaining for this critical milestone. Time is running out!`,
          priority: "high",
          actionUrl: "/my-timeline",
          actionText: "View Actions",
        });
      }
    }

    // Recommendation 2: Prepare for upcoming milestone
    if (upcomingMilestones.length > 0) {
      const nextMilestone = upcomingMilestones[0];
      const milestoneDate = new Date(nextMilestone.date);
      const daysUntil = Math.ceil((milestoneDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (daysUntil <= 7) {
        recommendations.push({
          id: "prepare-next-milestone",
          title: `Prepare for ${nextMilestone.title}`,
          description: `This milestone is ${daysUntil} day${daysUntil !== 1 ? "s" : ""} away. Start preparing now to stay ahead.`,
          priority: "high",
          actionUrl: "/my-timeline",
          actionText: "Review Timeline",
        });
      }
    }

    // Recommendation 3: Contact EnterActDFW if timeline is advanced
    const daysSinceNotice = Math.ceil((today.getTime() - noticeDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceNotice > 15) {
      recommendations.push({
        id: "contact-enteract",
        title: "Speak with a Foreclosure Specialist",
        description: "You're approaching critical deadlines. Get personalized guidance from our team to explore all your options.",
        priority: "high",
        actionUrl: "tel:844-981-2937",
        actionText: "Call Now",
      });
    }

    // Recommendation 4: Explore resources
    recommendations.push({
      id: "explore-resources",
      title: "Learn About Your Options",
      description: "Read our comprehensive guides to understand loan modifications, short sales, and other foreclosure alternatives.",
      priority: "medium",
      actionUrl: "/knowledge-base",
      actionText: "Browse Guides",
    });

    return {
      recommendations: recommendations.slice(0, 3), // Return top 3 recommendations
    };
  }),
});
