# Home Carousel Assets

Store the generated carousel images for the landing page here.

Recommended structure:

- `desktop/` for `16:10` assets
- `mobile/` for `4:3` assets

Recommended naming:

- `1.png` and `1.png`
- `2.png` and `2.png`
- or `home-slide-01.png` and `home-slide-01.png`

Important:

- Use the same base filename in both folders.
- The folder already tells the app whether the asset is desktop or mobile.

Recommended final export:

- Desktop: `2560 x 1600`
- Mobile: `1600 x 1200`
- Format: `webp`

Current workflow:

- Put your original generated files in `desktop/` and `mobile/`
- Run `npm run optimize:home-carousel`
- The optimizer will generate matching `.webp` files next to the originals
- The landing carousel already consumes the generated `.webp` files automatically
