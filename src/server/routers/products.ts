import { procedure, router } from '../trpc';
import { z } from 'zod';
import { prisma } from '../prisma';

export const productsRouter = router({
  getRecomended: procedure.query(async () => {
    const items = await prisma.phones.findMany({
      take: 24,
    });

    return items;
  }),
  getSome: procedure
    .input(
      z.object({
        limit: z.number().min(8).max(24),
        page: z.number().min(0),
        sortBy: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { limit, page, sortBy } = input;

      if (sortBy === 'price') {
        return await prisma.phones.findMany({
          skip: limit * page,
          take: limit,
          orderBy: {
            price: 'desc',
          },
          include: {
            users: true,
          },
        });
      }

      return await prisma.phones.findMany({
        skip: limit * page,
        take: limit,
        orderBy: {
          year: 'desc',
        },
        include: {
          users: true,
        },
      });
    }),

  countItems: procedure.query(async () => {
    return await prisma.phones.count({
      select: {
        _all: true,
      },
    });
  }),
});
