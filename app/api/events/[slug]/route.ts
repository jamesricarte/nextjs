import { Event } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{ slug: string }>;
};

export async function GET(
  req: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> {
  try {
    await connectDB();

    const { slug } = await params;

    if (!slug || typeof slug !== "string" || slug.trim() === "") {
      return NextResponse.json(
        {
          message: "Invalid or missing slug parameter",
        },
        { status: 400 },
      );
    }

    const sanitizedSlug = slug.trim().toLowerCase();

    const event: Event | null = await Event.findOne({
      slug: sanitizedSlug,
    }).lean();

    if (!event) {
      return NextResponse.json(
        { message: `Event with slug '${sanitizedSlug}' not found` },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Event fetched successfully", event },
      { status: 200 },
    );
  } catch (error: any) {
    if (error.message.includes("MONGODB_URI")) {
      return NextResponse.json(
        { message: "Database configuration error" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "An unexpected error occured" },
      { status: 500 },
    );
  }
}
