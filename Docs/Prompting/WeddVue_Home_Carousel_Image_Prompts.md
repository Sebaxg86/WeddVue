# WeddVue Home Carousel Image Prompts

## Recommended output for this website

For the home carousel, the cleanest setup is to generate each scene in 2 versions:

- Desktop: `2560 x 1600` px, aspect ratio `16:10`
- Mobile: `1600 x 1200` px, aspect ratio `4:3`

Why this works:

- `16:10` matches the editorial hero feel we are already using on desktop.
- `4:3` matches the current mobile carousel framing in the site.
- These sizes are large enough to look premium on retina screens, but still practical to compress.

Recommended export targets after generation:

- Desktop final asset: WebP, around `250 KB - 450 KB`
- Mobile final asset: WebP, around `140 KB - 260 KB`

Naming suggestion:

- `1.webp` in `desktop/`
- `1.webp` in `mobile/`
- `2.webp` in `desktop/`
- `2.webp` in `mobile/`

Important:

- Keep the same base filename in both folders so the carousel can pair the desktop and mobile versions of the same slide.
- The carousel also tolerates names like `home-slide-01.webp`, as long as both folders use the same logical slide id.

## Global art direction

Use this base direction in every prompt:

`Luxury editorial wedding photography, cinematic but natural, emotional and refined, soft golden-hour light, elegant composition, premium destination wedding aesthetic, realistic skin tones, authentic candid moments, subtle filmic contrast, highly detailed fabric and floral textures, no text, no watermark, no logos, no collage, no graphic overlays, no distorted anatomy, no extra fingers, no plastic-looking skin`

## Prompt 01 - Beach sunset ceremony

`Luxury editorial wedding photography of an intimate outdoor beach ceremony at sunset, ocean horizon glowing in warm peach and gold tones, bride and groom beneath a minimal floral arch, elegant guests seated on light wood chairs, soft sea breeze moving fabric, cinematic composition with negative space for website hero use, premium destination wedding aesthetic, natural lighting, refined and emotional, realistic details in flowers, linen, skin, and water, no text, no watermark, no logos`

## Prompt 02 - Oceanfront reception at dusk

`Luxury editorial wedding reception on a beach terrace at dusk, long dinner tables with white linen, candlelight, crystal glassware, soft floral arrangements, ocean and mountains in the background, sky fading from blue to amber, sophisticated outdoor wedding atmosphere, cinematic wide framing for homepage carousel, realistic lighting, elegant and calm mood, no text, no watermark, no logos`

## Prompt 03 - Garden wedding under string lights

`High-end editorial outdoor garden wedding reception at blue hour, warm string lights suspended above long tables, ivory flowers, refined table styling, guests softly out of focus, romantic ambience, natural candid luxury wedding photography, premium composition for a homepage hero banner, realistic textures, no text, no watermark, no logos`

## Prompt 04 - Indoor candlelit celebration

`Luxury editorial indoor wedding in a grand hall, warm candlelit atmosphere, elegant couple sharing a quiet moment near beautifully styled tables, soft beige and ivory palette, premium floral arrangements, cinematic shadows, refined interior wedding photography, tasteful and timeless, realistic detail, no text, no watermark, no logos`

## Prompt 05 - Cliffside vows at golden hour

`Editorial destination wedding on a cliffside overlooking the sea at golden hour, refined couple in formal wedding attire, wind moving veil and fabric, dramatic sky, minimal floral styling, elevated luxury aesthetic, emotional and cinematic but realistic, premium homepage hero composition, no text, no watermark, no logos`

## Prompt 06 - Hacienda courtyard dinner

`Luxury editorial wedding dinner in an open-air hacienda courtyard, stone arches, warm lanterns, long elegant tables, cream and champagne palette, intimate evening atmosphere, timeless Latin destination wedding mood, cinematic composition, realistic wedding photography, high detail in architecture and decor, no text, no watermark, no logos`

## Prompt 07 - Modern white beach brunch

`Sophisticated wedding brunch by the sea in natural morning light, modern white styling, delicate florals, linen textures, elegant coastal wedding atmosphere, airy editorial composition, luxury but natural, realistic premium wedding photography, clean and serene palette, no text, no watermark, no logos`

## Prompt 08 - First dance outdoors at night

`Luxury outdoor wedding first dance at night, soft warm lighting, elegant guests around the dance floor, candles and suspended lights, emotional cinematic composition, realistic wedding photography, high-end editorial atmosphere, rich contrast with warm highlights, homepage carousel framing, no text, no watermark, no logos`

## Prompt 09 - Close-up lifestyle detail scene

`Editorial wedding detail photograph, close-up of elegant place settings, crystal glasses, handwritten menu card without readable text, ivory florals, candlelight, linen texture, premium luxury wedding styling, shallow depth of field, warm romantic tone, realistic high-detail photography, no watermark, no logos`

## Prompt 10 - Romantic couple portrait outdoors

`Luxury editorial wedding portrait of a bride and groom outdoors at sunset, refined composition, soft wind, natural affectionate pose, premium destination wedding styling, subtle cinematic glow, realistic skin and fabric detail, emotional and timeless, suitable for homepage carousel, no text, no watermark, no logos`

## Best practice when generating

- Generate each scene twice: one `16:10` desktop version and one `4:3` mobile version.
- Keep the main subjects near the center 60 percent of the frame so responsive crops stay safe.
- Avoid ultra-busy backgrounds; the site headline needs room to breathe.
- Prefer warm neutrals, soft ivory, sand, champagne, sage, and sunset blues.
- Mix scene types in the carousel: 2 wide venue shots, 2 emotional people shots, 1 detail shot, 1 indoor shot.

## Suggested first carousel set

- Slide 01: Beach sunset ceremony
- Slide 02: Oceanfront reception at dusk
- Slide 03: Romantic couple portrait outdoors
- Slide 04: Hacienda courtyard dinner
- Slide 05: Editorial detail scene
