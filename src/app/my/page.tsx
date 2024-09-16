"use client";

import { useAtom, useSetAtom } from "jotai";
import React, { useCallback, useState } from "react";

import { MyShaderCard, NewShaderCard } from "../../components/cards";
import { DeleteShaderDialog, NewShaderDialog } from "../../components/dialogs";
import { ShadersAtom } from "../../atoms";
import { IShader } from "../../utils/types";
import { useRouter } from "next/navigation";
import { ShaderRoutes } from "../../api/routes";

const Page: React.FC = () => {
  const [shaders] = useAtom(ShadersAtom.myShaderAtom);
  const dispatch = useSetAtom(ShadersAtom.shaderReducerAtom);

  const [deleting, setDeleting] = useState<IShader | null>(null);

  const router = useRouter();

  const openShader = useCallback(
    (shader: IShader) => {
      router.push(`/shader/${shader.id}`);
    },
    [router],
  );

  const deleteShader = useCallback(
    async (shader: IShader) => {
      setDeleting(shader);
    },
    [setDeleting],
  );

  const confirmDelete = useCallback(
    async (shader: IShader) => {
      await ShaderRoutes.deleteShader(shader.id, true);
      dispatch({ type: "DELETE_SHADER", payload: shader });
    },
    [dispatch],
  );

  const cancelDelete = useCallback(() => {
    setDeleting(null);
  }, [setDeleting]);

  const archiveShader = useCallback(
    async (shader: IShader) => {
      await ShaderRoutes.deleteShader(shader.id, false);
      dispatch({ type: "ARCHIVE_SHADER", payload: shader });
    },
    [dispatch],
  );

  const restoreShader = useCallback(
    async (shader: IShader) => {
      await ShaderRoutes.restoreShader(shader.id);
      dispatch({ type: "RESTORE_SHADER", payload: shader });
    },
    [dispatch],
  );

  return (
    <div className="w-full flex gap-4 flex-wrap p-4">
      <NewShaderDialog>
        <NewShaderCard />
      </NewShaderDialog>
      {shaders.state === "hasData" && (
        <>
          {(shaders.data || []).map((shader: any) => (
            <MyShaderCard
              key={shader.id}
              shader={shader}
              openShader={openShader}
              archiveShader={archiveShader}
              restoreShader={restoreShader}
              deleteShader={deleteShader}
            />
          ))}
        </>
      )}
      {deleting && (
        <DeleteShaderDialog
          shader={deleting}
          deleteShader={confirmDelete}
          close={cancelDelete}
        />
      )}
    </div>
  );
};

export default Page;
