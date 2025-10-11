"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "@/client/trpc";
import { httpBatchLink } from "@trpc/client";
import { ReactNode, useState } from "react";
import { SoundProvider } from "@/components/SoundManager";

export default function Providers({ children }: { children: ReactNode }) {
  const [qc] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({ links: [httpBatchLink({ url: "/api/trpc" })] })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={qc}>
      <QueryClientProvider client={qc}>
        <SoundProvider>
          {children}
        </SoundProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
