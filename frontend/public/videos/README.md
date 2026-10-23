# Creative Portfolio videos

Drop your video files here, then reference them from `frontend/constants/creative.ts`.

- **Format:** `.mp4` (H.264) is safest for broad browser support. `.webm` also works.
- **Keep them small:** aim for < 10–15 MB per clip (720p, short loops). Large files bloat the repo and slow page load.
- **Always set a `poster`:** point `image` at a still frame (JPG/PNG in `public/images/`). It shows before the video loads and while it's not hovered.

Example entry in `creative.ts`:

```ts
{
  id: 9,
  title: "Promo Reel",
  category: "Branding",
  description: "15s product reel.",
  tags: ["Video", "Motion"],
  media: "video",
  video: "/videos/promo-reel.mp4", // this file, in public/videos/
  image: "/images/projects/carshey.png", // poster still
}
```
