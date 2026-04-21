import { Event } from "@/database";
import type { Event as EventRecord } from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { cacheLife } from "next/cache";

type EventWithId = EventRecord & { _id: string };

export async function getEvents(): Promise<EventRecord[]> {
  "use cache";
  cacheLife("hours");

  await connectDB();

  const events = await Event.find().sort({ createdAt: -1 }).lean();

  return events.map((event) => ({
    title: event.title,
    slug: event.slug,
    description: event.description,
    overview: event.overview,
    image: event.image,
    venue: event.venue,
    location: event.location,
    date: event.date,
    time: event.time,
    mode: event.mode,
    audience: event.audience,
    agenda: event.agenda,
    organizer: event.organizer,
    tags: event.tags,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  }));
}

export async function getEventBySlug(
  slug: string,
): Promise<EventWithId | null> {
  "use cache";
  cacheLife("hours");

  await connectDB();

  const event = await Event.findOne({ slug: slug.trim().toLowerCase() }).lean();

  if (!event) {
    return null;
  }

  return {
    _id: String(event._id),
    title: event.title,
    slug: event.slug,
    description: event.description,
    overview: event.overview,
    image: event.image,
    venue: event.venue,
    location: event.location,
    date: event.date,
    time: event.time,
    mode: event.mode,
    audience: event.audience,
    agenda: event.agenda,
    organizer: event.organizer,
    tags: event.tags,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  };
}
