import dynamic from "next/dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { redirect } from "next/navigation";

const MapSearch = dynamic(() => import("@/components/MapSearch"), { ssr: false });

export default async function SearchPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/signin?callbackUrl=/search");
  }
  return <MapSearch />;
}
