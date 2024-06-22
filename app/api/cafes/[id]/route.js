import connectMongoDB from "@/libs/mongodb";
import Cafe from "@/models/cafe"; 
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { name, coffeeRating, atmosphereRating, street, city, postalCode, country } = await request.json();
    await connectMongoDB();

    const updateData = {
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

    const updatedCafe = await Cafe.findByIdAndUpdate(id, updateData, { new: true }); // Option {new: true} to return the updated document
    return NextResponse.json({ message: "Café updated", cafe: updatedCafe }, { status: 200 });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
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
