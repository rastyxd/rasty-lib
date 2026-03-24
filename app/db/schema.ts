import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  displayName: text("display_name"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  theme: text("theme").default("default"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const links = sqliteTable("links", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  url: text("url").notNull(),
  description: text("description"),
  icon: text("icon"),
  position: integer("position").notNull().default(0),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
  clicks: integer("clicks").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const analytics = sqliteTable("analytics", {
  id: text("id").primaryKey(),
  linkId: text("link_id")
    .notNull()
    .references(() => links.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  clickedAt: integer("clicked_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  country: text("country"),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Link = typeof links.$inferSelect;
export type NewLink = typeof links.$inferInsert;
export type Analytics = typeof analytics.$inferSelect;
export type NewAnalytics = typeof analytics.$inferInsert;
