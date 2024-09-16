"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Avatar, Badge, Button, Spinner } from "@radix-ui/themes";

import { TopbarContainer } from ".";
import { AuthRoutes } from "../../api/routes";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import { ProfileMenu } from "../menu";

const handlePopupMessage = (e: MessageEvent) => {
  if (e.origin !== window.location.origin) return;

  const code = e.data?.authCode;
  if (!code) return;

  AuthRoutes.passCallbackToken(code);
};

const MainTopbar: React.FC = () => {
  const [url, setUrl] = useState<string | undefined>(undefined);
  const [popup, setPopup] = useState<Window | undefined>(undefined);

  const { authenticated, user } = useAuth();

  useEffect(() => {
    (async () => {
      const response = await AuthRoutes.getLoginUrl();
      setUrl(response);
    })();
  }, []);

  useEffect(() => {
    if (!popup) return;

    const channel = new BroadcastChannel("popup-channel");
    channel.onmessage = handlePopupMessage;

    return () => {
      channel.close();
      setPopup(undefined);
    };
  }, [popup]);

  const onClickSignIn = useCallback(() => {
    if (!url) return;

    const width = 500;
    const height = 600;
    const left = window.screenX + window.innerWidth / 2 - width / 2;
    const top = window.screenY + window.innerHeight / 2 - height / 2;

    const windowFeatures = `scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`;

    const win = window.open(url, "popup", windowFeatures);
    if (win) {
      win.focus();
      win.onclose = () => setPopup(undefined);
      setPopup(win);
    }
  }, [url]);

  return (
    <TopbarContainer className="flex items-center px-2 justify-between">
      <Link href="/">
        <Badge>Rangg</Badge>
      </Link>
      {!authenticated && (
        <Button variant="surface" disabled={!url} onClick={onClickSignIn}>
          <Spinner loading={!url} />
          Sign in
        </Button>
      )}
      {authenticated && user && <ProfileMenu user={user} />}
    </TopbarContainer>
  );
};

export default MainTopbar;
