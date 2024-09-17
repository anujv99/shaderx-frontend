import { Button, Dialog, Flex, Separator } from "@radix-ui/themes";
import React from "react";
import { useAuth } from "../../context/AuthContext";

type SignInDialogProps = {
  children?: React.ReactNode;
};

const SignInDialog: React.FC<SignInDialogProps> = ({ children }) => {
  const { login } = useAuth();

  return (
    <Dialog.Root>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Content maxWidth="420px">
        <Dialog.Title className="w-full text-center">Sign In</Dialog.Title>
        <Dialog.Description className="w-full text-center">
          Sign in to save your shaders and access more features.
        </Dialog.Description>
        <Separator className="w-full my-4" />
        <Button
          size="3"
          variant="surface"
          color="blue"
          className="w-full"
          onClick={login}
        >
          Continue with Google
        </Button>
        <Flex className="w-full justify-end mt-8">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default SignInDialog;
