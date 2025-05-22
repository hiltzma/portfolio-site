import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const certificates = await ctx.db
      .query("certificates")
      .withIndex("by_date")
      .order("desc")
      .collect();
    
    return await Promise.all(certificates.map(async (cert) => ({
      ...cert,
      attachmentUrl: cert.attachmentId ? await ctx.storage.getUrl(cert.attachmentId) : null
    })));
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    issuer: v.string(),
    date: v.string(),
    description: v.string(),
    url: v.optional(v.string()),
    attachmentId: v.optional(v.id("_storage"))
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    await ctx.db.insert("certificates", args);
  },
});

export const remove = mutation({
  args: { id: v.id("certificates") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const certificate = await ctx.db.get(args.id);
    if (certificate?.attachmentId) {
      await ctx.storage.delete(certificate.attachmentId);
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
