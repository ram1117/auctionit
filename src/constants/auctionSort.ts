export const AUCTION_SORT_KEY = {
  popular: {
    bids: { _count: 'desc' },
  } as const,
  newest: { createdAt: 'desc' } as const,
  deadline: { deadline: 'asc' } as const,
};
