"use server";

import { Event } from "@/database";
import type { Event as EventCardData } from "@/lib/constants";
import connectDB from "../mongodb";

export const getSimilarEventsBySlug = async (
  slug: string,
): Promise<EventCardData[]> => {
  try {
    await connectDB();

    const event = await Event.findOne({ slug });
    const similarEvents = await Event.find({
      _id: { $ne: event?._id },
      tags: { $in: event?.tags },
    }).lean();

    return similarEvents.map((similarEvent) => ({
      title: similarEvent.title,
      image: similarEvent.image,
      slug: similarEvent.slug,
      location: similarEvent.location,
      date: similarEvent.date,
      time: similarEvent.time,
    }));
  } catch {
    return [];
  }
};
