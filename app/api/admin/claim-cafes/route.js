import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectMongoDB from "@/libs/mongodb";
import Cafe from "@/models/cafe";

// Assign all cafes to the current user (ownerId/ownerName)
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectMongoDB();
  const result = await Cafe.updateMany({}, { ownerId: session.user.id, ownerName: session.user.name || session.user.email || "" });
  return NextResponse.json({ updated: result.modifiedCount ?? result.nModified ?? 0 });
}

