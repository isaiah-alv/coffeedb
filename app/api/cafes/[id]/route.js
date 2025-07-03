import connectMongoDB from "@/libs/mongodb";
import Cafe from "@/models/cafe"; 
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
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

    await connectMongoDB();

    const updateData = {
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

    const updatedCafe = await Cafe.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!updatedCafe) {
      return NextResponse.json({ 
        error: "Café not found" 
      }, { status: 404 });
    }

    return NextResponse.json({ message: "Café updated successfully", cafe: updatedCafe }, { status: 200 });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ 
      error: "Failed to update café. Please try again." 
    }, { status: 500 });
  }
}

export async function GET(request, { params }) {
   try {
     const { id } = params;
     await connectMongoDB();
     const cafe = await Cafe.findOne({ _id: id });
 
     if (!cafe) {
       return NextResponse.json({ message: "Café not found" }, { status: 404 });
     }
 
     return NextResponse.json({ cafe }, { status: 200 });
   } catch (error) {
     console.error("Fetch Error:", error);
     return NextResponse.json({ error: error.message }, { status: 500 });
   }
 }
