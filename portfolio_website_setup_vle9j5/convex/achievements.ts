import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const achievements = await ctx.db
      .query("achievements")
      .withIndex("by_date")
      .order("desc")
      .collect();
    
    return await Promise.all(achievements.map(async (achievement) => ({
      ...achievement,
      attachmentUrl: achievement.attachmentId ? await ctx.storage.getUrl(achievement.attachmentId) : null
    })));
  },
});

export const add = mutation({
  args: {
    title: v.string(),
    date: v.string(),
    description: v.string(),
    attachmentId: v.optional(v.id("_storage"))
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    await ctx.db.insert("achievements", args);
  },
});

export const remove = mutation({
  args: { id: v.id("achievements") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const achievement = await ctx.db.get(args.id);
    if (achievement?.attachmentId) {
      await ctx.storage.delete(achievement.attachmentId);
    }
    await ctx.db.delete(args.id);
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.storage.generateUploadUrl();
  },
});
