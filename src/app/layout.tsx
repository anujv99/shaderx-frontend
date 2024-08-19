import type { Metadata } from "next";
import { Inter as CustomFont } from "next/font/google";
import "./globals.css";

const font = CustomFont({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

type LayoutProps = React.PropsWithChildren;

export default function RootLayout(props: Readonly<LayoutProps>) {
  const { children } = props;

  return (
    <html lang="en">
      <body className={font.className}>{children}</body>
    </html>
  );
}
