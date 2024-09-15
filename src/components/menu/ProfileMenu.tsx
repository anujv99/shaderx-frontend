import React, { useCallback, useState } from "react";
import { Avatar, DropdownMenu, Spinner } from "@radix-ui/themes";

import { IUserProfile } from "../../utils/types";
import {
  BackpackIcon,
  CountdownTimerIcon,
  LockClosedIcon,
} from "@radix-ui/react-icons";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

type ProfileMenuProps = {
  user: IUserProfile;
};

const ProfileMenu: React.FC<ProfileMenuProps> = ({ user }) => {
  const [calling, setCalling] = useState("");

  const { logout } = useAuth();
  const router = useRouter();

  const onLogout = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setCalling("logout");
      logout().finally(() => setCalling(""));
    },
    [logout],
  );

  const onMyShaders = useCallback(() => {
    router.push("/my");
  }, [router]);

  const onArchivedShaders = useCallback(() => {
    router.push("/archive");
  }, [router]);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <button>
          <Avatar
            src=""
            size="2"
            fallback={user.name.charAt(0).toUpperCase()}
          />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content variant="soft" className="w-48">
        <DropdownMenu.Item onClick={onMyShaders}>
          <BackpackIcon />
          My Shaders
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={onArchivedShaders}>
          <CountdownTimerIcon />
          Archived Shaders
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item
          color="plum"
          onClick={onLogout}
          disabled={calling === "logout"}
        >
          <Spinner loading={calling === "logout"}>
            <LockClosedIcon />
          </Spinner>
          Logout
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default ProfileMenu;
