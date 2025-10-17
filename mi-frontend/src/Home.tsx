import React from "react";

const products = [
  {
    id: 1,
    brand: "Casio",
    name: "Calculadora Científica FX‑350MS",
    price: 16490,
    image: "https://dummyimage.com/600x600/ededed/2a2a2a&text=Calculadora+Casio",
    badge: "Nuevo",
  },
  {
    id: 2,
    brand: "Casio",
    name: "FX‑991EX ClassWiz",
    price: 35990,
    image: "https://dummyimage.com/600x600/ededed/2a2a2a&text=FX-991EX",
    badge: "Más vendido",
  },
  {
    id: 3,
    brand: "Faber‑Castell",
    name: "Cuaderno Univ. 100 hojas Raya",
    price: 1590,
    image: "https://dummyimage.com/600x600/ededed/2a2a2a&text=Cuaderno+100h",
    badge: "Oferta",
  },
  {
    id: 4,
    brand: "Stabilo",
    name: "Resaltador x4 Colores",
    price: 5990,
    image: "https://dummyimage.com/600x600/ededed/2a2a2a&text=Resaltadores",
  },
  {
    id: 5,
    brand: "Lenovo",
    name: "Tablet 10\" 64GB Wi‑Fi",
    price: 179990,
    image: "https://dummyimage.com/600x600/ededed/2a2a2a&text=Tablet+10%5C%22",
  },
  {
    id: 6,
    brand: "Mochi+",
    name: "Mochila Escolar Reforzada",
    price: 24990,
    image: "https://dummyimage.com/600x600/ededed/2a2a2a&text=Mochila",
  },
];

const categories = [
  { id: "calc", label: "Calculadoras" },
  { id: "cuad", label: "Cuadernos" },
  { id: "escritura", label: "Escritura" },
  { id: "mochilas", label: "Mochilas" },
  { id: "tablets", label: "Tablets" },
  { id: "kits", label: "Kits" },
];

function Currency({ value }) {
  return <span>${value.toLocaleString("es-CL")}</span>;
}

const IconMenu = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="stroke-current"><path d="M3 6h18M3 12h18M3 18h18" strokeWidth="2" strokeLinecap="round"/></svg>
);
const IconSearch = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="stroke-current"><path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round"/><circle cx="11" cy="11" r="7" strokeWidth="2"/></svg>
);
const IconCart = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="stroke-current"><path d="M6 6h15l-1.5 8.5a2 2 0 0 1-2 1.5H9.5a2 2 0 0 1-2-1.5L6 3H3" strokeWidth="2" strokeLinecap="round"/><circle cx="9" cy="21" r="1.5"/><circle cx="18" cy="21" r="1.5"/></svg>
);
const IconUser = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="stroke-current"><circle cx="12" cy="8" r="4" strokeWidth="2"/><path d="M4 20c1.8-3.3 5-5 8-5s6.2 1.7 8 5" strokeWidth="2"/></svg>
);

function ProductCard({ p }) {
  return (
    <div className="group rounded-2xl bg-white shadow-sm ring-1 ring-black/5 hover:shadow-md transition overflow-hidden">
      <div className="relative aspect-square w-full bg-gray-50">
        {p.badge && (
          <span className="absolute left-2 top-2 z-10 rounded-full bg-black/80 px-3 py-1 text-xs text-white">{p.badge}</span>
        )}
        <img src={p.image} alt={p.name} className="h-full w-full object-contain"/>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-500">{p.brand}</p>
        <h3 className="mt-1 line-clamp-2 font-semibold leading-tight">{p.name}</h3>
        <div className="mt-2 text-lg font-bold"><Currency value={p.price} /></div>
        <div className="mt-3 flex gap-2">
          <button className="w-full rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90">Agregar</button>
          <button className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50">Ver</button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <button className="lg:hidden rounded-xl border p-2"><IconMenu/></button>
          <a className="text-2xl font-extrabold tracking-tight">NombreTienda</a>
          <div className="relative hidden flex-1 items-center lg:flex">
            <input placeholder="Busca cuadernos, calculadoras, tablets…" className="w-full rounded-2xl border px-4 py-2 pr-10 outline-none focus:ring-2 focus:ring-black"/>
            <span className="pointer-events-none absolute right-3"><IconSearch/></span>
          </div>
          <nav className="ml-auto flex items-center gap-3">
            <button className="rounded-xl border p-2"><IconSearch/></button>
            <button className="rounded-xl border p-2"><IconCart/></button>
            <button className="rounded-xl border p-2"><IconUser/></button>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-4 pt-8">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative col-span-2 overflow-hidden rounded-3xl bg-gradient-to-br from-amber-200 via-rose-200 to-sky-200 p-8">
            <h1 className="text-3xl font-extrabold leading-tight md:text-4xl">Regreso a clases sin estrés</h1>
            <p className="mt-2 max-w-prose text-sm md:text-base">Arma tu pack con cuadernos, destacadores, calculadoras y tablets al mejor precio.</p>
            <div className="mt-5 flex gap-3">
              <button className="rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-black/90">Ver kits</button>
              <button className="rounded-xl border px-5 py-2.5 text-sm hover:bg-white/40">Explorar catálogo</button>
            </div>
            <img alt="banner" src="https://dummyimage.com/800x400/ffffff/1a1a1a&text=Tu+banner+aqui" className="pointer-events-none absolute -right-4 bottom-0 hidden h-[140%] object-contain md:block"/>
          </div>
          <div className="grid gap-4">
            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Envío rápido</p>
              <p className="mt-1 text-lg font-semibold">A todo Chile</p>
            </div>
            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Hasta 6 cuotas</p>
              <p className="mt-1 text-lg font-semibold">WebPay / MercadoPago</p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-wrap gap-2">
          {categories.map(c => (
            <button key={c.id} className="rounded-full border bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-50">{c.label}</button>
          ))}
        </div>
      </section>

      {/* DESTACADOS */}
      <Section title="Destacados" subtitle="Lo que todos están comprando ahora">
        <ProductGrid items={products.slice(0, 6)} />
      </Section>

      {/* OFERTAS */}
      <Section title="Ofertas" subtitle="Aprovecha precios por temporada">
        <ProductGrid items={[...products].reverse()} />
      </Section>

      {/* NEWSLETTER / CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-12">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8">
          <div className="grid items-center gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-2xl font-bold">Recibe ofertas para estudiantes</h3>
              <p className="mt-1 text-sm text-gray-600">Cuadernos, kits y tecnología con descuentos exclusivos.</p>
            </div>
            <form className="flex gap-2">
              <input type="email" placeholder="tu@email.cl" className="w-full flex-1 rounded-xl border px-4 py-2 outline-none focus:ring-2 focus:ring-black"/>
              <button className="rounded-xl bg-black px-5 py-2 text-sm font-semibold text-white hover:bg-black/90">Suscribirme</button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-gray-600">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <p>© {new Date().getFullYear()} NombreTienda. Todos los derechos reservados.</p>
            <div className="flex gap-5">
              <a className="hover:underline">Cambios y devoluciones</a>
              <a className="hover:underline">Envíos</a>
              <a className="hover:underline">Contacto</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-10">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-extrabold md:text-2xl">{title}</h2>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
        <button className="hidden rounded-xl border px-4 py-2 text-sm hover:bg-gray-50 md:block">Ver todo</button>
      </div>
      {children}
    </section>
  );
}

function ProductGrid({ items }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((p) => (
        <ProductCard key={p.id} p={p} />
      ))}
    </div>
  );
}
