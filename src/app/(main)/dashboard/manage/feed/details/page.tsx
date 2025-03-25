"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

function PageContent() {
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get("token");
  const stateParam = searchParams.get("state");

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      if (tokenParam) {
        try {
          setLoading(true);
          const response = await fetch(
            `http://localhost:5000/api/feed/details/${
              stateParam == "approve" ? "approve" : "delete"
            }`,
            {
              method: "POST",
              body: JSON.stringify({ tokenParam }),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const data = await response.json();

          if (data.success) {
            toast({
              title: "Success",
              className:
                "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
              description: data.msg,
            });
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to message handle",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
    })();
  }, []);
  return <div></div>;
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}