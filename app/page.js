"use client";

import { useState, useEffect, useCallback } from "react";
import SvgSprite from "@/components/SvgSprite";
import TopBar from "@/components/TopBar";
import TabBar from "@/components/TabBar";
import HomeScreen from "@/components/HomeScreen";
import JourneyScreen from "@/components/JourneyScreen";
import DreamsScreen from "@/components/DreamsScreen";
import AddEntrySheet from "@/components/AddEntrySheet";
import ConfettiFx from "@/components/ConfettiFx";
import ToastContainer from "@/components/ToastContainer";
import { GOALS, MILESTONES } from "@/lib/constants";
import {
  loadState,
  saveState,
  defaultState,
  totalSaved,
  calculateStreak,
  today,
  fmt,
} from "@/lib/storage";

const FX_SHAPES = [
  ["#d-heart-f", "#C4767E"],
  ["#d-spark", "#E9CE86"],
  ["#d-star", "#A99BD1"],
  ["#d-heart", "#E0A2A8"],
  ["#d-heart-f", "#AA5C65"],
  ["#d-spark", "#EEA97F"],
];

export default function Page() {
  const [activeTab, setActiveTab] = useState("home");
  const [state, setState] = useState(defaultState());
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetGoal, setSheetGoal] = useState("ipad");
  const [isSavedJustNow, setIsSavedJustNow] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [particles, setParticles] = useState([]);

  // Load from localStorage on client mount
  useEffect(() => {
    setState(loadState());
    setIsLoaded(true);
  }, []);

  // Save changes to localStorage
  const updateState = useCallback((updater) => {
    setState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveState(next);
      return next;
    });
  }, []);

  // Toast notification helper
  const showToast = useCallback((html, ms = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-2), { id, html, isOut: false }]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isOut: true } : t))
      );
    }, ms);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, ms + 400);
  }, []);

  // Confetti burst animation helper
  const triggerBurst = useCallback((cx, cy, count = 14) => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const newParticles = Array.from({ length: count }, (_, i) => {
      const [icon, color] = FX_SHAPES[i % FX_SHAPES.length];
      const size = 9 + Math.random() * 8;
      return {
        id: Date.now() + Math.random() + i,
        x: cx + (Math.random() * 76 - 38),
        y: cy + (Math.random() * 16 - 8),
        size,
        color,
        icon,
        delay: i * 45,
        sw1: (Math.random() * 36 - 18).toFixed(1),
        sw2: (Math.random() * 70 - 35).toFixed(1),
        rot: (Math.random() * 50 - 25).toFixed(1),
        rot2: (Math.random() * 90 - 45).toFixed(1),
      };
    });

    setParticles((prev) => [...prev, ...newParticles]);

    setTimeout(() => {
      const idsToRemove = new Set(newParticles.map((p) => p.id));
      setParticles((prev) => prev.filter((p) => !idsToRemove.has(p.id)));
    }, 2500);
  }, []);

  // Open save sheet with optional initial goal
  const handleOpenSheet = useCallback((goalId) => {
    if (goalId) setSheetGoal(goalId);
    setIsSheetOpen(true);
  }, []);

  // Handle entry submission from sheet
  const handleAddEntry = useCallback(
    ({ amount, goal }) => {
      const beforeTotal = totalSaved(state.goals);
      const afterTotal = beforeTotal + amount;
      const targetGoal = GOALS[goal] || GOALS.ipad;

      updateState((prev) => {
        const nextSaved = (prev.goals[goal]?.saved || 0) + amount;
        const newEntry = {
          d: today(),
          a: amount,
          g: goal,
          n: null,
        };
        return {
          ...prev,
          goals: {
            ...prev.goals,
            [goal]: { saved: nextSaved },
          },
          entries: [newEntry, ...prev.entries],
        };
      });

      setIsSheetOpen(false);

      // Celebration effects
      if (typeof window !== "undefined") {
        const x = window.innerWidth / 2;
        const y = window.innerHeight * 0.45;
        triggerBurst(x, y);
      }

      setIsSavedJustNow(true);
      setTimeout(() => setIsSavedJustNow(false), 1800);

      // Check milestones
      const crossed = MILESTONES.find(
        (m) => beforeTotal < m && afterTotal >= m
      );

      const currentStreak = calculateStreak([
        { d: today() },
        ...state.entries,
      ]);

      showToast(
        `<b>${fmt(amount)}</b> masuk ke ${targetGoal.short} · ${currentStreak} hari berturut-turut`
      );

      if (crossed) {
        setTimeout(() => {
          showToast(`Milestone <b>${fmt(crossed)}</b> kebuka ♡`);
        }, 1700);
      }
    },
    [state, updateState, triggerBurst, showToast]
  );

  // Handle diary reset
  const handleReset = useCallback(() => {
    updateState(defaultState());
    showToast("Catatan diulang dari halaman pertama ♡");
  }, [updateState, showToast]);

  return (
    <>
      <SvgSprite />

      <div className={`app ${isSheetOpen ? "is-locked" : ""}`} id="app">
        <div className="grain" aria-hidden="true" />

        <TopBar />

        <main>
          {/* Beranda Screen */}
          <section
            className={`screen ${activeTab === "home" ? "is-active" : ""}`}
            id="screen-home"
            aria-label="Beranda"
            hidden={activeTab !== "home"}
          >
            <HomeScreen
              state={state}
              onOpenSheet={handleOpenSheet}
              onGoto={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              isSavedJustNow={isSavedJustNow}
            />
          </section>

          {/* Catatan / Journey Screen */}
          <section
            className={`screen ${activeTab === "journey" ? "is-active" : ""}`}
            id="screen-journey"
            aria-label="Catatan nabung"
            hidden={activeTab !== "journey"}
          >
            <JourneyScreen
              state={state}
              onOpenSheet={handleOpenSheet}
              onReset={handleReset}
            />
          </section>

          {/* Impian / Dreams Screen */}
          <section
            className={`screen ${activeTab === "dreams" ? "is-active" : ""}`}
            id="screen-dreams"
            aria-label="Impian"
            hidden={activeTab !== "dreams"}
          >
            <DreamsScreen state={state} onOpenSheet={handleOpenSheet} />
          </section>
        </main>

        <TabBar activeTab={activeTab} onSelectTab={setActiveTab} />
      </div>

      <AddEntrySheet
        isOpen={isSheetOpen}
        initialGoal={sheetGoal}
        onClose={() => setIsSheetOpen(false)}
        onSubmit={handleAddEntry}
      />

      <ConfettiFx particles={particles} />
      <ToastContainer toasts={toasts} />
    </>
  );
}
