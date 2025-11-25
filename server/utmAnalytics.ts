import { and, gte, isNotNull, lte, sql } from "drizzle-orm";
import { getDb } from "./db";
import { bookingConfirmations, pageViews, phoneCallTracking } from "../drizzle/schema";

/**
 * Get channel performance (conversion rates by utm_source)
 */
export async function getChannelPerformance(dateRange?: { startDate?: Date; endDate?: Date }) {
  const db = await getDb();
  if (!db) return [];

  // Build date range conditions
  const conditions = [];
  if (dateRange?.startDate) {
    conditions.push(gte(pageViews.viewedAt, dateRange.startDate));
  }
  if (dateRange?.endDate) {
    conditions.push(lte(pageViews.viewedAt, dateRange.endDate));
  }

  // Get visitors by channel
  const visitorsQuery = db
    .select({
      channel: pageViews.utmSource,
      visitors: sql<number>`COUNT(DISTINCT ${pageViews.sessionId})`,
    })
    .from(pageViews)
    .where(and(...conditions, isNotNull(pageViews.utmSource)))
    .groupBy(pageViews.utmSource);

  const visitors = await visitorsQuery;

  // Get calls by channel
  const callConditions = [];
  if (dateRange?.startDate) {
    callConditions.push(gte(phoneCallTracking.clickedAt, dateRange.startDate));
  }
  if (dateRange?.endDate) {
    callConditions.push(lte(phoneCallTracking.clickedAt, dateRange.endDate));
  }

  const callsQuery = db
    .select({
      channel: phoneCallTracking.utmSource,
      calls: sql<number>`COUNT(*)`,
    })
    .from(phoneCallTracking)
    .where(and(...callConditions, isNotNull(phoneCallTracking.utmSource)))
    .groupBy(phoneCallTracking.utmSource);

  const calls = await callsQuery;

  // Get bookings by channel
  const bookingConditions = [];
  if (dateRange?.startDate) {
    bookingConditions.push(gte(bookingConfirmations.createdAt, dateRange.startDate));
  }
  if (dateRange?.endDate) {
    bookingConditions.push(lte(bookingConfirmations.createdAt, dateRange.endDate));
  }

  const bookingsQuery = db
    .select({
      channel: bookingConfirmations.utmSource,
      bookings: sql<number>`COUNT(*)`,
    })
    .from(bookingConfirmations)
    .where(and(...bookingConditions, isNotNull(bookingConfirmations.utmSource)))
    .groupBy(bookingConfirmations.utmSource);

  const bookings = await bookingsQuery;

  // Combine and calculate conversion rates
  const channelMap = new Map<string, { visitors: number; calls: number; bookings: number }>();

  visitors.forEach(v => {
    if (v.channel) {
      channelMap.set(v.channel, { visitors: Number(v.visitors), calls: 0, bookings: 0 });
    }
  });

  calls.forEach(c => {
    if (c.channel) {
      const existing = channelMap.get(c.channel) || { visitors: 0, calls: 0, bookings: 0 };
      existing.calls = Number(c.calls);
      channelMap.set(c.channel, existing);
    }
  });

  bookings.forEach(b => {
    if (b.channel) {
      const existing = channelMap.get(b.channel) || { visitors: 0, calls: 0, bookings: 0 };
      existing.bookings = Number(b.bookings);
      channelMap.set(b.channel, existing);
    }
  });

  return Array.from(channelMap.entries()).map(([channel, metrics]) => ({
    channel,
    visitors: metrics.visitors,
    calls: metrics.calls,
    bookings: metrics.bookings,
    visitorToCallRate: metrics.visitors > 0 ? (metrics.calls / metrics.visitors) * 100 : 0,
    callToBookingRate: metrics.calls > 0 ? (metrics.bookings / metrics.calls) * 100 : 0,
    overallConversionRate: metrics.visitors > 0 ? (metrics.bookings / metrics.visitors) * 100 : 0,
  })).sort((a, b) => b.visitors - a.visitors);
}

/**
 * Get campaign performance (conversion rates by utm_campaign)
 */
export async function getCampaignPerformance(dateRange?: { startDate?: Date; endDate?: Date }) {
  const db = await getDb();
  if (!db) return [];

  // Build date range conditions
  const conditions = [];
  if (dateRange?.startDate) {
    conditions.push(gte(pageViews.viewedAt, dateRange.startDate));
  }
  if (dateRange?.endDate) {
    conditions.push(lte(pageViews.viewedAt, dateRange.endDate));
  }

  // Get visitors by campaign
  const visitorsQuery = db
    .select({
      campaign: pageViews.utmCampaign,
      visitors: sql<number>`COUNT(DISTINCT ${pageViews.sessionId})`,
    })
    .from(pageViews)
    .where(and(...conditions, isNotNull(pageViews.utmCampaign)))
    .groupBy(pageViews.utmCampaign);

  const visitors = await visitorsQuery;

  // Get calls by campaign
  const callConditions = [];
  if (dateRange?.startDate) {
    callConditions.push(gte(phoneCallTracking.clickedAt, dateRange.startDate));
  }
  if (dateRange?.endDate) {
    callConditions.push(lte(phoneCallTracking.clickedAt, dateRange.endDate));
  }

  const callsQuery = db
    .select({
      campaign: phoneCallTracking.utmCampaign,
      calls: sql<number>`COUNT(*)`,
    })
    .from(phoneCallTracking)
    .where(and(...callConditions, isNotNull(phoneCallTracking.utmCampaign)))
    .groupBy(phoneCallTracking.utmCampaign);

  const calls = await callsQuery;

  // Get bookings by campaign
  const bookingConditions = [];
  if (dateRange?.startDate) {
    bookingConditions.push(gte(bookingConfirmations.createdAt, dateRange.startDate));
  }
  if (dateRange?.endDate) {
    bookingConditions.push(lte(bookingConfirmations.createdAt, dateRange.endDate));
  }

  const bookingsQuery = db
    .select({
      campaign: bookingConfirmations.utmCampaign,
      bookings: sql<number>`COUNT(*)`,
    })
    .from(bookingConfirmations)
    .where(and(...bookingConditions, isNotNull(bookingConfirmations.utmCampaign)))
    .groupBy(bookingConfirmations.utmCampaign);

  const bookings = await bookingsQuery;

  // Combine and calculate conversion rates
  const campaignMap = new Map<string, { visitors: number; calls: number; bookings: number }>();

  visitors.forEach(v => {
    if (v.campaign) {
      campaignMap.set(v.campaign, { visitors: Number(v.visitors), calls: 0, bookings: 0 });
    }
  });

  calls.forEach(c => {
    if (c.campaign) {
      const existing = campaignMap.get(c.campaign) || { visitors: 0, calls: 0, bookings: 0 };
      existing.calls = Number(c.calls);
      campaignMap.set(c.campaign, existing);
    }
  });

  bookings.forEach(b => {
    if (b.campaign) {
      const existing = campaignMap.get(b.campaign) || { visitors: 0, calls: 0, bookings: 0 };
      existing.bookings = Number(b.bookings);
      campaignMap.set(b.campaign, existing);
    }
  });

  return Array.from(campaignMap.entries()).map(([campaign, metrics]) => ({
    campaign,
    visitors: metrics.visitors,
    calls: metrics.calls,
    bookings: metrics.bookings,
    visitorToCallRate: metrics.visitors > 0 ? (metrics.calls / metrics.visitors) * 100 : 0,
    callToBookingRate: metrics.calls > 0 ? (metrics.bookings / metrics.calls) * 100 : 0,
    overallConversionRate: metrics.visitors > 0 ? (metrics.bookings / metrics.visitors) * 100 : 0,
  })).sort((a, b) => b.visitors - a.visitors);
}

/**
 * Get medium performance (conversion rates by utm_medium)
 */
export async function getMediumPerformance(dateRange?: { startDate?: Date; endDate?: Date }) {
  const db = await getDb();
  if (!db) return [];

  // Build date range conditions
  const conditions = [];
  if (dateRange?.startDate) {
    conditions.push(gte(pageViews.viewedAt, dateRange.startDate));
  }
  if (dateRange?.endDate) {
    conditions.push(lte(pageViews.viewedAt, dateRange.endDate));
  }

  // Get visitors by medium
  const visitorsQuery = db
    .select({
      medium: pageViews.utmMedium,
      visitors: sql<number>`COUNT(DISTINCT ${pageViews.sessionId})`,
    })
    .from(pageViews)
    .where(and(...conditions, isNotNull(pageViews.utmMedium)))
    .groupBy(pageViews.utmMedium);

  const visitors = await visitorsQuery;

  // Get calls by medium
  const callConditions = [];
  if (dateRange?.startDate) {
    callConditions.push(gte(phoneCallTracking.clickedAt, dateRange.startDate));
  }
  if (dateRange?.endDate) {
    callConditions.push(lte(phoneCallTracking.clickedAt, dateRange.endDate));
  }

  const callsQuery = db
    .select({
      medium: phoneCallTracking.utmMedium,
      calls: sql<number>`COUNT(*)`,
    })
    .from(phoneCallTracking)
    .where(and(...callConditions, isNotNull(phoneCallTracking.utmMedium)))
    .groupBy(phoneCallTracking.utmMedium);

  const calls = await callsQuery;

  // Get bookings by medium
  const bookingConditions = [];
  if (dateRange?.startDate) {
    bookingConditions.push(gte(bookingConfirmations.createdAt, dateRange.startDate));
  }
  if (dateRange?.endDate) {
    bookingConditions.push(lte(bookingConfirmations.createdAt, dateRange.endDate));
  }

  const bookingsQuery = db
    .select({
      medium: bookingConfirmations.utmMedium,
      bookings: sql<number>`COUNT(*)`,
    })
    .from(bookingConfirmations)
    .where(and(...bookingConditions, isNotNull(bookingConfirmations.utmMedium)))
    .groupBy(bookingConfirmations.utmMedium);

  const bookings = await bookingsQuery;

  // Combine and calculate conversion rates
  const mediumMap = new Map<string, { visitors: number; calls: number; bookings: number }>();

  visitors.forEach(v => {
    if (v.medium) {
      mediumMap.set(v.medium, { visitors: Number(v.visitors), calls: 0, bookings: 0 });
    }
  });

  calls.forEach(c => {
    if (c.medium) {
      const existing = mediumMap.get(c.medium) || { visitors: 0, calls: 0, bookings: 0 };
      existing.calls = Number(c.calls);
      mediumMap.set(c.medium, existing);
    }
  });

  bookings.forEach(b => {
    if (b.medium) {
      const existing = mediumMap.get(b.medium) || { visitors: 0, calls: 0, bookings: 0 };
      existing.bookings = Number(b.bookings);
      mediumMap.set(b.medium, existing);
    }
  });

  return Array.from(mediumMap.entries()).map(([medium, metrics]) => ({
    medium,
    visitors: metrics.visitors,
    calls: metrics.calls,
    bookings: metrics.bookings,
    visitorToCallRate: metrics.visitors > 0 ? (metrics.calls / metrics.visitors) * 100 : 0,
    callToBookingRate: metrics.calls > 0 ? (metrics.bookings / metrics.calls) * 100 : 0,
    overallConversionRate: metrics.visitors > 0 ? (metrics.bookings / metrics.visitors) * 100 : 0,
  })).sort((a, b) => b.visitors - a.visitors);
}
