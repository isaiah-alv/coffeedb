import connectMongoDB from "@/libs/mongodb";
import Cafe from "@/models/cafe"; 
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectMongoDB();
    const { name, coffeeRating, atmosphereRating, street, city, state, postalCode, country } = await request.json();
    
    // Validate required fields
    if (!name || !street || !city || !state) {
      return NextResponse.json({ 
        error: "Missing required fields: name, street, city, and state are required" 
      }, { status: 400 });
    }

    // Validate ratings
    if (coffeeRating < 1 || coffeeRating > 10 || atmosphereRating < 1 || atmosphereRating > 10) {
      return NextResponse.json({ 
        error: "Ratings must be between 1 and 10" 
      }, { status: 400 });
    }

    const newCafe = {
      name: name.trim(),
      ratings: {
        coffee: coffeeRating,
        atmosphere: atmosphereRating
      },
      address: {
        street: street.trim(),
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode?.trim() || "",
        country: country || "USA"
      }
    };

    await Cafe.create(newCafe);
    return NextResponse.json({ message: "Café added successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error adding café:", error);
    return NextResponse.json({ 
      error: "Failed to add café. Please try again." 
    }, { status: 500 });
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