import React from "react";
import Editor from "./Editor";

type PageProps = {
  params: {
    id: string;
  };
};

export async function generateStaticParams() {
  return [];
}

const Page: React.FC<PageProps> = ({ params }) => {
  const { id: shaderId } = params;

  if (!shaderId) return;

  return <Editor id={shaderId} />;
};

export default Page;
export const dynamicParams = true;
