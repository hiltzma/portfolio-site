import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const checkAdminSetup = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db
      .query("adminSettings")
      .first();
    return settings?.isSetup ?? false;
  },
});

export const getAdminEmail = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db
      .query("adminSettings")
      .first();
    return settings?.adminEmail;
  },
});

export const setupAdmin = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("adminSettings")
      .first();

    if (existing) {
      throw new Error("Admin account already exists");
    }

    await ctx.db.insert("adminSettings", {
      isSetup: true,
      adminEmail: args.email,
    });
  },
});

export const validateAdminAccess = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;

    const settings = await ctx.db
      .query("adminSettings")
      .first();
    
    if (!settings) return false;

    const user = await ctx.db.get(userId);
    return user?.email === settings.adminEmail;
  },
});
