import { prisma } from "../../lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, drawing } = await request.json();
    const rsvp = await prisma.rsvp.create({
      data: { name, drawing },
    });
    return NextResponse.json(rsvp);
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "Failed to create RSVP" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const rsvps = await prisma.rsvp.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(rsvps);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch RSVPs" },
      { status: 500 }
    );
  }
}
