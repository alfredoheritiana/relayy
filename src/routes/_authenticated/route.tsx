import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { supabase } from "@/integrations/supabase/client";
import { getWorkspace } from "@/lib/relay/workspace.functions";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      const next = `${location.pathname}${location.searchStr}${location.hash}`;
      throw redirect({ to: "/auth", search: { next } });
    }

    if (location.pathname !== "/onboarding") {
      const workspace = await getWorkspace();
      if (!workspace.organization) throw redirect({ to: "/onboarding" });
    }
    return { user: data.user };
  },
  component: () => <Outlet />,
});
