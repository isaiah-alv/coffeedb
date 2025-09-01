import connectMongoDB from "@/libs/mongodb";
import Cafe from "@/models/cafe";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoDB();
    const { name, coffeeRating, atmosphereRating, street, city, state, postalCode, country } = await request.json();

    if (!name || !street || !city || !state) {
      return NextResponse.json({
        error: "Missing required fields: name, street, city, and state are required",
      }, { status: 400 });
    }

    if (coffeeRating < 1 || coffeeRating > 10 || atmosphereRating < 1 || atmosphereRating > 10) {
      return NextResponse.json({ error: "Ratings must be between 1 and 10" }, { status: 400 });
    }

    const newCafe = {
      ownerId: session.user.id,
      ownerName: session.user.name || session.user.email || "",
      name: name.trim(),
      ratings: { coffee: coffeeRating, atmosphere: atmosphereRating },
      address: {
        street: street.trim(),
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode?.trim() || "",
        country: country || "USA",
      },
    };

    await Cafe.create(newCafe);
    return NextResponse.json({ message: "Cafe added successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error adding cafe:", error);
    return NextResponse.json({ error: "Failed to add cafe. Please try again." }, { status: 500 });
  }
}

export async function GET(request) {
  await connectMongoDB();
  const { searchParams } = new URL(request.url);
  const ownerId = searchParams.get('ownerId');
  const query = ownerId ? { ownerId } : {};
  const cafes = await Cafe.find(query);
  return NextResponse.json({ cafes });
}

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectMongoDB();
  const cafe = await Cafe.findById(id);
  if (!cafe) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (cafe.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await Cafe.findByIdAndDelete(id);
  return NextResponse.json({ message: "Cafe deleted" }, { status: 200 });
}
