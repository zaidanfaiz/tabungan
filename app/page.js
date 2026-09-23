"use client";

import { useState, useEffect, useCallback } from "react";
import TopBar from "@/components/TopBar";
import TabBar from "@/components/TabBar";
import HomeScreen from "@/components/HomeScreen";
import GoalsScreen from "@/components/GoalsScreen";
import HistoryScreen from "@/components/HistoryScreen";
import GoalModal from "@/components/GoalModal";
import EntryModal from "@/components/EntryModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import ToastContainer from "@/components/ToastContainer";
import { loadState, saveState, defaultState, fmt } from "@/lib/storage";

export default function Page() {
  const [activeTab, setActiveTab] = useState("overview");
  const [state, setState] = useState(defaultState());
  const [isLoaded, setIsLoaded] = useState(false);

  // Modals state
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [depositGoalId, setDepositGoalId] = useState("");

  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    type: null, // "goal" or "entry"
    item: null,
    title: "",
    message: "",
  });

  const [toasts, setToasts] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    setState(loadState());
    setIsLoaded(true);
  }, []);

  // Toast notification helper
  const showToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-2), { id, html: message, isOut: false }]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isOut: true } : t))
      );
    }, 2800);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  // Update & persist state
  const persistState = useCallback((updater) => {
    setState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveState(next);
      return next;
    });
  }, []);

  // ── GOAL CRUD HANDLERS ──────────────────────────────────────

  const handleOpenNewGoal = () => {
    setEditingGoal(null);
    setIsGoalModalOpen(true);
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setIsGoalModalOpen(true);
  };

  const handleSaveGoal = (goalData) => {
    persistState((prev) => {
      const exists = prev.goals.some((g) => g.id === goalData.id);
      let updatedGoals;
      if (exists) {
        // Update existing goal preserving its saved amount
        updatedGoals = prev.goals.map((g) =>
          g.id === goalData.id
            ? { ...g, ...goalData, saved: g.saved }
            : g
        );
      } else {
        // Add new goal
        updatedGoals = [goalData, ...prev.goals];
      }
      return { ...prev, goals: updatedGoals };
    });

    setIsGoalModalOpen(false);
    showToast(
      editingGoal
        ? `Target <strong>${goalData.name}</strong> berhasil diperbarui.`
        : `Target <strong>${goalData.name}</strong> berhasil ditambahkan!`
    );
  };

  const handleRequestDeleteGoal = (goal) => {
    setDeleteModalState({
      isOpen: true,
      type: "goal",
      item: goal,
      title: "Hapus Target Impian?",
      message: `Target "${goal.name}" beserta riwayat tabungannya akan dihapus secara permanen.`,
    });
  };

  const handleConfirmDelete = () => {
    const { type, item } = deleteModalState;
    if (!item) return;

    if (type === "goal") {
      persistState((prev) => ({
        ...prev,
        goals: prev.goals.filter((g) => g.id !== item.id),
        entries: prev.entries.filter((e) => e.g !== item.id),
      }));
      showToast(`Target <strong>${item.name}</strong> telah dihapus.`);
    } else if (type === "entry") {
      persistState((prev) => {
        const nextEntries = prev.entries.filter((e) => e.id !== item.id);
        const nextGoals = prev.goals.map((g) => {
          if (g.id === item.g) {
            return { ...g, saved: Math.max(0, (Number(g.saved) || 0) - Number(item.a)) };
          }
          return g;
        });
        return { ...prev, goals: nextGoals, entries: nextEntries };
      });
      showToast(`Catatan tabungan <strong>${fmt(item.a)}</strong> telah dihapus.`);
    }

    setDeleteModalState({ isOpen: false, type: null, item: null, title: "", message: "" });
  };

  // ── TRANSACTION / ENTRY CRUD HANDLERS ───────────────────────

  const handleOpenDeposit = (goalId = "") => {
    setEditingEntry(null);
    setDepositGoalId(goalId || (state.goals[0]?.id || ""));
    setIsDepositModalOpen(true);
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setDepositGoalId(entry.g);
    setIsDepositModalOpen(true);
  };

  const handleSaveEntry = (entryData) => {
    persistState((prev) => {
      let nextEntries;
      let nextGoals;

      if (editingEntry) {
        // Recalculate difference if amount or goal changed
        const oldAmount = Number(editingEntry.a) || 0;
        const newAmount = Number(entryData.a) || 0;
        const oldGoalId = editingEntry.g;
        const newGoalId = entryData.g;

        nextEntries = prev.entries.map((e) =>
          e.id === entryData.id ? entryData : e
        );

        nextGoals = prev.goals.map((g) => {
          if (oldGoalId === newGoalId && g.id === newGoalId) {
            return { ...g, saved: Math.max(0, (Number(g.saved) || 0) - oldAmount + newAmount) };
          }
          if (g.id === oldGoalId) {
            return { ...g, saved: Math.max(0, (Number(g.saved) || 0) - oldAmount) };
          }
          if (g.id === newGoalId) {
            return { ...g, saved: (Number(g.saved) || 0) + newAmount };
          }
          return g;
        });
      } else {
        // New deposit entry
        nextEntries = [entryData, ...prev.entries];
        nextGoals = prev.goals.map((g) => {
          if (g.id === entryData.g) {
            return { ...g, saved: (Number(g.saved) || 0) + Number(entryData.a) };
          }
          return g;
        });
      }

      return { ...prev, goals: nextGoals, entries: nextEntries };
    });

    setIsDepositModalOpen(false);
    showToast(
      editingEntry
        ? `Transaksi <strong>${fmt(entryData.a)}</strong> berhasil diperbarui.`
        : `Tabungan sebesar <strong>${fmt(entryData.a)}</strong> berhasil dicatat!`
    );
  };

  const handleRequestDeleteEntry = (entry) => {
    setDeleteModalState({
      isOpen: true,
      type: "entry",
      item: entry,
      title: "Hapus Catatan Tabungan?",
      message: `Setoran sebesar ${fmt(entry.a)} pada tanggal ${entry.d} akan dihapus dari saldo target.`,
    });
  };

  return (
    <div className="app-shell">
      <TopBar
        onOpenDeposit={() => handleOpenDeposit()}
        onOpenNewGoal={handleOpenNewGoal}
      />

      <TabBar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        goalCount={state.goals.length}
        entryCount={state.entries.length}
      />

      <main className="main-content">
        {activeTab === "overview" && (
          <HomeScreen
            goals={state.goals}
            entries={state.entries}
            onOpenDeposit={handleOpenDeposit}
            onOpenNewGoal={handleOpenNewGoal}
            onEditGoal={handleEditGoal}
            onDeleteGoal={handleRequestDeleteGoal}
            onEditEntry={handleEditEntry}
            onDeleteEntry={handleRequestDeleteEntry}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === "goals" && (
          <GoalsScreen
            goals={state.goals}
            onOpenDeposit={handleOpenDeposit}
            onOpenNewGoal={handleOpenNewGoal}
            onEditGoal={handleEditGoal}
            onDeleteGoal={handleRequestDeleteGoal}
          />
        )}

        {activeTab === "history" && (
          <HistoryScreen
            entries={state.entries}
            goals={state.goals}
            onOpenDeposit={handleOpenDeposit}
            onEditEntry={handleEditEntry}
            onDeleteEntry={handleRequestDeleteEntry}
          />
        )}
      </main>

      {/* CRUD Modals */}
      <GoalModal
        isOpen={isGoalModalOpen}
        initialGoal={editingGoal}
        onClose={() => setIsGoalModalOpen(false)}
        onSave={handleSaveGoal}
      />

      <EntryModal
        isOpen={isDepositModalOpen}
        initialEntry={editingEntry}
        defaultGoalId={depositGoalId}
        goals={state.goals}
        onClose={() => setIsDepositModalOpen(false)}
        onSave={handleSaveEntry}
      />

      <DeleteConfirmModal
        isOpen={deleteModalState.isOpen}
        title={deleteModalState.title}
        message={deleteModalState.message}
        onClose={() => setDeleteModalState({ ...deleteModalState, isOpen: false })}
        onConfirm={handleConfirmDelete}
      />

      <ToastContainer toasts={toasts} />
    </div>
  );
}
