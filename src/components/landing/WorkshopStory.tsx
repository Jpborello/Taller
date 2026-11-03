import React from "react";
import Image from "next/image";

const TICKER = [
  "Inyección electrónica",
  "Frenos & ABS",
  "Distribución",
  "Tren delantero",
  "Aire acondicionado",
  "Embrague",
  "Service oficial",
  "Scanner multimarca",
  "Diesel common rail",
];

/** Hazard-tape band with a scrolling list of trades. */
export function TradeTicker() {
  const items = [...TICKER, ...TICKER];
  return (
    <div className="relative bg-amber-500 text-slate-950 border-y-4 border-slate-950 overflow-hidden">
      <div className="flex w-max animate-marquee py-3">
        {items.map((t, i) => (
          <span
            key={i}
            className="font-display font-extrabold uppercase text-xl sm:text-2xl tracking-wide px-6 flex items-center gap-6"
          >
            {t}
            <span className="w-2.5 h-2.5 rotate-45 bg-slate-950 inline-block" />
          </span>
        ))}
      </div>
    </div>
  );
}

/** "Who we are" — editorial block with real workshop photos. */
export function WorkshopStory() {
  const values = [
    {
      n: "01",
      title: "Te mostramos la pieza",
      text: "Lo que sacamos de tu auto te lo devolvemos en una caja. Si algo se cambió, lo ves.",
    },
    {
      n: "02",
      title: "Presupuesto por WhatsApp",
      text: "Foto del problema, precio cerrado y recién ahí metemos mano. Sin sorpresas al retirar.",
    },
    {
      n: "03",
      title: "El mismo mecánico",
      text: "Tu auto lo agarra una persona de principio a fin. Sabés con quién hablar.",
    },
  ];

  return (
    <section className="bg-[var(--paper)] text-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Copy */}
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-amber-600">
            El taller
          </span>
          <h2 className="mt-4 text-5xl sm:text-6xl font-black text-slate-950">
            Grasa en las manos, <span className="text-amber-600">papeles en orden.</span>
          </h2>
          <p className="mt-6 text-base text-slate-700 leading-relaxed">
            Arrancó el abuelo Osvaldo con una fosa y una caja de herramientas Bahco. Hoy somos once,
            tenemos scanner oficial y un sistema donde queda registrada cada tuerca que tocamos. Lo
            que no cambió es la forma de laburar: explicar bien y cobrar lo justo.
          </p>

          <ol className="mt-10 space-y-6">
            {values.map((v) => (
              <li key={v.n} className="flex gap-5 border-t-2 border-slate-950 pt-4">
                <span className="font-display font-black text-3xl text-amber-600 leading-none w-10 shrink-0">
                  {v.n}
                </span>
                <div>
                  <h3 className="text-xl font-bold uppercase text-slate-950">{v.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{v.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Photo collage */}
        <div className="lg:col-span-7 grid grid-cols-6 grid-rows-[repeat(6,minmax(0,1fr))] gap-3 h-[520px] sm:h-[680px]">
          <figure className="relative col-span-6 row-span-3 overflow-hidden rounded-sm grain">
            <Image
              src="/img/taller-elevadores.jpg"
              alt="Autos en los elevadores del taller"
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
            />
            <figcaption className="absolute left-3 bottom-3 bg-slate-950 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-1">
              Nave principal · 800 m²
            </figcaption>
          </figure>
          <figure className="relative col-span-3 row-span-3 overflow-hidden rounded-sm grain">
            <Image
              src="/img/manos-llave.jpg"
              alt="Manos con grasa ajustando una pieza con llave"
              fill
              sizes="(min-width: 1024px) 28vw, 50vw"
              className="object-cover"
            />
          </figure>
          <figure className="relative col-span-3 row-span-2 overflow-hidden rounded-sm grain">
            <Image
              src="/img/mecanico-motor.jpg"
              alt="Mecánico trabajando en un motor"
              fill
              sizes="(min-width: 1024px) 28vw, 50vw"
              className="object-cover"
            />
          </figure>
          <div className="col-span-3 row-span-1 hazard rounded-sm flex items-center justify-center">
            <span className="bg-slate-950 text-amber-500 font-display font-extrabold uppercase tracking-wider px-3 py-1 text-sm sm:text-base">
              Desde 1998
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
