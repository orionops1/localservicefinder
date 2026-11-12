import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sri Lanka Local Services Finder",
    short_name: "LocalServices.lk",
    description: "Discover verified trade specialists, electricians, plumbers, and mechanics across Sri Lanka.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#047857",
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
