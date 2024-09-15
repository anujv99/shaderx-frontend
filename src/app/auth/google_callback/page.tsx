"use client";
import { Text } from "@radix-ui/themes";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  const params = useSearchParams();
  const code = params.get("code");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!code) return;

    const channel = new BroadcastChannel("popup-channel");
    channel.postMessage({ authCode: code });
    window.close();
  }, []);

  if (!mounted) return null;

  if (!code) window.close();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Text>{mounted ? "Redirecting..." : "Loading..."}</Text>
    </div>
  );
};

export default Page;
