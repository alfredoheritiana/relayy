import { createFileRoute } from "@tanstack/react-router";

import { MJHolidaysPage } from "@/components/site/MJHolidaysPage";

const ogImage =
  "https://cdn.prod.website-files.com/6877b50802107221745ba52e/68ca855e2fa9583cd0911489_Opengraph.jpg";
const title = "MJ Holidays: Dream holidays in Mauritius";
const description =
  "Looking for a family holiday in Mauritius? MJ Holidays offers private pool villas, resort services and tailor-made stays.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:image", content: ogImage },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
    ],
  }),
  component: MJHolidaysPage,
});
