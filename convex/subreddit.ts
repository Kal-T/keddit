import { mutation } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";
import { ConvexError, v } from "convex/values";

export const create = mutation({
    args: {
        name: v.string(),
        description: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx);
        const subreddits = await ctx.db.query("subreddit").collect();
        if(subreddits.some(subreddit => subreddit.name === args.name)) {
            throw new ConvexError("Subreddit already exists");
        }
        await ctx.db.insert("subreddit", {
            name: args.name,
            description: args.description,
            authorId: user._id,
        });
    }

})