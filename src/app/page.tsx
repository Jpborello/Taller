"use client";

import React from "react";
import { LandingNavbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { TradeTicker, WorkshopStory } from "@/components/landing/WorkshopStory";
import { LiveTelemetry } from "@/components/landing/LiveTelemetry";
import { VehicleTracker } from "@/components/landing/VehicleTracker";
import { SymptomChecker } from "@/components/landing/SymptomChecker";
import { Services } from "@/components/landing/Services";
import { ServiceCalculator } from "@/components/landing/ServiceCalculator";
import { ComparisonSection } from "@/components/landing/ComparisonSection";
import { AppointmentBooking } from "@/components/landing/AppointmentBooking";
import { Testimonials } from "@/components/landing/Testimonials";
import { WorkshopInfo } from "@/components/landing/WorkshopInfo";
import { LandingFooter } from "@/components/landing/Footer";
import { useWorkshop } from "@/context/WorkshopContext";
import { Phone } from "lucide-react";

export default function HomePage() {
  const { settings } = useWorkshop();

  return (
    <div className="landing min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Navigation */}
      <LandingNavbar />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        <TradeTicker />

        {/* Quiénes somos, con fotos del taller */}
        <WorkshopStory />

        {/* Telemetría en Vivo de Bahías del Taller */}
        <LiveTelemetry />

        {/* Feature Estrella: Consulta en Vivo de Reparación por Patente */}
        <VehicleTracker />

        {/* Diagnosticador Interactivo de Síntomas & Fallas */}
        <SymptomChecker />

        {/* Servicios & Especialidades */}
        <Services />

        {/* Cotizador Interactivo de Mano de Obra y Repuestos */}
        <ServiceCalculator />

        {/* Comparativa Taller Tradicional vs ProTech */}
        <ComparisonSection />

        {/* Formulario de Reserva de Turno Online */}
        <AppointmentBooking />

        {/* Testimonios */}
        <Testimonials />

        {/* Ubicación & Horarios */}
        <WorkshopInfo />
      </main>

      {/* Footer */}
      <LandingFooter />

      {/* Floating WhatsApp Action Button */}
      <a
        href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
          "¡Hola! Quería consultar por un presupuesto / service para mi auto."
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-[#25d366] hover:bg-[#1fbd5a] text-white shadow-xl shadow-black/40 transition-all hover:scale-110 active:scale-95 flex items-center justify-center group"
        title="Consultar por WhatsApp"
      >
        <Phone className="w-6 h-6 stroke-[2.2]" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-bold text-xs pl-0 group-hover:pl-2">
          WhatsApp Taller
        </span>
      </a>
    </div>
  );
}
