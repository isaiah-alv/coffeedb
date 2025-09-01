import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }
    await connectMongoDB();
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name: name?.trim() || "", email: email.toLowerCase(), passwordHash });
    return NextResponse.json({ id: String(user._id), email: user.email, name: user.name }, { status: 201 });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Failed to sign up" }, { status: 500 });
  }
}

