import { RateLimiterPrisma } from "rate-limiter-flexible";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

const FREE_POINTS = 5;
const LEARNER_POINTS = 50;
const PRO_POINTS = 100;
const DURATION = 30 * 24 * 60 * 60  //30 Days
const GENERATION_COST = 1;

export async function getUsageTracker() {
    const { has } = await auth();
    const hasLearnerAccess = has({ plan: "learner" });
    const hasProAccess = has({ plan: "pro" });

    const usageTracker = new RateLimiterPrisma({
        storeClient: prisma,
        tableName: "Usage",
        points: hasProAccess ? PRO_POINTS : hasLearnerAccess ? LEARNER_POINTS : FREE_POINTS,
        duration: DURATION,
    });
    return usageTracker;
};


export async function consumeCredits() {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("User not authenticated");
    }

    const usageTracker = await getUsageTracker();
    const result = await usageTracker.consume(userId, GENERATION_COST);
    return result;
};

export async function getUsageStatus() {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("User not authenticated");
    }

    const usageTracker = await getUsageTracker();
    const result = await usageTracker.get(userId);
    return result;
}