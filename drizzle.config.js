import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./utils/schema.js",
  dbCredentials: {url: 'postgresql://neondb_owner:npg_KRuHQ2wDMla0@ep-hidden-hill-ad0h3vpr-pooler.c-2.us-east-1.aws.neon.tech/prepAi?sslmode=require&channel_binding=require'},
});
