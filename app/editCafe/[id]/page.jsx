// this is a Server Component by default
import EditCafeForm from "@/components/EditCafeForm";
import connectMongoDB from "@/libs/mongodb";
import Cafe from "@/models/cafe";

export default async function EditCafePage({ params }) {
  const { id } = params;

  try {
    await connectMongoDB();
    const cafe = await Cafe.findById(id);

    if (!cafe) {
      throw new Error("Café not found");
    }

    // render the client form with the raw object
    return (
      <>
        <EditCafeForm initialData={cafe} />
      </>
    );
  } catch (error) {
    console.error("Error fetching café:", error);
    throw new Error("Failed to fetch café data");
  }
}
