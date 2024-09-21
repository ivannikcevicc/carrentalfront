import { getUserInfo } from "../../../auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserInfo();
  if (user) {
    console.log(user);
    redirect("/");
  }
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
