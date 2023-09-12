import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const dalgaRouter = createTRPCRouter({
  infiniteFeed: publicProcedure.input(
    z.object({
      limit: z.number().optional(),
      cursor: z.object({
        id: z.string(),
        createdAt: z.date()
      }).optional()
    })
  ).query(async ({ input: { limit = 10, cursor }, ctx }) => {
    const currentUserId = ctx.session?.user.id

    const dalgas = await ctx.prisma.dalga.findMany({
      take: limit + 1,
      cursor: cursor ? { createdAt_id: cursor } : undefined,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      select: {
        id: true,
        content: true,
        createdAt: true,
        _count: { select: { likes: true } },
        likes: currentUserId == null ? false : { where: { userId: currentUserId } },
        user: {
          select: {
            name: true,
            id: true,
            image: true
          }
        }
      }
    });

    let nextCursor: typeof cursor | undefined;

    if (dalgas.length > limit) {
      const nextItem = dalgas.pop()
      if (nextItem != null) {
        nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt }
      }

    }

    return {
      dalgas: dalgas.map(dalga => {
        return {
          id: dalga.id,
          content: dalga.content,
          createdAt: dalga.createdAt,
          likeCount: dalga._count.likes,
          user: dalga.user,
          likedByMe: dalga.likes?.length > 0,
        }
      }), nextCursor
    } || undefined
  }),
  create: protectedProcedure
    .input(z.object({ content: z.string() })) 
    .mutation(async ({ input: { content }, ctx }) => {
      try {
        const dalga = await ctx.prisma.dalga.create({
          data: { content, userId: ctx.session.user.id },
        });
        return dalga;
      } catch (error) {

        console.error("Hata oluştu:", error);
        throw new Error("Bir hata oluştu.");
      }
    }),
  toggleLike: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ input: { id }, ctx }) => {
    const data = { dalgaId: id, userId: ctx.session.user.id }
    const existingLike = await ctx.prisma.like.findUnique({
      where: { userId_dalgaId: data }
    })
    if (existingLike == null) {
      await ctx.prisma.like.create({ data })
      return { addedLike: true }
    }
    else {
      await ctx.prisma.like.delete({ where: { userId_dalgaId: data } })
      return { addedLike: false }
    }
  }),

});
