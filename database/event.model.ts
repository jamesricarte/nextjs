import {
  HydratedDocument,
  Model,
  Schema,
  model,
  models,
} from "mongoose";

const REQUIRED_STRING_FIELDS = [
  "title",
  "description",
  "overview",
  "image",
  "venue",
  "location",
  "date",
  "time",
  "mode",
  "audience",
  "organizer",
] as const;

type RequiredStringField = (typeof REQUIRED_STRING_FIELDS)[number];

export interface Event {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

type EventDocument = HydratedDocument<Event>;
type EventModel = Model<Event>;

const isNonEmptyString = (value: string): boolean => value.trim().length > 0;

const normalizeList = (values: string[], fieldName: "agenda" | "tags"): string[] => {
  const normalizedValues = values.map((value) => value.trim()).filter(Boolean);

  if (normalizedValues.length === 0) {
    throw new Error(`${fieldName} must contain at least one non-empty value.`);
  }

  return normalizedValues;
};

const createSlug = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeDate = (value: string): string => {
  const input = value.trim();
  const parsedDate = new Date(input);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("date must be a valid date string.");
  }

  // Store event dates as ISO strings for consistent persistence and querying.
  return parsedDate.toISOString();
};

const normalizeTime = (value: string): string => {
  const input = value.trim().toLowerCase();
  const match = input.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);

  if (!match) {
    throw new Error("time must be in a valid format such as 09:30 or 9:30 pm.");
  }

  let hours = Number(match[1]);
  const minutes = Number(match[2] ?? "0");
  const meridiem = match[3];

  if (minutes > 59) {
    throw new Error("time must contain valid minutes.");
  }

  if (meridiem) {
    if (hours < 1 || hours > 12) {
      throw new Error("time must contain a valid 12-hour value.");
    }

    if (meridiem === "am") {
      hours = hours % 12;
    } else {
      hours = (hours % 12) + 12;
    }
  } else if (hours > 23) {
    throw new Error("time must contain a valid 24-hour value.");
  }

  // Normalize to HH:MM so every stored event uses the same time representation.
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

const eventSchema = new Schema<Event, EventModel>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "title is required.",
      },
    },
    slug: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "description is required.",
      },
    },
    overview: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "overview is required.",
      },
    },
    image: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "image is required.",
      },
    },
    venue: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "venue is required.",
      },
    },
    location: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "location is required.",
      },
    },
    date: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "date is required.",
      },
    },
    time: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "time is required.",
      },
    },
    mode: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "mode is required.",
      },
    },
    audience: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "audience is required.",
      },
    },
    agenda: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]) => value.length > 0 && value.every((item) => isNonEmptyString(item)),
        message: "agenda must contain at least one non-empty item.",
      },
    },
    organizer: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "organizer is required.",
      },
    },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]) => value.length > 0 && value.every((item) => isNonEmptyString(item)),
        message: "tags must contain at least one non-empty item.",
      },
    },
  },
  {
    timestamps: true,
  },
);

eventSchema.index({ slug: 1 }, { unique: true });

eventSchema.pre("save", async function () {
  const event = this as EventDocument;

  for (const field of REQUIRED_STRING_FIELDS) {
    if (!isNonEmptyString(event[field])) {
      throw new Error(`${field} is required.`);
    }
  }

  event.agenda = normalizeList(event.agenda, "agenda");
  event.tags = normalizeList(event.tags, "tags");
  event.date = normalizeDate(event.date);
  event.time = normalizeTime(event.time);

  // Regenerate the URL slug only when the event title changes.
  if (event.isModified("title")) {
    const slug = createSlug(event.title);

    if (!slug) {
      throw new Error("title must produce a valid slug.");
    }

    event.slug = slug;
  }
});

export const Event = (models.Event as EventModel | undefined) ?? model<Event, EventModel>("Event", eventSchema);
