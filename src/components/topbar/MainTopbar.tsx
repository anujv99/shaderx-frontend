"use client";
import React from "react";
import { Badge, Button, Flex } from "@radix-ui/themes";

import { TopbarContainer } from ".";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import { ProfileMenu } from "../menu";
import { SignInDialog } from "../dialogs";
import { PlusIcon } from "@radix-ui/react-icons";

const MainTopbar: React.FC = () => {
  const { authenticated, user } = useAuth();

  return (
    <TopbarContainer className="flex items-center px-2 justify-between">
      <Link href="/">
        <Badge>Rangg</Badge>
      </Link>
      <Flex className="gap-2">
        <Link href="/shader/empty">
          <Button variant="surface" color="violet">
            <PlusIcon />
            New shader
          </Button>
        </Link>
        {!authenticated && (
          <SignInDialog>
            <Button variant="surface">Sign in</Button>
          </SignInDialog>
        )}
        {authenticated && user && <ProfileMenu user={user} />}
      </Flex>
    </TopbarContainer>
  );
};

export default MainTopbar;
