import {
  HydratedDocument,
  Model,
  Schema,
  Types,
  model,
  models,
} from "mongoose";

import { Event } from "./event.model";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface Booking {
  eventId: Types.ObjectId;
  slug: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

type BookingDocument = HydratedDocument<Booking>;
type BookingModel = Model<Booking>;

const bookingSchema = new Schema<Booking, BookingModel>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    slug: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => EMAIL_PATTERN.test(value),
        message: "email must be a valid email address.",
      },
    },
  },
  {
    timestamps: true,
  },
);

bookingSchema.index({ eventId: 1 });

bookingSchema.pre("save", async function () {
  const booking = this as BookingDocument;

  if (!booking.isModified("eventId") && !booking.isNew) {
    return;
  }

  // Prevent dangling bookings by ensuring the referenced event already exists.
  const eventExists = await Event.exists({ _id: booking.eventId });

  if (!eventExists) {
    throw new Error("eventId must reference an existing event.");
  }
});

export const Booking =
  (models.Booking as BookingModel | undefined) ??
  model<Booking, BookingModel>("Booking", bookingSchema);
