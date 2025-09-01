// app/components/CafeList.jsx (Server component)
import CafeListClient from './CafeListClient';
import connectMongoDB from "@/libs/mongodb";
import Cafe from "@/models/cafe";

export const dynamic = 'force-dynamic';

const getCafes = async () => {
  try {
    await connectMongoDB();
    const docs = await Cafe.find().lean();
    // Normalize to plain JSON-safe objects
    const cafes = docs.map((d) => ({
      _id: String(d._id),
      name: d.name,
      ownerId: d.ownerId,
      ownerName: d.ownerName || '',
      ratings: { coffee: d.ratings?.coffee || 0, atmosphere: d.ratings?.atmosphere || 0 },
      address: {
        street: d.address?.street || '',
        city: d.address?.city || '',
        state: d.address?.state || '',
        postalCode: d.address?.postalCode || '',
        country: d.address?.country || 'USA',
      },
      createdAt: d.createdAt?.toString?.() || new Date().toISOString(),
    }));
    return { cafes };
  } catch (error) {
    console.error('Error loading cafes: ', error);
    return { cafes: [] };
  }
};

export default async function CafeList() {
  const { cafes } = await getCafes();
  return <CafeListClient cafes={cafes} />;
}
