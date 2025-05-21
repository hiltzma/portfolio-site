import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const profile = await ctx.db
      .query("profile")
      .first();
    
    if (profile) {
      const profileImageUrl = profile.profileImageId ? await ctx.storage.getUrl(profile.profileImageId) : null;
      const bannerImageUrl = profile.bannerImageId ? await ctx.storage.getUrl(profile.bannerImageId) : null;
      return { ...profile, profileImageUrl, bannerImageUrl };
    }
    return null;
  },
});

export const save = mutation({
  args: {
    name: v.string(),
    title: v.string(),
    bio: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    location: v.optional(v.string()),
    website: v.optional(v.string()),
    profileImageId: v.optional(v.id("_storage")),
    bannerImageId: v.optional(v.id("_storage")),
    links: v.array(v.object({
      platform: v.string(),
      url: v.string()
    }))
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("profile")
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, args);
    } else {
      await ctx.db.insert("profile", args);
    }
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
