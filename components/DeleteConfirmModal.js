"use client";

import { useEffect } from "react";
import { IconTrash, IconX } from "@/components/Icons";

export default function DeleteConfirmModal({
  isOpen,
  title = "Konfirmasi Hapus",
  message = "Apakah kamu yakin ingin menghapus data ini?",
  onClose,
  onConfirm,
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card modal-card-sm"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-red-50 text-red-600">
              <IconTrash className="w-5 h-5" />
            </div>
            <h2 className="modal-title">{title}</h2>
          </div>
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            aria-label="Tutup"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        <div className="modal-body py-4">
          <p className="text-sm text-slate-600 leading-relaxed">{message}</p>
          <p className="text-xs text-slate-400 mt-2">
            Perhatian: Tindakan ini akan menghapus data secara permanen.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-secondary btn-sm"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            type="button"
            className="btn-danger btn-sm"
            onClick={onConfirm}
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
