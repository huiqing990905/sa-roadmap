"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Dashboard from "@/components/Dashboard";
import PhaseSection from "@/components/PhaseSection";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import ReadOnlyBanner from "@/components/ReadOnlyBanner";
import BackToTop from "@/components/BackToTop";
import { getRoadmapByTrack, type TrackId } from "@/data/siteData";
import { useChecklist } from "@/hooks/useChecklist";

export default function Home() {
  const [mode, setMode] = useState<TrackId>("sa");
  const activeRoadmap = getRoadmapByTrack(mode);
  const {
    completed,
    completedSet,
    toggle,
    updateProof,
    hydrated,
    saving,
    isOwner,
    user,
    signIn,
    signOut,
  } = useChecklist(mode);
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <Navbar
        isOwner={isOwner}
        user={user}
        saving={saving}
        mode={mode}
        phases={activeRoadmap}
        onLoginClick={() => setAuthOpen(true)}
        onSignOut={signOut}
        onModeChange={setMode}
      />
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSignIn={signIn}
      />
      <main>
        <Hero trackId={mode} />
        {hydrated ? (
          <>
            {!isOwner && <ReadOnlyBanner />}
            <Dashboard
              trackId={mode}
              roadmap={activeRoadmap}
              completedSet={completedSet}
              completedMap={completed}
            />
            {activeRoadmap.map((phase, i) => (
              <PhaseSection
                key={phase.id}
                phase={phase}
                completedMap={completed}
                completedSet={completedSet}
                onToggle={toggle}
                onUpdateProof={updateProof}
                isOwner={isOwner}
                defaultOpen={i === 0}
                even={i % 2 === 1}
              />
            ))}
          </>
        ) : (
          <div className="flex items-center justify-center py-32">
            <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
