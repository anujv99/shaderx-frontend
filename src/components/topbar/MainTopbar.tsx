"use client";
import React from "react";
import { Badge, Button } from "@radix-ui/themes";

import { TopbarContainer } from ".";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import { ProfileMenu } from "../menu";
import { SignInDialog } from "../dialogs";

const MainTopbar: React.FC = () => {
  const { authenticated, user } = useAuth();

  return (
    <TopbarContainer className="flex items-center px-2 justify-between">
      <Link href="/">
        <Badge>Rangg</Badge>
      </Link>
      {!authenticated && (
        <SignInDialog>
          <Button variant="surface">Sign in</Button>
        </SignInDialog>
      )}
      {authenticated && user && <ProfileMenu user={user} />}
    </TopbarContainer>
  );
};

export default MainTopbar;
