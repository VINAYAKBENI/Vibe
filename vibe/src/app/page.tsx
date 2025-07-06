'use client';
import { useTRPC } from "@/trpc/client";
import { getQueryClient, trpc } from "@/trpc/server";
import { QueryClient } from "@tanstack/react-query";
import { tr } from "date-fns/locale";

const Page = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.hello.queryOptions({ text: "world" }));
  
  return (<div>
    Hello world
  </div>  );
}
 
export default Page;
