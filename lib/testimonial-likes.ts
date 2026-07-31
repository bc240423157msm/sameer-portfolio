import { kvGet, kvSet } from "@/lib/kv";

const LIKES_KEY = "testimonial-likes";
const VOTE_PREFIX = "testimonial-vote:";

export type TestimonialLikes = Record<string, number>;

export async function getTestimonialLikes(): Promise<TestimonialLikes> {
  return kvGet<TestimonialLikes>(LIKES_KEY, {});
}

export async function getTestimonialLikeCount(
  testimonialId: string
): Promise<number> {
  const likes = await getTestimonialLikes();
  return likes[testimonialId] ?? 0;
}

export async function hasVoted(
  voterHash: string,
  testimonialId: string
): Promise<boolean> {
  const key = `${VOTE_PREFIX}${voterHash}:${testimonialId}`;
  const voted = await kvGet<boolean>(key, false);
  return voted;
}

export async function incrementTestimonialLike(
  testimonialId: string,
  voterHash: string
): Promise<{ count: number; alreadyVoted: boolean }> {
  const alreadyVoted = await hasVoted(voterHash, testimonialId);
  if (alreadyVoted) {
    const count = await getTestimonialLikeCount(testimonialId);
    return { count, alreadyVoted: true };
  }

  const likes = await getTestimonialLikes();
  const count = (likes[testimonialId] ?? 0) + 1;
  likes[testimonialId] = count;
  await kvSet(LIKES_KEY, likes);
  await kvSet(`${VOTE_PREFIX}${voterHash}:${testimonialId}`, true);

  return { count, alreadyVoted: false };
}

/** Undoes a previous like. Only works if this voter had actually liked the
 * testimonial before — used when someone taps the heart again to un-like it. */
export async function decrementTestimonialLike(
  testimonialId: string,
  voterHash: string
): Promise<{ count: number; hadVoted: boolean }> {
  const hadVoted = await hasVoted(voterHash, testimonialId);
  if (!hadVoted) {
    const count = await getTestimonialLikeCount(testimonialId);
    return { count, hadVoted: false };
  }

  const likes = await getTestimonialLikes();
  const count = Math.max(0, (likes[testimonialId] ?? 0) - 1);
  likes[testimonialId] = count;
  await kvSet(LIKES_KEY, likes);
  await kvSet(`${VOTE_PREFIX}${voterHash}:${testimonialId}`, false);

  return { count, hadVoted: true };
}

/** Like/unlike in one call: flips the current voter's state for this
 * testimonial and returns the new count + whether it's now liked. */
export async function toggleTestimonialLike(
  testimonialId: string,
  voterHash: string
): Promise<{ count: number; liked: boolean }> {
  const alreadyVoted = await hasVoted(voterHash, testimonialId);
  if (alreadyVoted) {
    const { count } = await decrementTestimonialLike(testimonialId, voterHash);
    return { count, liked: false };
  }
  const { count } = await incrementTestimonialLike(testimonialId, voterHash);
  return { count, liked: true };
}
