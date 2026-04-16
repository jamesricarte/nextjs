export interface Event {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}

export const events: Event[] = [
  {
    title: "Google I/O Connect",
    image: "/images/event1.png",
    slug: "google-io-connect",
    location: "Bengaluru, India",
    date: "Aug 2026",
    time: "9:00 AM IST",
  },
  {
    title: "GitHub Universe",
    image: "/images/event2.png",
    slug: "github-universe",
    location: "San Francisco, CA",
    date: "Oct 2026",
    time: "10:00 AM PT",
  },
  {
    title: "JSConf Budapest",
    image: "/images/event3.png",
    slug: "jsconf-budapest",
    location: "Budapest, Hungary",
    date: "Fall 2026",
    time: "9:30 AM CEST",
  },
  {
    title: "ETHGlobal Hackathon",
    image: "/images/event4.png",
    slug: "ethglobal-hackathon",
    location: "London, UK",
    date: "Sep 2026",
    time: "8:00 AM BST",
  },
  {
    title: "React Summit",
    image: "/images/event5.png",
    slug: "react-summit",
    location: "Amsterdam, Netherlands",
    date: "Jun 2026",
    time: "9:00 AM CEST",
  },
  {
    title: "AWS re:Invent",
    image: "/images/event6.png",
    slug: "aws-reinvent",
    location: "Las Vegas, NV",
    date: "Dec 2026",
    time: "8:30 AM PT",
  },
];
