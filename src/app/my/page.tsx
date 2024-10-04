"use client";

import { useAtom, useSetAtom } from "jotai";
import React, { useCallback, useState } from "react";

import { MyShaderCard, NewShaderCard } from "../../components/cards";
import {
  DeleteShaderDialog,
  NewShaderDialog,
  UpdateShaderDialog,
} from "../../components/dialogs";
import { ShadersAtom } from "../../atoms";
import { IShader, TShaderAccess, TUpdateShaderParams } from "../../utils/types";
import { useRouter } from "next/navigation";
import { ShaderRoutes } from "../../api/routes";

const Page: React.FC = () => {
  const [shaders] = useAtom(ShadersAtom.myShaderAtom);
  const dispatch = useSetAtom(ShadersAtom.shaderReducerAtom);

  const [deleting, setDeleting] = useState<IShader | null>(null);
  const [editing, setEditing] = useState<IShader | null>(null);

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

  const changeAccess = useCallback(
    async (shader: IShader, access: TShaderAccess) => {
      await ShaderRoutes.updateShader(shader.id, {
        access,
      });
      dispatch({ type: "UPDATE_SHADER", payload: { ...shader, access } });
    },
    [dispatch],
  );

  const updateShader = useCallback(
    async (shader: IShader, params: TUpdateShaderParams) => {
      console.log("updateShader", shader, params);
      await ShaderRoutes.updateShader(shader.id, params);
      dispatch({ type: "UPDATE_SHADER", payload: { ...shader, ...params } });
    },
    [dispatch],
  );

  const editShader = useCallback(
    (shader: IShader) => {
      setEditing(shader);
    },
    [setEditing],
  );

  const closeEditShader = useCallback(() => {
    setEditing(null);
  }, [setEditing]);

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
              changeAccess={changeAccess}
              deleteShader={deleteShader}
              editShader={editShader}
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
      {editing && (
        <UpdateShaderDialog
          shader={editing}
          close={closeEditShader}
          updateShader={updateShader}
        />
      )}
    </div>
  );
};

export default Page;
