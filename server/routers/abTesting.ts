import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import {
  getActiveTestsForForm,
  getTestVariants,
  getOrCreateAssignment,
  trackTestEvent,
  createABTest,
  createABTestVariants,
  updateTestStatus,
  getTestStatistics,
  getAllTests,
  getTestById,
} from "../abTestingDb";
import { TRPCError } from "@trpc/server";

export const abTestingRouter = router({
  /**
   * Get active tests and assigned variant for a form field
   * Public endpoint - used by frontend to determine which variant to show
   */
  getVariantAssignment: publicProcedure
    .input(
      z.object({
        formName: z.string(),
        fieldName: z.string(),
        sessionId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { formName, fieldName, sessionId } = input;

      // Get active tests for this form and field
      const tests = await getActiveTestsForForm(formName);
      const relevantTest = tests.find((t) => t.fieldName === fieldName);

      if (!relevantTest) {
        return { hasTest: false, variant: null };
      }

      // Get variants for this test
      const variants = await getTestVariants(relevantTest.id);

      if (variants.length === 0) {
        return { hasTest: false, variant: null };
      }

      // Get or create assignment for this session
      const assignment = await getOrCreateAssignment(
        relevantTest.id,
        sessionId,
        variants.map((v) => ({ id: v.id, trafficWeight: v.trafficWeight }))
      );

      if (!assignment) {
        return { hasTest: false, variant: null };
      }

      // Find the assigned variant
      const assignedVariant = variants.find((v) => v.id === assignment.variantId);

      return {
        hasTest: true,
        testId: relevantTest.id,
        variant: assignedVariant,
      };
    }),

  /**
   * Track an A/B test event
   * Public endpoint - called from frontend when users interact with tested fields
   */
  trackEvent: publicProcedure
    .input(
      z.object({
        testId: z.number(),
        variantId: z.number(),
        sessionId: z.string(),
        eventType: z.enum([
          "impression",
          "focus",
          "blur",
          "input",
          "validation_error",
          "form_submit",
          "form_success",
          "form_error",
        ]),
        eventData: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await trackTestEvent(input);
      return { success: true };
    }),

  /**
   * Create a new A/B test (admin only)
   */
  createTest: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        formName: z.string(),
        fieldName: z.string(),
        trafficAllocation: z.number().min(0).max(100).default(100),
        variants: z.array(
          z.object({
            name: z.string(),
            isControl: z.boolean(),
            trafficWeight: z.number().min(0).max(100),
            fieldLabel: z.string().optional(),
            fieldPlaceholder: z.string().optional(),
            fieldRequired: z.boolean(),
            fieldHelperText: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Check if user is admin
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can create A/B tests",
        });
      }

      // Validate traffic weights sum to 100
      const totalWeight = input.variants.reduce(
        (sum, v) => sum + v.trafficWeight,
        0
      );
      if (totalWeight !== 100) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Variant traffic weights must sum to 100",
        });
      }

      // Validate exactly one control variant
      const controlCount = input.variants.filter((v) => v.isControl).length;
      if (controlCount !== 1) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Must have exactly one control variant",
        });
      }

      // Create test
      await createABTest({
        name: input.name,
        description: input.description,
        formName: input.formName,
        fieldName: input.fieldName,
        status: "draft",
        trafficAllocation: input.trafficAllocation,
      });

      // Get the newly created test ID by querying the latest test
      const tests = await getAllTests();
      const testId = tests[0]?.id;

      if (!testId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create test",
        });
      }

      // Create variants
      const variantData = input.variants.map((v) => ({
        testId,
        name: v.name,
        isControl: v.isControl ? ("yes" as const) : ("no" as const),
        trafficWeight: v.trafficWeight,
        fieldLabel: v.fieldLabel,
        fieldPlaceholder: v.fieldPlaceholder,
        fieldRequired: v.fieldRequired ? ("yes" as const) : ("no" as const),
        fieldHelperText: v.fieldHelperText,
      }));

      await createABTestVariants(variantData);

      return {
        success: true,
        testId,
      };
    }),

  /**
   * Update test status (admin only)
   */
  updateTestStatus: protectedProcedure
    .input(
      z.object({
        testId: z.number(),
        status: z.enum(["draft", "active", "paused", "completed"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can update test status",
        });
      }

      await updateTestStatus(input.testId, input.status);

      return { success: true };
    }),

  /**
   * Get test statistics (admin only)
   */
  getTestStats: protectedProcedure
    .input(z.object({ testId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can view test statistics",
        });
      }

      const stats = await getTestStatistics(input.testId);

      if (!stats) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Test not found",
        });
      }

      return stats;
    }),

  /**
   * Get all tests (admin only)
   */
  getAllTests: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only admins can view all tests",
      });
    }

    const tests = await getAllTests();
    return tests;
  }),

  /**
   * Get test details with variants (admin only)
   */
  getTestDetails: protectedProcedure
    .input(z.object({ testId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can view test details",
        });
      }

      const test = await getTestById(input.testId);
      if (!test) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Test not found",
        });
      }

      const variants = await getTestVariants(input.testId);

      return {
        test,
        variants,
      };
    }),
});
