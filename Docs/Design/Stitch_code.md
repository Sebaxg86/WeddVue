<!-- Design System -->
<!DOCTYPE html>

<html class="light" lang="es"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>WeddVue | Un Legado de Amor</title>
<!-- Fonts -->
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600&amp;family=Newsreader:ital,opsz,wght@1,6..72,400;1,6..72,600;1,6..72,800&amp;family=Plus+Jakarta+Sans:wght@400;500;600;700&amp;family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              "on-surface": "#2f3331",
              "on-primary-fixed-variant": "#5c5b5b",
              "surface-container-low": "#f3f4f1",
              "on-secondary-fixed": "#3f4035",
              "tertiary-dim": "#5b5240",
              "primary-container": "#e4e2e1",
              "tertiary-fixed-dim": "#e3d6be",
              "on-secondary": "#fafae9",
              "error-dim": "#5c1202",
              "surface-tint": "#5f5e5e",
              "primary-fixed": "#e4e2e1",
              "on-error-container": "#742410",
              "surface": "#faf9f7",
              "on-tertiary-fixed-variant": "#665c4a",
              "secondary": "#5f6053",
              "surface-container-lowest": "#ffffff",
              "on-primary-container": "#525151",
              "on-primary-fixed": "#3f3f3f",
              "on-error": "#fff7f6",
              "surface-container-high": "#e6e9e6",
              "secondary-dim": "#535448",
              "primary-fixed-dim": "#d6d4d3",
              "on-secondary-container": "#515347",
              "on-tertiary": "#fff8f0",
              "secondary-fixed": "#e3e3d3",
              "on-tertiary-fixed": "#48402f",
              "inverse-surface": "#0d0e0e",
              "inverse-primary": "#ffffff",
              "surface-dim": "#d6dbd7",
              "error-container": "#fe8b70",
              "secondary-container": "#e3e3d3",
              "error": "#9e422c",
              "surface-container": "#edeeeb",
              "inverse-on-surface": "#9d9d9b",
              "tertiary-container": "#f2e4cc",
              "on-secondary-fixed-variant": "#5b5c50",
              "outline-variant": "#afb3b0",
              "primary": "#2f3331",
              "on-background": "#2f3331",
              "primary-dim": "#535252",
              "outline": "#777c79",
              "surface-bright": "#faf9f7",
              "on-tertiary-container": "#5b5240",
              "tertiary": "#675e4b",
              "surface-container-highest": "#e0e3e0",
              "background": "#faf9f7",
              "on-surface-variant": "#5c605d",
              "surface-variant": "#e0e3e0",
              "on-primary": "#faf7f6",
              "tertiary-fixed": "#f2e4cc",
              "secondary-fixed-dim": "#d5d5c6"
            },
            fontFamily: {
              "headline": ["Newsreader"],
              "body": ["Manrope"],
              "label": ["Plus Jakarta Sans"]
            },
            borderRadius: {"DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem"},
          },
        },
      }
    </script>
<style>
      .material-symbols-outlined {
        font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
      }
      .editorial-shadow {
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05);
      }
      .transition-custom {
        transition: all 600ms cubic-bezier(0.23, 1, 0.32, 1);
      }
      .charcoal-bg {
        background-color: #2F3331;
      }
    </style>
</head>
<body class="bg-surface text-on-surface font-body overflow-x-hidden">
<!-- TopAppBar -->
<header class="fixed top-0 w-full z-50 bg-surface/40 backdrop-blur-md">
<div class="flex justify-between items-center px-8 py-6 w-full max-w-screen-xl mx-auto">
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-on-surface/60 scale-90">menu</span>
</div>
<h1 class="text-xl font-headline italic tracking-tighter text-on-surface">WeddVue</h1>
<div class="w-7 h-7 rounded-full bg-stone-200 overflow-hidden opacity-80">
<img alt="Perfil" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9p6EcFglJLo-ThYx510wMfTDpxh-VKOzs7ECfGgk-hkGjT474xHv6o7EIJOtDlued1YF3NHvt9Y7YyhvubFHWY2nSq0il574rYmzSS563jK4TW-ddIXaQoPE29u4lbHVr2xV0tb0OAsaBjwlXvAsc-vCS5cH6tS2Ca_uWZU-hudCdFoP0DoO1CcMMfxQ4-XVRhowsHXUQVd13QeqCC8zrXmKygD0FPIpqScTZ9fs9rM63mukZkX-5WbZMJ2AQwjiPbNMPbSAtmv8"/>
</div>
</div>
</header>
<!-- Main Content -->
<main class="pt-32 pb-40">
<!-- Editorial Hero Section -->
<section class="px-8 flex flex-col items-center text-center max-w-5xl mx-auto">
<span class="font-label text-[10px] tracking-[0.4rem] uppercase text-outline mb-12 block opacity-60">Una Experiencia Privada</span>
<h2 class="font-headline italic text-5xl md:text-8xl text-on-surface leading-[1.05] mb-12 max-w-4xl">
                Toda la belleza de tu historia, capturada por quienes amas.
            </h2>
<p class="font-headline italic text-xl md:text-2xl text-on-surface-variant/80 max-w-2xl mx-auto leading-relaxed mb-16 font-light">
                Preserva los momentos más íntimos y espontáneos de tu boda en una galería compartida, privada y eterna.
            </p>
<!-- Main Romantic Image -->
<div class="w-full mb-20 relative px-4 md:px-0">
<div class="aspect-[16/10] w-full rounded-sm overflow-hidden editorial-shadow">
<img class="w-full h-full object-cover" data-alt="Soft focus, romantic black and white or warm-toned photograph of a wedding couple in a tender embrace, cinematic lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmRE07iEywGTJtrX8MRqpS6kOv_YdRiAOZWw51O4EnWNP-pYD91DT5z7k9kIC7EOT_5CAVuZqDwoPxk3rGEWXWHd_nh2CBiETWowxrfuP_k-aDd6CrjAQ5F6j__BZDyYcvpu8gRP3JAKGKj7fExOdGQh_q9aQp1SDbetNu1S3PEIJSJIGPIhuiHU_RN_fWKa_ECVamL9sbLjGAiGlk9AOEFohLUdoUJouYO-yJi41QQFqxIFKN2TinspbxnbmV65PEMjMDN3q7Fw0"/>
</div>
<!-- Artistic Accent -->
<div class="absolute -bottom-8 -right-4 hidden md:block w-48 h-64 bg-surface-container-low p-2 rounded-sm editorial-shadow rotate-3 transition-custom hover:rotate-0">
<img class="w-full h-full object-cover" data-alt="Detail of a wedding dress fabric and lace in soft natural light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_Rk7m2zGIcWRHKOdz9cudl2zUIsztr0ytsjAstkccow4axZ1RDsionFVxmlUZuUUSFDdque05XRrkBG9q16qRB5QXVdUgvHLgBGOsrRzpUCxPHV7HmzbEpWzidRUkfjE50SST9qUuVa1st1yanewlJS7qPr3sRIA9pGg7V33JUH61JNnVbTlhMACulNvjvXimjngNwgXHkD6uFPJhJq4kjVfVPuRR9sF93eUFC1HD-jE-E432R2nCKhj2nsoA7KNl8uERxPrDaOw"/>
</div>
</div>
<!-- CTAs -->
<div class="flex flex-col items-center gap-10 w-full max-w-xs mx-auto">
<button class="charcoal-bg w-full py-6 rounded-sm font-label text-[11px] font-bold uppercase tracking-[0.3rem] text-on-primary transition-custom hover:opacity-95 active:scale-95 editorial-shadow">
                    Me voy a casar
                </button>
<a class="font-label text-[10px] uppercase tracking-[0.2rem] text-on-surface-variant hover:text-on-surface transition-custom border-b border-outline-variant/30 pb-1" href="#">
                    Ya tengo cuenta
                </a>
</div>
</section>
<!-- Quote Section -->
<section class="py-48 px-8 text-center bg-stone-50/30">
<div class="max-w-4xl mx-auto">
<blockquote class="font-headline italic text-3xl md:text-5xl text-on-surface-variant/70 leading-snug">
                    “Lo que se ve con el corazón queda grabado para siempre.”
                </blockquote>
<cite class="mt-12 block font-label text-[10px] uppercase tracking-[0.4rem] text-outline">WeddVue Anthology</cite>
</div>
</section>
</main>
<!-- Footer -->
<footer class="bg-surface w-full py-20 border-t border-outline-variant/10">
<div class="flex flex-col items-center px-8 gap-12 w-full max-w-screen-xl mx-auto">
<div class="font-headline italic text-2xl text-on-surface tracking-tighter">WeddVue</div>
<div class="flex flex-wrap justify-center gap-12">
<a class="font-label text-[10px] tracking-[0.2rem] uppercase text-outline hover:text-on-surface transition-all duration-500" href="#">Nuestra Historia</a>
<a class="font-label text-[10px] tracking-[0.2rem] uppercase text-outline hover:text-on-surface transition-all duration-500" href="#">Privacidad</a>
<a class="font-label text-[10px] tracking-[0.2rem] uppercase text-outline hover:text-on-surface transition-all duration-500" href="#">Contacto</a>
</div>
<div class="font-label text-[9px] tracking-[0.2rem] uppercase text-outline/50 mt-4">© 2024 WeddVue. Un legado de amor.</div>
</div>
</footer>
<!-- BottomNavBar (Visible on Mobile) -->
<nav class="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center py-6 px-4 bg-surface/80 backdrop-blur-xl z-50 border-t border-outline-variant/10">
<a class="flex flex-col items-center text-on-surface" href="#">
<span class="material-symbols-outlined text-xl" style="font-variation-settings: 'FILL' 1;">home</span>
</a>
<a class="flex flex-col items-center text-outline/40" href="#">
<span class="material-symbols-outlined text-xl">auto_awesome</span>
</a>
<a class="flex flex-col items-center text-outline/40" href="#">
<span class="material-symbols-outlined text-xl">favorite</span>
</a>
<a class="flex flex-col items-center text-outline/40" href="#">
<span class="material-symbols-outlined text-xl">settings</span>
</a>
</nav>
</body></html>

<!-- Portada Editorial WeddVue -->
<!DOCTYPE html>

<html class="light" lang="es"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>WeddVue | Atelier Privado</title>
<!-- Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,600;1,400;1,600&amp;family=Manrope:wght@400;500;600&amp;family=Plus+Jakarta+Sans:wght@500;600;700&amp;display=swap" rel="stylesheet"/>
<!-- Material Symbols -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              "on-surface": "#2f3331",
              "on-primary-fixed-variant": "#5c5b5b",
              "surface-container-low": "#f3f4f1",
              "on-secondary-fixed": "#3f4035",
              "tertiary-dim": "#5b5240",
              "primary-container": "#e4e2e1",
              "tertiary-fixed-dim": "#e3d6be",
              "on-secondary": "#fafae9",
              "error-dim": "#5c1202",
              "surface-tint": "#5f5e5e",
              "primary-fixed": "#e4e2e1",
              "on-error-container": "#742410",
              "surface": "#faf9f7",
              "on-tertiary-fixed-variant": "#665c4a",
              "secondary": "#5f6053",
              "surface-container-lowest": "#ffffff",
              "on-primary-container": "#525151",
              "on-primary-fixed": "#3f3f3f",
              "on-error": "#fff7f6",
              "surface-container-high": "#e6e9e6",
              "secondary-dim": "#535448",
              "primary-fixed-dim": "#d6d4d3",
              "on-secondary-container": "#515347",
              "on-tertiary": "#fff8f0",
              "secondary-fixed": "#e3e3d3",
              "on-tertiary-fixed": "#48402f",
              "inverse-surface": "#0d0e0e",
              "inverse-primary": "#ffffff",
              "surface-dim": "#d6dbd7",
              "error-container": "#fe8b70",
              "secondary-container": "#e3e3d3",
              "error": "#9e422c",
              "surface-container": "#edeeeb",
              "inverse-on-surface": "#9d9d9b",
              "tertiary-container": "#f2e4cc",
              "on-secondary-fixed-variant": "#5b5c50",
              "outline-variant": "#afb3b0",
              "primary": "#5f5e5e",
              "on-background": "#2f3331",
              "primary-dim": "#535252",
              "outline": "#777c79",
              "surface-bright": "#faf9f7",
              "on-tertiary-container": "#5b5240",
              "tertiary": "#675e4b",
              "surface-container-highest": "#e0e3e0",
              "background": "#faf9f7",
              "on-surface-variant": "#5c605d",
              "surface-variant": "#e0e3e0",
              "on-primary": "#faf7f6",
              "tertiary-fixed": "#f2e4cc",
              "secondary-fixed-dim": "#d5d5c6"
            },
            fontFamily: {
              "headline": ["Newsreader", "serif"],
              "body": ["Manrope", "sans-serif"],
              "label": ["Plus Jakarta Sans", "sans-serif"]
            },
            borderRadius: {"DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem"},
          },
        },
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        }
        .editorial-shadow {
            box-shadow: 0 12px 40px rgba(47, 51, 49, 0.04);
        }
        .silk-gradient {
            background: linear-gradient(45deg, #5f5e5e, #535252);
        }
        body {
            -webkit-font-smoothing: antialiased;
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-surface text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container">
<!-- TopAppBar -->
<header class="fixed top-0 w-full z-50 bg-stone-50/80 dark:bg-stone-900/80 backdrop-blur-xl">
<div class="flex justify-between items-center px-6 py-4 w-full max-w-screen-xl mx-auto">
<button class="text-stone-700 dark:text-stone-300">
<span class="material-symbols-outlined" data-icon="menu">menu</span>
</button>
<h1 class="text-2xl font-serif text-stone-800 dark:text-stone-100 italic tracking-tight">WeddVue</h1>
<div class="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/30">
<img alt="Perfil de usuario" data-alt="close-up portrait of a sophisticated woman with elegant styling against a neutral warm background, editorial photography style" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxOdotP7L9hcgzSanj1gaTR-_5cIaUbvyes7MlmmpK322Jv960Nz9K3oVQfcKgHKhdcf4YmWDpBe6BiPxLyID_floFwNFGKWn7FOwMla8cOfd1m8eBmwO5spnSzoyFjhBIJNuk2bY0jAK73jaUwf13HSro43e5YokHmS5UOrU_p_EPP-ROPI3b27ugxJVfg-s3GCS1qnzqy01_2QLJvjzzBiD9ZdQdleeq7LJSlG5zmu7la6IplDHtAAUhaWYM7DFe51TxZ9PcQNA"/>
</div>
</div>
</header>
<main class="pt-24 pb-32 px-6 max-w-screen-xl mx-auto">
<!-- Hero Section: Editorial Welcome -->
<section class="mb-16">
<div class="flex flex-col gap-2">
<span class="font-label text-xs uppercase tracking-[0.2rem] text-primary/60">Bienvenida a su atelier</span>
<h2 class="font-headline text-5xl text-on-surface leading-tight italic">Un momento <br/> para siempre</h2>
</div>
</section>
<!-- Primary Action -->
<section class="mb-12">
<button class="silk-gradient w-full md:w-auto px-8 py-5 rounded-md flex items-center justify-between md:justify-center gap-4 group transition-all duration-500">
<span class="font-label text-sm font-bold uppercase tracking-[0.15rem] text-on-primary">Crear nuevo evento</span>
<span class="material-symbols-outlined text-on-primary group-hover:translate-x-1 transition-transform" data-icon="add_circle">add_circle</span>
</button>
</section>
<!-- Event Grid: Asymmetric Editorial Layout -->
<section class="grid grid-cols-1 md:grid-cols-12 gap-10">
<!-- Event Card 1 -->
<div class="md:col-span-7 group cursor-pointer">
<div class="relative aspect-[4/5] overflow-hidden rounded-xl bg-surface-container mb-6">
<img class="w-full h-full object-cover grayscale-[0.3] group-hover:scale-105 transition-transform duration-1000" data-alt="wide shot of a minimalist luxury wedding reception outdoors during sunset with long white linen tables and warm candlelight" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAV4houBuNn6q_c0GBsNX3vOs4l3sjvDNPDC2_wEbG74M_kxpIVPHOWkvbaW2S0lQDASeRbs6y4G4_7Uq3zzA9biv9cUMxsXAAgEFdhmKGi0YZ8HuaLdjM2AhFCSHD0TDf0FX0HxwJ_LWj23cM9U0IVUh1-SWrocH66af1bJIIOWRk711NYrYHDS-ZL9gT9sK-nNXsZ3p1VbeVa3q5AmUH49qn6Q7VapfzYsRiqYSoPJUSPTOiOV8d8SQsPuEyRpQUl1VmfZFv_nmg"/>
<div class="absolute inset-0 bg-secondary/10 mix-blend-multiply"></div>
</div>
<div class="flex flex-col gap-1">
<h3 class="font-headline text-3xl italic text-on-surface">La Ceremonia Civil</h3>
<p class="font-label text-xs uppercase tracking-widest text-outline">12 de Octubre, 2024</p>
</div>
</div>
<!-- Event Card 2 -->
<div class="md:col-span-5 md:mt-24 group cursor-pointer">
<div class="relative aspect-square overflow-hidden rounded-xl bg-surface-container mb-6">
<img class="w-full h-full object-cover grayscale-[0.2] group-hover:scale-105 transition-transform duration-1000" data-alt="elegant table setting with fine china, crystal glassware, and ivory roses on a neutral beige linen cloth, soft sunlight" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrQKeOiD2GIG0of1wEtLeGV_vjfxgGO0i7SGExWNAwN9WUW-bBrh69vEQdVPyaPnPo7MMDmxxvat4cTe6SluInQvbrCH4J1Qpdm-olhERgHn4xs3Zais2rE3mikpa7wi01OolKPEc2JUH0dLrKl1GLR5u295wpuJToytoIimApIQMZ_6DO5PnfQJL9teJ-vg0kRJgkuX2JJJo-Fz0OYhZzg-JOkTnssZeY_TAkBi8YBiirEc55B3PUh-egnCp2nzNIrEWQjcGSONU"/>
<div class="absolute inset-0 bg-secondary/10 mix-blend-multiply"></div>
</div>
<div class="flex flex-col gap-1">
<h3 class="font-headline text-3xl italic text-on-surface">Cena de Ensayo</h3>
<p class="font-label text-xs uppercase tracking-widest text-outline">11 de Octubre, 2024</p>
</div>
</div>
<!-- Event Card 3 -->
<div class="md:col-span-4 group cursor-pointer">
<div class="relative aspect-[3/4] overflow-hidden rounded-xl bg-surface-container mb-6">
<img class="w-full h-full object-cover grayscale-[0.4] group-hover:scale-105 transition-transform duration-1000" data-alt="high-end wedding floral arrangement featuring white orchids and delicate greenery in a contemporary glass vase, moody lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuApdXReMI4tQIVxGTBWT9OMEFrxSdNaVNAoTEnX-WlvC9OwtqyrGcN1ch4Q37NzrT71nzbzXtMXGgzadwBHtSuZo_-N6quP7UJLs1hpZTyrMIlMVcv9-vgxuPpMPeMpaVQ3MyxkFTr9vE5Pzjm5Bl_8cLY67y0LhUDJPuqHzWWOdB4Fwah5iZJ9NFne2FnHmR7PdlM11suxI4MXuR86qAWT4glPejQAWsvpkuYwfNJmIQnKCFfxQrKxgsCV-Ze5pAzLGWDHpn8HWn8"/>
<div class="absolute inset-0 bg-secondary/10 mix-blend-multiply"></div>
</div>
<div class="flex flex-col gap-1">
<h3 class="font-headline text-2xl italic text-on-surface">Brunch de Despedida</h3>
<p class="font-label text-xs uppercase tracking-widest text-outline">13 de Octubre, 2024</p>
</div>
</div>
<!-- Empty State / Placeholder with Asymmetric spacing -->
<div class="md:col-span-8 flex items-center justify-center p-12 border border-outline-variant/10 rounded-xl bg-surface-container-low/30 min-h-[300px]">
<div class="text-center max-w-xs">
<p class="font-headline italic text-lg text-outline/60 mb-4 italic">“El amor es, sobre todo, la cura a la soledad.”</p>
<span class="font-label text-[10px] uppercase tracking-widest text-outline/40">— Fragmento de un sueño</span>
</div>
</div>
</section>
</main>
<!-- BottomNavBar -->
<nav class="fixed bottom-0 left-0 w-full z-50 rounded-t-3xl bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-2xl shadow-[0_-8px_30px_rgb(0,0,0,0.04)] md:hidden">
<div class="flex justify-around items-center pt-3 pb-6 px-4">
<a class="flex flex-col items-center text-stone-900 dark:text-stone-50 font-bold scale-110 transition-transform" href="#">
<span class="material-symbols-outlined" data-icon="home" style="font-variation-settings: 'FILL' 1;">home</span>
<span class="font-sans text-[10px] uppercase tracking-[0.1rem] mt-1">Inicio</span>
</a>
<a class="flex flex-col items-center text-stone-400 dark:text-stone-500 hover:text-stone-600 transition-colors" href="#">
<span class="material-symbols-outlined" data-icon="auto_awesome">auto_awesome</span>
<span class="font-sans text-[10px] uppercase tracking-[0.1rem] mt-1">Eventos</span>
</a>
<a class="flex flex-col items-center text-stone-400 dark:text-stone-500 hover:text-stone-600 transition-colors" href="#">
<span class="material-symbols-outlined" data-icon="group">group</span>
<span class="font-sans text-[10px] uppercase tracking-[0.1rem] mt-1">Invitados</span>
</a>
<a class="flex flex-col items-center text-stone-400 dark:text-stone-500 hover:text-stone-600 transition-colors" href="#">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
<span class="font-sans text-[10px] uppercase tracking-[0.1rem] mt-1">Ajustes</span>
</a>
</div>
</nav>
<!-- Footer -->
<footer class="w-full py-12 bg-stone-100 dark:bg-stone-950 mb-20 md:mb-0">
<div class="flex flex-col md:flex-row justify-between items-center px-12 gap-8 max-w-screen-xl mx-auto">
<div class="flex flex-col items-center md:items-start gap-2">
<span class="font-serif italic text-lg text-stone-800 dark:text-stone-200">WeddVue</span>
<p class="font-sans text-xs tracking-widest uppercase text-stone-600 dark:text-stone-400 text-center md:text-left">© 2024 WeddVue. Un momento para siempre.</p>
</div>
<div class="flex gap-8">
<a class="font-sans text-xs tracking-widest uppercase text-stone-600 dark:text-stone-400 hover:text-stone-900 transition-all duration-500" href="#">Nuestra Historia</a>
<a class="font-sans text-xs tracking-widest uppercase text-stone-600 dark:text-stone-400 hover:text-stone-900 transition-all duration-500" href="#">Privacidad</a>
<a class="font-sans text-xs tracking-widest uppercase text-stone-600 dark:text-stone-400 hover:text-stone-900 transition-all duration-500" href="#">Contacto</a>
</div>
</div>
</footer>
</body></html>

<!-- Panel de Control -->
<!DOCTYPE html>

<html class="light" lang="es"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>WeddVue | Gestión de Evento</title>
<!-- Material Symbols -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<!-- Google Fonts: Newsreader, Manrope, Plus Jakarta Sans -->
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&amp;family=Manrope:wght@200..800&amp;family=Plus+Jakarta+Sans:wght@200..800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              "on-surface": "#2f3331",
              "on-primary-fixed-variant": "#5c5b5b",
              "surface-container-low": "#f3f4f1",
              "on-secondary-fixed": "#3f4035",
              "tertiary-dim": "#5b5240",
              "primary-container": "#e4e2e1",
              "tertiary-fixed-dim": "#e3d6be",
              "on-secondary": "#fafae9",
              "error-dim": "#5c1202",
              "surface-tint": "#5f5e5e",
              "primary-fixed": "#e4e2e1",
              "on-error-container": "#742410",
              "surface": "#faf9f7",
              "on-tertiary-fixed-variant": "#665c4a",
              "secondary": "#5f6053",
              "surface-container-lowest": "#ffffff",
              "on-primary-container": "#525151",
              "on-primary-fixed": "#3f3f3f",
              "on-error": "#fff7f6",
              "surface-container-high": "#e6e9e6",
              "secondary-dim": "#535448",
              "primary-fixed-dim": "#d6d4d3",
              "on-secondary-container": "#515347",
              "on-tertiary": "#fff8f0",
              "secondary-fixed": "#e3e3d3",
              "on-tertiary-fixed": "#48402f",
              "inverse-surface": "#0d0e0e",
              "inverse-primary": "#ffffff",
              "surface-dim": "#d6dbd7",
              "error-container": "#fe8b70",
              "secondary-container": "#e3e3d3",
              "error": "#9e422c",
              "surface-container": "#edeeeb",
              "inverse-on-surface": "#9d9d9b",
              "tertiary-container": "#f2e4cc",
              "on-secondary-fixed-variant": "#5b5c50",
              "outline-variant": "#afb3b0",
              "primary": "#5f5e5e",
              "on-background": "#2f3331",
              "primary-dim": "#535252",
              "outline": "#777c79",
              "surface-bright": "#faf9f7",
              "on-tertiary-container": "#5b5240",
              "tertiary": "#675e4b",
              "surface-container-highest": "#e0e3e0",
              "background": "#faf9f7",
              "on-surface-variant": "#5c605d",
              "surface-variant": "#e0e3e0",
              "on-primary": "#faf7f6",
              "tertiary-fixed": "#f2e4cc",
              "secondary-fixed-dim": "#d5d5c6"
            },
            fontFamily: {
              "headline": ["Newsreader", "serif"],
              "body": ["Manrope", "sans-serif"],
              "label": ["Plus Jakarta Sans", "sans-serif"]
            },
            borderRadius: {"DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem"},
          },
        },
      }
    </script>
<style>
      .material-symbols-outlined {
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      }
      body {
        background-color: #faf9f7;
        color: #2f3331;
      }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="font-body selection:bg-primary-container selection:text-primary min-h-screen">
<!-- TopAppBar -->
<header class="fixed top-0 w-full z-50 bg-stone-50/80 dark:bg-stone-900/80 backdrop-blur-xl">
<div class="flex justify-between items-center px-6 py-4 w-full max-w-screen-xl mx-auto">
<button class="text-stone-700 dark:text-stone-300">
<span class="material-symbols-outlined" data-icon="menu">menu</span>
</button>
<h1 class="text-2xl font-serif text-stone-800 dark:text-stone-100 italic tracking-tight">WeddVue</h1>
<div class="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant/15">
<img alt="Perfil de usuario" data-alt="Close up portrait of a smiling woman with elegant styling in soft natural daylight" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBolkBIkHuCcUKPa4xeAVQNJ2mjVw5DG89TrKykYH1mf-KSjLvOwe29ME-bV74FBBx8po2Tv4VWG1jyAmTwN8Yw-2nYZYATk-AlfXNZ1zi9f4ggE80WB2Wm6_6fyqiDX5I8NEDGCmU7OiPpa0O7cj15vhy5rGGUTT88MV5HUb5My2s6oH6LgGuHu2X_Dolp8tEUrz4LScTcbS_yewf2e5GXmpy9hpUB1hjmS1HiZ0vT05iJiBPYyn3UNVIKie1IbiWnfq1j0DLvom8"/>
</div>
</div>
</header>
<main class="pt-24 pb-32 px-6 max-w-md mx-auto min-h-screen">
<!-- Hero Header -->
<section class="mb-12">
<span class="font-label text-xs uppercase tracking-[0.2rem] text-secondary-dim/70 mb-2 block">Panel de Control</span>
<h2 class="font-headline text-4xl italic text-on-surface mb-4 leading-tight">Enlace de Sofía &amp; Alejandro</h2>
<div class="flex items-center gap-3 text-secondary-dim font-label text-sm">
<span class="material-symbols-outlined text-base" data-icon="calendar_today">calendar_today</span>
<span>24 de Septiembre, 2024</span>
</div>
</section>
<!-- Stats Grid (Bento style minimal) -->
<div class="grid grid-cols-2 gap-4 mb-12">
<div class="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10">
<p class="font-label text-[10px] uppercase tracking-wider text-secondary mb-1">Mesas</p>
<p class="font-headline text-3xl italic">24</p>
</div>
<div class="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10">
<p class="font-label text-[10px] uppercase tracking-wider text-secondary mb-1">Confirmados</p>
<p class="font-headline text-3xl italic">142</p>
</div>
</div>
<!-- Table Management Section -->
<section class="space-y-6">
<div class="flex justify-between items-end mb-6">
<h3 class="font-headline text-2xl italic">Distribución de Mesas</h3>
<button class="font-label text-xs uppercase tracking-widest text-primary border-b border-outline-variant/30 pb-1">Ver todas</button>
</div>
<!-- Table Cards -->
<div class="space-y-4">
<!-- Card 1 -->
<div class="bg-surface-container-lowest p-6 rounded-xl shadow-[0_12px_40px_rgba(47,51,49,0.04)] border border-outline-variant/5">
<div class="flex justify-between items-start mb-4">
<div>
<h4 class="font-headline text-xl mb-1">Familia García</h4>
<p class="font-label text-xs text-secondary-dim/60 tracking-wide">Mesa Real • 8 Invitados</p>
</div>
<div class="bg-surface-container-low p-2 rounded-lg">
<span class="material-symbols-outlined text-on-surface-variant" data-icon="restaurant">restaurant</span>
</div>
</div>
<div class="flex items-center justify-between pt-4 border-t border-outline-variant/10">
<button class="flex items-center gap-2 group">
<span class="material-symbols-outlined text-primary text-lg" data-icon="qr_code_2">qr_code_2</span>
<span class="font-label text-xs uppercase tracking-[0.1rem] text-primary group-hover:text-primary-dim transition-colors">Ver código QR</span>
</button>
<button class="p-1">
<span class="material-symbols-outlined text-outline" data-icon="more_horiz">more_horiz</span>
</button>
</div>
</div>
<!-- Card 2 -->
<div class="bg-surface-container-lowest p-6 rounded-xl shadow-[0_12px_40px_rgba(47,51,49,0.04)] border border-outline-variant/5">
<div class="flex justify-between items-start mb-4">
<div>
<h4 class="font-headline text-xl mb-1">Amigos Universidad</h4>
<p class="font-label text-xs text-secondary-dim/60 tracking-wide">Mesa Jardín • 10 Invitados</p>
</div>
<div class="bg-surface-container-low p-2 rounded-lg">
<span class="material-symbols-outlined text-on-surface-variant" data-icon="celebration">celebration</span>
</div>
</div>
<div class="flex items-center justify-between pt-4 border-t border-outline-variant/10">
<button class="flex items-center gap-2 group">
<span class="material-symbols-outlined text-primary text-lg" data-icon="qr_code_2">qr_code_2</span>
<span class="font-label text-xs uppercase tracking-[0.1rem] text-primary group-hover:text-primary-dim transition-colors">Ver código QR</span>
</button>
<button class="p-1">
<span class="material-symbols-outlined text-outline" data-icon="more_horiz">more_horiz</span>
</button>
</div>
</div>
<!-- Card 3 (Asymmetric/Different Accent) -->
<div class="bg-primary/5 p-6 rounded-xl border border-primary/10 relative overflow-hidden">
<div class="relative z-10">
<div class="flex justify-between items-start mb-4">
<div>
<h4 class="font-headline text-xl mb-1">Mesa de Honor</h4>
<p class="font-label text-xs text-primary-dim/70 tracking-wide">Principal • 4 Invitados</p>
</div>
<span class="material-symbols-outlined text-primary" data-icon="star" style="font-variation-settings: 'FILL' 1;">star</span>
</div>
<div class="flex items-center justify-between pt-4 border-t border-primary/10">
<button class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary text-lg" data-icon="qr_code_2">qr_code_2</span>
<span class="font-label text-xs uppercase tracking-[0.1rem] text-primary">Ver código QR</span>
</button>
</div>
</div>
<div class="absolute -right-4 -bottom-4 opacity-5">
<span class="material-symbols-outlined text-8xl" data-icon="favorite">favorite</span>
</div>
</div>
</div>
</section>
<!-- QR Generation Promo Card -->
<section class="mt-12 mb-8 bg-secondary-fixed text-on-secondary-fixed p-8 rounded-2xl relative overflow-hidden">
<div class="relative z-10">
<h3 class="font-headline text-2xl italic mb-2">Acceso Instantáneo</h3>
<p class="font-body text-sm mb-6 leading-relaxed opacity-80">Genera códigos QR personalizados para que tus invitados localicen su mesa con un simple escaneo desde su móvil.</p>
<button class="bg-primary text-on-primary px-6 py-3 rounded-md font-label text-xs uppercase tracking-widest shadow-lg hover:bg-primary-dim transition-all">
                    Generar Todos
                </button>
</div>
<div class="absolute right-0 top-0 h-full w-1/3 opacity-10">
<img alt="Pattern" class="h-full w-full object-cover" data-alt="Abstract minimalist pattern of white wedding linens with soft shadows and elegant texture" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDggeGdMkp2ipitGmMqsX_YGKXkZ0PjIPrS7FLdjOYInLZzdqb6kA4aP3fiIFEkKwB-VRrfQGisHJP-fp3vw9js9sd-_T1-jo4Z3ieGV_ET_aTmf8o0X27wdFgkIAGMnS6PkOcnYN1qJ8NCSoVfj1uj46MvRINozFe2j5Vvi-1QT165k6SEVI-i2rtrfV1bFSLlgVkPpTd4035EUMpe5x17CbGA8viqLBTb6iG_inHlNzqcalpXtMkRguT_yq1bXwZrT3qRclZqa78"/>
</div>
</section>
</main>
<!-- BottomNavBar -->
<nav class="fixed bottom-0 left-0 w-full flex justify-around items-center pt-3 pb-6 px-4 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-2xl z-50 rounded-t-3xl shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
<button class="flex flex-col items-center text-stone-400 dark:text-stone-500">
<span class="material-symbols-outlined" data-icon="home">home</span>
<span class="font-sans text-[10px] uppercase tracking-[0.1rem]">Inicio</span>
</button>
<button class="flex flex-col items-center text-stone-900 dark:text-stone-50 font-bold scale-110 transition-transform">
<span class="material-symbols-outlined" data-icon="auto_awesome" style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
<span class="font-sans text-[10px] uppercase tracking-[0.1rem]">Eventos</span>
</button>
<button class="flex flex-col items-center text-stone-400 dark:text-stone-500">
<span class="material-symbols-outlined" data-icon="group">group</span>
<span class="font-sans text-[10px] uppercase tracking-[0.1rem]">Invitados</span>
</button>
<button class="flex flex-col items-center text-stone-400 dark:text-stone-500">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
<span class="font-sans text-[10px] uppercase tracking-[0.1rem]">Ajustes</span>
</button>
</nav>
<!-- Contextual FAB (Suppressing as per mandate on Details/Workspace focus) -->
<!-- The FAB is suppressed here to allow focused table management -->
<!-- Footer -->
<footer class="w-full py-12 bg-stone-100 dark:bg-stone-950 flex flex-col md:flex-row justify-between items-center px-12 gap-8 mb-20">
<div class="font-serif italic text-lg text-stone-800 dark:text-stone-200">WeddVue</div>
<div class="flex gap-6">
<a class="font-sans text-xs tracking-widest uppercase text-stone-600 dark:text-stone-400 no-underline hover:text-stone-900 transition-all duration-500" href="#">Privacidad</a>
<a class="font-sans text-xs tracking-widest uppercase text-stone-600 dark:text-stone-400 no-underline hover:text-stone-900 transition-all duration-500" href="#">Contacto</a>
</div>
<p class="font-sans text-xs tracking-widest uppercase text-stone-600 dark:text-stone-400">© 2024 WeddVue. Un momento para siempre.</p>
</footer>
</body></html>

<!-- Espacio del Evento -->
<!DOCTYPE html>

<html class="light" lang="es"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>WeddVue - Comparte tus Momentos</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,600;1,400;1,600&amp;family=Manrope:wght@400;500;600&amp;family=Plus_Jakarta_Sans:wght@400;500;600;700&amp;family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "on-surface": "#2f3331",
                        "on-primary-fixed-variant": "#5c5b5b",
                        "surface-container-low": "#f3f4f1",
                        "on-secondary-fixed": "#3f4035",
                        "tertiary-dim": "#5b5240",
                        "primary-container": "#e4e2e1",
                        "tertiary-fixed-dim": "#e3d6be",
                        "on-secondary": "#fafae9",
                        "error-dim": "#5c1202",
                        "surface-tint": "#5f5e5e",
                        "primary-fixed": "#e4e2e1",
                        "on-error-container": "#742410",
                        "surface": "#faf9f7",
                        "on-tertiary-fixed-variant": "#665c4a",
                        "secondary": "#5f6053",
                        "surface-container-lowest": "#ffffff",
                        "on-primary-container": "#525151",
                        "on-primary-fixed": "#3f3f3f",
                        "on-error": "#fff7f6",
                        "surface-container-high": "#e6e9e6",
                        "secondary-dim": "#535448",
                        "primary-fixed-dim": "#d6d4d3",
                        "on-secondary-container": "#515347",
                        "on-tertiary": "#fff8f0",
                        "secondary-fixed": "#e3e3d3",
                        "on-tertiary-fixed": "#48402f",
                        "inverse-surface": "#0d0e0e",
                        "inverse-primary": "#ffffff",
                        "surface-dim": "#d6dbd7",
                        "error-container": "#fe8b70",
                        "secondary-container": "#e3e3d3",
                        "error": "#9e422c",
                        "surface-container": "#edeeeb",
                        "inverse-on-surface": "#9d9d9b",
                        "tertiary-container": "#f2e4cc",
                        "on-secondary-fixed-variant": "#5b5c50",
                        "outline-variant": "#afb3b0",
                        "primary": "#5f5e5e",
                        "on-background": "#2f3331",
                        "primary-dim": "#535252",
                        "outline": "#777c79",
                        "surface-bright": "#faf9f7",
                        "on-tertiary-container": "#5b5240",
                        "tertiary": "#675e4b",
                        "surface-container-highest": "#e0e3e0",
                        "background": "#faf9f7",
                        "on-surface-variant": "#5c605d",
                        "surface-variant": "#e0e3e0",
                        "on-primary": "#faf7f6",
                        "tertiary-fixed": "#f2e4cc",
                        "secondary-fixed-dim": "#d5d5c6"
                    },
                    fontFamily: {
                        "headline": ["Newsreader", "serif"],
                        "body": ["Manrope", "sans-serif"],
                        "label": ["Plus Jakarta Sans", "sans-serif"]
                    },
                    borderRadius: {"DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem"},
                },
            },
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .editorial-gradient {
            background: linear-gradient(45deg, #5f5e5e, #535252);
        }
        .glass-nav {
            background: rgba(250, 249, 247, 0.8);
            backdrop-filter: blur(20px);
        }
        input:focus {
            outline: none;
            border-bottom-color: #5f5e5e !important;
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-surface text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container">
<!-- TopAppBar - Suppressed active nav as this is a focused transactional journey (Upload) -->
<nav class="fixed top-0 w-full z-50 bg-stone-50/80 dark:bg-stone-900/80 backdrop-blur-xl transition-all duration-300">
<div class="flex justify-between items-center px-6 py-4 w-full max-w-screen-xl mx-auto">
<span class="text-2xl font-serif text-stone-800 dark:text-stone-100 italic font-serif italic tracking-tight">WeddVue</span>
<div class="w-8 h-8 rounded-full overflow-hidden bg-surface-container">
<img alt="Guest Avatar" class="w-full h-full object-cover" data-alt="Soft focused close up of a wedding guest smiling in warm golden hour lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSxZze1eBEeks1SrzI-jTH9o642E2qeLcZlIDY10ii6mbjruZbTlefrd1Gm2JdO7IsYeFm7HaW9DoQyyqMr0H0H-qU55nXIridq5No9pZmA9hThsoMY86dU2p2d5xoHdjGo3m5oq7dpyCnniUUA2Ifaf1XgG1GcEWWTK1EwdDK3cCocqRY5MStTFUxISA4AxqLHDN9-vNAlZ3P8leJLmQzRAGxDEiZ9WPdlb5WkG8UrAAbrBL0B0-gzAJVFJSRzwBNpaQ2oH8AT1Q"/>
</div>
</div>
</nav>
<main class="pt-24 pb-32 px-6 min-h-screen flex flex-col max-w-lg mx-auto">
<!-- Hero Editorial Header -->
<header class="mb-12 text-center md:text-left relative">
<div class="inline-block mb-4">
<span class="font-label text-xs tracking-[0.2em] uppercase text-secondary/70">Celebración</span>
</div>
<h1 class="font-headline text-5xl md:text-6xl text-on-surface leading-[1.1] mb-4">
                ¡Bienvenidos a la boda de <span class="italic block mt-1">Sofía &amp; Mateo</span>!
            </h1>
<p class="font-body text-lg text-on-surface-variant leading-relaxed">
                Ayúdanos a capturar la magia de este día a través de tus ojos.
            </p>
</header>
<!-- Form Section with Tonal Layering -->
<section class="space-y-10">
<!-- User Name Input -->
<div class="relative group">
<label class="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 group-focus-within:text-primary transition-colors" for="guest-name">
                    Tu nombre
                </label>
<input class="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant/30 py-3 px-0 text-xl font-body placeholder:text-outline-variant/50 focus:ring-0 transition-all duration-300" id="guest-name" name="guest-name" placeholder="Ej. Carlos Méndez" type="text"/>
</div>
<!-- Visual Context / Editorial Card -->
<div class="relative aspect-[4/5] rounded-xl overflow-hidden shadow-[0_12px_40px_rgba(47,51,49,0.04)] bg-surface-container-low group">
<img alt="Wedding mood" class="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" data-alt="Elegant wedding table setting with white flowers and candle light in a soft desaturated cinematic style" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1czbLtCkN4M7kaipHlgtecB_GMwB0OMEQ3ev3OwKDzOQIz5Mac0MTw1UwRRnPnV4DD2W3R-K3MCY2CPRuLU473FYYSC-jTstHuXgXtcyYFEvW2GQ_obOc8fboKFi9J7ZhK_Sdc3mUh1sm9OPRohoIEo6_3h10xnsl8yYMY1P84iG-Xo4DTxbxIxdHyR6fMYiRpkuOO7Ume29VYyxZcYTPFYZQSDzZh-uYbHAjq-5s_wt8ASw-ZE7fPbILjbFwY37WKSKHRB_d2ZU"/>
<div class="absolute inset-0 bg-gradient-to-t from-stone-900/40 to-transparent"></div>
<!-- Upload Zone -->
<div class="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
<div class="bg-surface/90 backdrop-blur-md p-8 rounded-full shadow-xl mb-4 border border-white/20">
<span class="material-symbols-outlined text-4xl text-primary" data-icon="add_a_photo">add_a_photo</span>
</div>
<button class="font-label text-xs tracking-[0.15em] uppercase bg-surface text-on-surface px-6 py-3 rounded-md shadow-sm active:scale-95 transition-transform">
                        Subir hasta 10 fotos
                    </button>
<p class="mt-4 text-white font-body text-sm italic opacity-90">Momentos que duran para siempre</p>
</div>
</div>
<!-- Action Area -->
<div class="pt-4 flex flex-col gap-6">
<button class="editorial-gradient w-full py-5 rounded-md text-on-primary font-label text-sm uppercase tracking-[0.15em] font-bold shadow-lg hover:brightness-110 active:scale-[0.98] transition-all">
                    Compartir fotos
                </button>
<div class="flex items-center gap-4 py-4 px-6 bg-surface-container-low rounded-xl border border-outline-variant/5">
<span class="material-symbols-outlined text-secondary" data-icon="auto_awesome">auto_awesome</span>
<p class="font-body text-sm text-secondary-dim leading-snug">
                        Tus fotos se añadirán al álbum digital de la pareja instantáneamente.
                    </p>
</div>
</div>
</section>
<!-- Emotional Footer Anchor -->
<footer class="mt-auto pt-20 pb-12 text-center">
<p class="font-headline italic text-2xl text-stone-400 mb-2">Gracias por ser parte de este momento</p>
<div class="w-12 h-[1px] bg-outline-variant/20 mx-auto my-6"></div>
<div class="space-y-4">
<p class="font-serif italic text-lg text-stone-800 dark:text-stone-200">WeddVue</p>
<div class="flex justify-center gap-6">
<a class="font-sans text-xs tracking-widest uppercase text-stone-600 dark:text-stone-400 hover:text-stone-900 transition-colors" href="#">Privacidad</a>
<a class="font-sans text-xs tracking-widest uppercase text-stone-600 dark:text-stone-400 hover:text-stone-900 transition-colors" href="#">Contacto</a>
</div>
<p class="font-sans text-[10px] tracking-widest uppercase text-stone-400 mt-8 opacity-60">
                    © 2024 WeddVue. Un momento para siempre.
                </p>
</div>
</footer>
</main>
<!-- Navigation suppressed for focused upload journey as per 'Semantic Shell Mandate' -->
</body></html>

<!-- Subida de Fotos para Invitados -->
<!DOCTYPE html>

<html class="light" lang="es"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>WeddVue | Iniciar Sesión</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,600;1,400;1,600&amp;family=Manrope:wght@400;500;600&amp;family=Plus+Jakarta+Sans:wght@400;500;600;700&amp;family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              "on-surface": "#2f3331",
              "on-primary-fixed-variant": "#5c5b5b",
              "surface-container-low": "#f3f4f1",
              "on-secondary-fixed": "#3f4035",
              "tertiary-dim": "#5b5240",
              "primary-container": "#e4e2e1",
              "tertiary-fixed-dim": "#e3d6be",
              "on-secondary": "#fafae9",
              "error-dim": "#5c1202",
              "surface-tint": "#5f5e5e",
              "primary-fixed": "#e4e2e1",
              "on-error-container": "#742410",
              "surface": "#faf9f7",
              "on-tertiary-fixed-variant": "#665c4a",
              "secondary": "#5f6053",
              "surface-container-lowest": "#ffffff",
              "on-primary-container": "#525151",
              "on-primary-fixed": "#3f3f3f",
              "on-error": "#fff7f6",
              "surface-container-high": "#e6e9e6",
              "secondary-dim": "#535448",
              "primary-fixed-dim": "#d6d4d3",
              "on-secondary-container": "#515347",
              "on-tertiary": "#fff8f0",
              "secondary-fixed": "#e3e3d3",
              "on-tertiary-fixed": "#48402f",
              "inverse-surface": "#0d0e0e",
              "inverse-primary": "#ffffff",
              "surface-dim": "#d6dbd7",
              "error-container": "#fe8b70",
              "secondary-container": "#e3e3d3",
              "error": "#9e422c",
              "surface-container": "#edeeeb",
              "inverse-on-surface": "#9d9d9b",
              "tertiary-container": "#f2e4cc",
              "on-secondary-fixed-variant": "#5b5c50",
              "outline-variant": "#afb3b0",
              "primary": "#5f5e5e",
              "on-background": "#2f3331",
              "primary-dim": "#535252",
              "outline": "#777c79",
              "surface-bright": "#faf9f7",
              "on-tertiary-container": "#5b5240",
              "tertiary": "#675e4b",
              "surface-container-highest": "#e0e3e0",
              "background": "#faf9f7",
              "on-surface-variant": "#5c605d",
              "surface-variant": "#e0e3e0",
              "on-primary": "#faf7f6",
              "tertiary-fixed": "#f2e4cc",
              "secondary-fixed-dim": "#d5d5c6"
            },
            fontFamily: {
              "headline": ["Newsreader", "serif"],
              "body": ["Manrope", "sans-serif"],
              "label": ["Plus Jakarta Sans", "sans-serif"]
            },
            borderRadius: {"DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem"},
          },
        },
      }
    </script>
<style>
      .material-symbols-outlined {
        font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
      }
      .bg-primary-silk {
        background: linear-gradient(45deg, #5f5e5e, #535252);
      }
      .glass-nav {
        background-color: rgba(250, 249, 247, 0.8);
        backdrop-filter: blur(20px);
      }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-surface text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col">
<!-- TopAppBar suppressed for Transactional focus (Auth Page) -->
<main class="flex-grow flex flex-col items-center justify-center px-6 py-12 md:py-24 max-w-screen-xl mx-auto w-full">
<!-- Branding Header -->
<div class="mb-12 text-center">
<h1 class="font-headline italic text-4xl md:text-5xl text-on-surface tracking-tight mb-2">WeddVue</h1>
<p class="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant opacity-60">Un momento para siempre</p>
</div>
<!-- Auth Container -->
<div class="w-full max-w-md">
<!-- Editorial Card -->
<div class="bg-surface-container-lowest rounded-xl shadow-[0_12px_40px_rgba(47,51,49,0.04)] p-8 md:p-12 relative overflow-hidden">
<!-- Background Accent (Subtle Asymmetry) -->
<div class="absolute -top-12 -right-12 w-32 h-32 bg-surface-container-low rounded-full opacity-50 pointer-events-none"></div>
<header class="mb-10">
<h2 class="font-headline text-3xl md:text-4xl text-on-surface leading-tight mb-4">Bienvenido a su celebración</h2>
<p class="text-on-surface-variant leading-relaxed opacity-80">Por favor, introduzca sus credenciales para acceder a su espacio privado.</p>
</header>
<form class="space-y-8">
<!-- Email Field -->
<div class="relative group">
<label class="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 group-focus-within:text-primary transition-colors" for="email">Correo Electrónico</label>
<input class="w-full bg-transparent border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-3 text-on-surface placeholder:text-outline-variant transition-all font-body outline-none" id="email" name="email" placeholder="nombre@ejemplo.com" required="" type="email"/>
</div>
<!-- Password Field -->
<div class="relative group">
<label class="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 group-focus-within:text-primary transition-colors" for="password">Contraseña</label>
<input class="w-full bg-transparent border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-3 text-on-surface placeholder:text-outline-variant transition-all font-body outline-none" id="password" name="password" placeholder="••••••••" required="" type="password"/>
</div>
<!-- CTA Section -->
<div class="pt-4 flex flex-col gap-6">
<button class="bg-primary-silk text-on-primary font-label text-xs font-bold uppercase tracking-[0.15rem] py-4 px-8 rounded-md shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-out active:scale-95" type="submit">
                            Entrar
                        </button>
<div class="flex items-center justify-between">
<button class="text-[10px] font-label uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors underline decoration-outline-variant/30 underline-offset-4" type="button">¿Olvidó su contraseña?</button>
</div>
</div>
</form>
<!-- Toggle Action -->
<div class="mt-12 pt-8 border-t border-outline-variant/10 text-center">
<p class="text-xs text-on-surface-variant mb-4">¿Aún no tiene una invitación digital?</p>
<button class="font-label text-xs font-bold uppercase tracking-widest text-primary border border-outline-variant/20 hover:border-primary/40 px-6 py-3 rounded-md transition-all" type="button">
                        Crear mi cuenta
                    </button>
</div>
</div>
<!-- Footer Quote (Emotional Layer) -->
<div class="mt-8 text-center px-4">
<p class="font-headline italic text-lg text-on-surface-variant opacity-40">"El amor es el alma del hogar."</p>
</div>
</div>
<!-- Visual Anchor (Asymmetric Image Placement) -->
<div class="hidden lg:block fixed right-0 bottom-0 w-1/3 h-2/3 -z-10 opacity-20 translate-x-12 translate-y-12">
<img alt="Ceremonia" class="w-full h-full object-cover rounded-tl-[10rem]" data-alt="Close-up of elegant white wedding flowers with soft morning sunlight filtering through silk ribbons in a blurred garden background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBf4J9oBYici2KFCynv0nspUbNmpCQCAOSCbDqbTdwHXbORhsoGxH0HrmDbrl1I2SAAL5XP_mf9YH1LYBGnhkKj3b6m-oJePHW545yNid3_GwfnlmfPHHv8uctWu2URcLQi6CrxMKsqFW4_G-7Bo8NVWbqreewqSMPX4FneQBQS4vojaDDGnleFR7ZJw6y5F7o-xzNYskqVOoK0QJkl5jWEvTJ7YhHyMzsdTwtXGHPk6j2t-ofW7gh5E83rg4F2xspPKZhfHe-9A2Q"/>
</div>
</main>
<!-- Footer Component Mapping -->
<footer class="w-full py-12 flex flex-col md:flex-row justify-between items-center px-12 gap-8 bg-stone-100 dark:bg-stone-950 transition-all duration-500">
<div class="font-serif italic text-lg text-stone-800 dark:text-stone-200">WeddVue</div>
<div class="flex flex-wrap justify-center gap-8">
<a class="font-sans text-xs tracking-widest uppercase text-stone-600 dark:text-stone-400 no-underline hover:text-stone-900 dark:hover:text-stone-100 transition-all duration-500" href="#">Nuestra Historia</a>
<a class="font-sans text-xs tracking-widest uppercase text-stone-600 dark:text-stone-400 no-underline hover:text-stone-900 dark:hover:text-stone-100 transition-all duration-500" href="#">Privacidad</a>
<a class="font-sans text-xs tracking-widest uppercase text-stone-600 dark:text-stone-400 no-underline hover:text-stone-900 dark:hover:text-stone-100 transition-all duration-500" href="#">Contacto</a>
</div>
<div class="font-sans text-xs tracking-widest uppercase text-stone-600 dark:text-stone-400 opacity-60">
            © 2024 WeddVue. Un momento para siempre.
        </div>
</footer>
<!-- BottomNavBar Suppressed for Auth Flow -->
</body></html>