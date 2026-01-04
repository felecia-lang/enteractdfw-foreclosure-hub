import { eq, and, sql, desc } from "drizzle-orm";
import { getDb } from "./db";
import {
  abTests,
  abTestVariants,
  abTestAssignments,
  abTestEvents,
  InsertABTest,
  InsertABTestVariant,
  InsertABTestAssignment,
  InsertABTestEvent,
} from "../drizzle/schema";

/**
 * Get all active A/B tests for a specific form
 */
export async function getActiveTestsForForm(formName: string) {
  const db = await getDb();
  if (!db) return [];

  const tests = await db
    .select()
    .from(abTests)
    .where(and(eq(abTests.formName, formName), eq(abTests.status, "active")));

  return tests;
}

/**
 * Get all variants for a specific test
 */
export async function getTestVariants(testId: number) {
  const db = await getDb();
  if (!db) return [];

  const variants = await db
    .select()
    .from(abTestVariants)
    .where(eq(abTestVariants.testId, testId));

  return variants;
}

/**
 * Get or create variant assignment for a session
 * Ensures consistent experience across page loads
 */
export async function getOrCreateAssignment(
  testId: number,
  sessionId: string,
  variants: Array<{ id: number; trafficWeight: number }>
) {
  const db = await getDb();
  if (!db) return null;

  // Check if assignment already exists
  const existing = await db
    .select()
    .from(abTestAssignments)
    .where(
      and(
        eq(abTestAssignments.testId, testId),
        eq(abTestAssignments.sessionId, sessionId)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  // Create new assignment using weighted random selection
  const totalWeight = variants.reduce((sum, v) => sum + v.trafficWeight, 0);
  const random = Math.random() * totalWeight;
  let cumulativeWeight = 0;
  let selectedVariant = variants[0];

  for (const variant of variants) {
    cumulativeWeight += variant.trafficWeight;
    if (random <= cumulativeWeight) {
      selectedVariant = variant;
      break;
    }
  }

  const assignment: InsertABTestAssignment = {
    testId,
    variantId: selectedVariant.id,
    sessionId,
  };

  await db.insert(abTestAssignments).values(assignment);

  return {
    id: 0, // Will be auto-generated
    ...assignment,
    assignedAt: new Date(),
  };
}

/**
 * Track an A/B test event
 */
export async function trackTestEvent(event: InsertABTestEvent) {
  const db = await getDb();
  if (!db) return;

  await db.insert(abTestEvents).values(event);
}

/**
 * Create a new A/B test
 */
export async function createABTest(test: InsertABTest) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(abTests).values(test);
  return result;
}

/**
 * Create A/B test variants
 */
export async function createABTestVariants(variants: InsertABTestVariant[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(abTestVariants).values(variants);
  return result;
}

/**
 * Update A/B test status
 */
export async function updateTestStatus(
  testId: number,
  status: "draft" | "active" | "paused" | "completed"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(abTests)
    .set({ status, updatedAt: new Date() })
    .where(eq(abTests.id, testId));
}

/**
 * Get A/B test statistics
 * Calculates conversion rates, engagement metrics, and statistical significance
 */
export async function getTestStatistics(testId: number) {
  const db = await getDb();
  if (!db) return null;

  // Get test details
  const test = await db
    .select()
    .from(abTests)
    .where(eq(abTests.id, testId))
    .limit(1);

  if (test.length === 0) return null;

  // Get variants
  const variants = await db
    .select()
    .from(abTestVariants)
    .where(eq(abTestVariants.testId, testId));

  // Get statistics for each variant
  const variantStats = await Promise.all(
    variants.map(async (variant) => {
      // Count impressions (field shown)
      const impressions = await db
        .select({ count: sql<number>`count(*)` })
        .from(abTestEvents)
        .where(
          and(
            eq(abTestEvents.testId, testId),
            eq(abTestEvents.variantId, variant.id),
            eq(abTestEvents.eventType, "impression")
          )
        );

      // Count focus events (user engaged with field)
      const focuses = await db
        .select({ count: sql<number>`count(*)` })
        .from(abTestEvents)
        .where(
          and(
            eq(abTestEvents.testId, testId),
            eq(abTestEvents.variantId, variant.id),
            eq(abTestEvents.eventType, "focus")
          )
        );

      // Count validation errors
      const errors = await db
        .select({ count: sql<number>`count(*)` })
        .from(abTestEvents)
        .where(
          and(
            eq(abTestEvents.testId, testId),
            eq(abTestEvents.variantId, variant.id),
            eq(abTestEvents.eventType, "validation_error")
          )
        );

      // Count form submissions
      const submissions = await db
        .select({ count: sql<number>`count(*)` })
        .from(abTestEvents)
        .where(
          and(
            eq(abTestEvents.testId, testId),
            eq(abTestEvents.variantId, variant.id),
            eq(abTestEvents.eventType, "form_submit")
          )
        );

      // Count successful conversions
      const conversions = await db
        .select({ count: sql<number>`count(*)` })
        .from(abTestEvents)
        .where(
          and(
            eq(abTestEvents.testId, testId),
            eq(abTestEvents.variantId, variant.id),
            eq(abTestEvents.eventType, "form_success")
          )
        );

      const impressionCount = Number(impressions[0]?.count || 0);
      const focusCount = Number(focuses[0]?.count || 0);
      const errorCount = Number(errors[0]?.count || 0);
      const submissionCount = Number(submissions[0]?.count || 0);
      const conversionCount = Number(conversions[0]?.count || 0);

      return {
        variant,
        impressions: impressionCount,
        focuses: focusCount,
        errors: errorCount,
        submissions: submissionCount,
        conversions: conversionCount,
        engagementRate:
          impressionCount > 0 ? (focusCount / impressionCount) * 100 : 0,
        errorRate: focusCount > 0 ? (errorCount / focusCount) * 100 : 0,
        conversionRate:
          impressionCount > 0 ? (conversionCount / impressionCount) * 100 : 0,
      };
    })
  );

  // Calculate statistical significance (using chi-square test)
  const calculateSignificance = (
    control: (typeof variantStats)[0],
    treatment: (typeof variantStats)[0]
  ) => {
    const n1 = control.impressions;
    const n2 = treatment.impressions;
    const p1 = control.conversions / n1;
    const p2 = treatment.conversions / n2;

    if (n1 === 0 || n2 === 0) return { significant: false, pValue: 1 };

    const pooledP = (control.conversions + treatment.conversions) / (n1 + n2);
    const se = Math.sqrt(pooledP * (1 - pooledP) * (1 / n1 + 1 / n2));
    const z = (p2 - p1) / se;
    const pValue = 2 * (1 - normalCDF(Math.abs(z)));

    return {
      significant: pValue < 0.05,
      pValue,
      improvement: ((p2 - p1) / p1) * 100,
    };
  };

  const controlVariant = variantStats.find((v) => v.variant.isControl === "yes");
  const treatmentVariants = variantStats.filter(
    (v) => v.variant.isControl === "no"
  );

  const comparisons = treatmentVariants.map((treatment) => ({
    treatmentName: treatment.variant.name,
    ...calculateSignificance(
      controlVariant || variantStats[0],
      treatment
    ),
  }));

  return {
    test: test[0],
    variants: variantStats,
    comparisons,
  };
}

/**
 * Normal cumulative distribution function (for statistical significance)
 */
function normalCDF(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp((-x * x) / 2);
  const prob =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - prob : prob;
}

/**
 * Get all A/B tests (for admin dashboard)
 */
export async function getAllTests() {
  const db = await getDb();
  if (!db) return [];

  const tests = await db.select().from(abTests).orderBy(desc(abTests.createdAt));
  return tests;
}

/**
 * Get test by ID
 */
export async function getTestById(testId: number) {
  const db = await getDb();
  if (!db) return null;

  const test = await db
    .select()
    .from(abTests)
    .where(eq(abTests.id, testId))
    .limit(1);

  return test.length > 0 ? test[0] : null;
}
