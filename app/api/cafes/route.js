import connectMongoDB from "@/libs/mongodb";
import Cafe from "@/models/cafe"; 
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectMongoDB();
    const { name, coffeeRating, atmosphereRating, street, city, postalCode, country } = await request.json();
    
    const newCafe = {
      name,
      ratings: {
        coffee: coffeeRating,
        atmosphere: atmosphereRating
      },
      address: {
        street,
        city,
        postalCode,
        country
      }
    };

    await Cafe.create(newCafe);
    return NextResponse.json({ message: "Café added successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function GET() {
  await connectMongoDB();
  const cafes = await Cafe.find();
  return NextResponse.json({ cafes });
}

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  await connectMongoDB();
  await Cafe.findByIdAndDelete(id);
  return NextResponse.json({ message: "Café deleted" }, { status: 200 });
}
