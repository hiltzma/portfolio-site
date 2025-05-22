import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const education = await ctx.db
      .query("education")
      .withIndex("by_date")
      .order("desc")
      .collect();
    
    return await Promise.all(education.map(async (edu) => ({
      ...edu,
      attachmentUrl: edu.attachmentId ? await ctx.storage.getUrl(edu.attachmentId) : null
    })));
  },
});

export const add = mutation({
  args: {
    school: v.string(),
    degree: v.string(),
    field: v.string(),
    startDate: v.string(),
    endDate: v.optional(v.string()),
    description: v.string(),
    location: v.string(),
    attachmentId: v.optional(v.id("_storage"))
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    await ctx.db.insert("education", args);
  },
});

export const remove = mutation({
  args: { id: v.id("education") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const education = await ctx.db.get(args.id);
    if (education?.attachmentId) {
      await ctx.storage.delete(education.attachmentId);
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
