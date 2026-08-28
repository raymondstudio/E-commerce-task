import { supabase } from "@/lib/supabase";

export const subscribeToNewsletter = async (email: string, userId?: string) => {
  if (!supabase) {
    return { ok: false, error: "Supabase is not configured." };
  }

  const { error } = await supabase.from("newsletter_subscribers").upsert(
    {
      email,
      user_id: userId ?? null,
    },
    { onConflict: "email" },
  );

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, error: null };
};
