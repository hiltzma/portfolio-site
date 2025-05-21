import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const applicationTables = {
  profile: defineTable({
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
  }),
  education: defineTable({
    school: v.string(),
    degree: v.string(),
    field: v.string(),
    startDate: v.string(),
    endDate: v.optional(v.string()),
    description: v.string(),
    location: v.string(),
    attachmentId: v.optional(v.id("_storage"))
  }).index("by_date", ["startDate"]),
  certificates: defineTable({
    name: v.string(),
    issuer: v.string(),
    date: v.string(),
    description: v.string(),
    url: v.optional(v.string()),
    attachmentId: v.optional(v.id("_storage"))
  }).index("by_date", ["date"]),
  achievements: defineTable({
    title: v.string(),
    date: v.string(),
    description: v.string(),
    attachmentId: v.optional(v.id("_storage"))
  }).index("by_date", ["date"]),
  adminSettings: defineTable({
    isSetup: v.boolean(),
    adminEmail: v.string(),
  }).index("by_email", ["adminEmail"])
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
