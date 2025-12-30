
import { redirect } from "next/navigation";
import { cookies } from "next/headers";


export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token){
  redirect("/login?reason=unauthorized"); //barag3 param lel login
  } 

  return <>{children}</>;
}