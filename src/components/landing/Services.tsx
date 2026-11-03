"use client";

import React from "react";
import Image from "next/image";
import {
  Wrench,
  Gauge,
  Activity,
  Cpu,
  Fan,
  BatteryCharging,
  Disc,
  Settings2,
  CheckCircle,
} from "lucide-react";

export function Services() {
  const services = [
    {
      icon: Cpu,
      image: "/img/diagnostico.jpg",
      title: "Diagnóstico Computarizado & Scanner",
      description:
        "Detección precisa de fallas con scanner oficial multimarca. Lectura y borrado de códigos de Check Engine, ABS y Airbag.",
      tags: ["Bosch KTS", "Launch X431", "Inyección Directa"],
    },
    {
      icon: Disc,
      image: "/img/frenos.jpg",
      title: "Frenos, ABS & Control de Tracción",
      description:
        "Rectificación y recambio de discos, pastillas cerámicas, cintas de freno, bombas y purgado con líquido DOT 4 presurizado.",
      tags: ["Brembo", "Fras-le", "Líquido Ferodo"],
    },
    {
      icon: Activity,
      image: "/img/distribucion.jpg",
      title: "Distribución & Correas Poli-V",
      description:
        "Reemplazo integral de kits de distribución con bomba de agua, tensores automáticos y correas de accesorios bajo torque oficial.",
      tags: ["Gates", "Continental", "Garantía Escrita"],
    },
    {
      icon: Gauge,
      image: "/img/service-aceite.jpg",
      title: "Service Oficial de Fluidos & Filtros",
      description:
        "Cambio de aceite 100% sintético homologado, filtros de aire, aceite, combustible y habitáculo. Chequeo de 25 puntos de seguridad.",
      tags: ["Motul 8100", "Castrol Edge", "Mann Filter"],
    },
    {
      icon: Settings2,
      image: "/img/suspension.jpg",
      title: "Tren Delantero & Suspensión",
      description:
        "Amortiguadores, cazoletas, extremos de dirección, bieletas y bujes de parrilla. Alineación láser y balanceo computarizado.",
      tags: ["Fric-Rot", "Monroe", "Corven Plus"],
    },
    {
      icon: Fan,
      image: "/img/herramientas.jpg",
      title: "Aire Acondicionado & Calefacción",
      description:
        "Carga ecológica de gas R134a y R1234yf con prueba de estanqueidad por nitrógeno, detección de fugas UV y limpieza de ductos.",
      tags: ["Carga Automática", "Detección UV", "Filtro Antipolen"],
    },
    {
      icon: BatteryCharging,
      image: "/img/electricidad.jpg",
      title: "Encendido & Electricidad Automotor",
      description:
        "Diagnóstico de alternadores, burros de arranque, instalación y prueba computarizada de batería con analizador de conductancia.",
      tags: ["Baterías Moura", "Bujías Iridium", "Bobinas"],
    },
    {
      icon: Wrench,
      image: "/img/mecanica-pesada.jpg",
      title: "Mecánica Pesada & Motores",
      description:
        "Reparación integral de tapas de cilindro, ajuste de motores nafteros y diesel common rail, embragues y cajas de velocidad.",
      tags: ["Tapas de Cilindro", "Embragues Luk/Valeo", "Turbo"],
    },
  ];

  return (
    <section id="servicios" className="py-20 sm:py-28 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-amber-400">
              Qué hacemos
            </span>
            <h2 className="mt-4 text-5xl sm:text-6xl font-black text-white">
              Ocho especialidades, <span className="text-amber-500">un solo portón.</span>
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-sm">
            Desde un cambio de aceite hasta rectificar una tapa de cilindros. Trabajamos con repuestos
            de primera marca y te damos garantía escrita en todo.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-800 border border-slate-800">
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <article key={idx} className="bg-slate-950 flex flex-col group">
                <div className="relative h-44 overflow-hidden grain">
                  <Image
                    src={srv.image}
                    alt={srv.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover grayscale-[60%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <span className="absolute top-3 left-4 font-display font-black text-5xl text-white/90 leading-none drop-shadow">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="absolute bottom-3 right-3 w-9 h-9 rounded-sm bg-amber-500 text-slate-950 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </span>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-xl font-bold uppercase text-white leading-tight mb-2 group-hover:text-amber-400 transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4 flex-1">{srv.description}</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {srv.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-[10px] font-mono uppercase text-slate-500">
                        /{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
