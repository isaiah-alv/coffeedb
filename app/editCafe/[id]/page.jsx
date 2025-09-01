// this is a Server Component by default
import EditCafeForm from "@/components/EditCafeForm";
import connectMongoDB from "@/libs/mongodb";
import Cafe from "@/models/cafe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { redirect } from "next/navigation";

export default async function EditCafePage({ params }) {
  const { id } = params;

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      redirect("/signup");
    }
    await connectMongoDB();
    const cafe = await Cafe.findById(id);

    if (!cafe) {
      throw new Error("Cafe not found");
    }

    if (cafe.ownerId !== session.user.id) {
      redirect("/");
    }

    // renders the client form with the raw object
    return (
      <>
        <EditCafeForm initialData={cafe} />
      </>
    );
  } catch (error) {
    console.error("Error fetching cafe:", error);
    throw new Error("Failed to fetch cafe data");
  }
}
