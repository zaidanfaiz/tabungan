"use client";

import { useState, useEffect, useRef } from "react";
import { CATEGORIES } from "@/lib/constants";
import { digits, compressImage } from "@/lib/storage";
import { IconX, IconCamera, IconTrash } from "@/components/Icons";

export default function GoalModal({
  isOpen,
  initialGoal = null,
  onClose,
  onSave,
}) {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [category, setCategory] = useState("gadget");
  const [deadline, setDeadline] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [isProcessingImg, setIsProcessingImg] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialGoal) {
      setName(initialGoal.name || "");
      setTarget(initialGoal.target ? Number(initialGoal.target).toLocaleString("id-ID") : "");
      setCategory(initialGoal.category || "gadget");
      setDeadline(initialGoal.deadline || "");
      setImage(initialGoal.image || null);
    } else {
      setName("");
      setTarget("");
      setCategory("gadget");
      setDeadline("");
      setImage(null);
    }
    setError("");
  }, [initialGoal, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleTargetChange = (e) => {
    const raw = digits(e.target.value).slice(0, 14);
    const val = raw ? Number(raw) : 0;
    setTarget(val ? val.toLocaleString("id-ID") : "");
    if (error) setError("");
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsProcessingImg(true);
      const dataUrl = await compressImage(file, 400, 0.8);
      setImage(dataUrl);
      setError("");
    } catch (err) {
      setError("Gagal memproses gambar. Gunakan format JPG atau PNG.");
    } finally {
      setIsProcessingImg(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nama impian wajib diisi.");
      return;
    }
    const numTarget = Number(digits(target));
    if (!numTarget || numTarget < 1000) {
      setError("Target nominal minimal Rp1.000.");
      return;
    }

    onSave({
      id: initialGoal ? initialGoal.id : `goal-${Date.now()}`,
      name: name.trim(),
      target: numTarget,
      saved: initialGoal ? (Number(initialGoal.saved) || 0) : 0,
      category,
      deadline: deadline || null,
      image,
      createdAt: initialGoal ? initialGoal.createdAt : new Date().toISOString(),
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="goal-modal-title"
      >
        <div className="modal-header">
          <div>
            <h2 id="goal-modal-title" className="modal-title">
              {initialGoal ? "Edit Target Impian" : "Tambah Target Impian Baru"}
            </h2>
            <p className="modal-subtitle">
              Tentukan target tabungan dan lengkapi dengan foto impianmu.
            </p>
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

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="alert-error" role="alert">{error}</div>}

          {/* Photo Upload Section */}
          <div className="form-group">
            <label className="form-label">Foto Impian (Opsional)</label>
            <div className="photo-upload-zone">
              {image ? (
                <div className="photo-preview-wrap">
                  <img
                    src={image}
                    alt="Preview Impian"
                    className="photo-preview"
                  />
                  <div className="photo-preview-actions">
                    <button
                      type="button"
                      className="btn-secondary btn-sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <IconCamera className="w-4 h-4 mr-1 inline" /> Ganti
                    </button>
                    <button
                      type="button"
                      className="btn-danger btn-sm"
                      onClick={() => setImage(null)}
                    >
                      <IconTrash className="w-4 h-4 mr-1 inline" /> Hapus
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="photo-placeholder-btn"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessingImg}
                >
                  <IconCamera className="w-6 h-6 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">
                    {isProcessingImg ? "Memproses gambar..." : "Unggah Foto Impian"}
                  </span>
                  <span className="text-xs text-slate-400">
                    JPG, PNG maksimal 5MB (otomatis dioptimalkan)
                  </span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          {/* Name */}
          <div className="form-group">
            <label htmlFor="goal-name" className="form-label">
              Nama Impian <span className="text-red-500">*</span>
            </label>
            <input
              id="goal-name"
              type="text"
              className="input-text"
              placeholder="Contoh: MacBook Pro M3, Beli Motor, Umroh"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              autoFocus
            />
          </div>

          {/* Target Amount */}
          <div className="form-group">
            <label htmlFor="goal-target" className="form-label">
              Target Nominal (Rp) <span className="text-red-500">*</span>
            </label>
            <div className="input-currency-wrap">
              <span className="input-prefix">Rp</span>
              <input
                id="goal-target"
                type="text"
                inputMode="numeric"
                className="input-currency"
                placeholder="10.000.000"
                value={target}
                onChange={handleTargetChange}
              />
            </div>
          </div>

          {/* Category & Deadline in 2 Columns */}
          <div className="grid-2-col">
            <div className="form-group">
              <label htmlFor="goal-cat" className="form-label">
                Kategori
              </label>
              <select
                id="goal-cat"
                className="input-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="goal-deadline" className="form-label">
                Target Selesai (Opsional)
              </label>
              <input
                id="goal-deadline"
                type="date"
                className="input-text"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Batal
            </button>
            <button type="submit" className="btn-primary">
              {initialGoal ? "Simpan Perubahan" : "Tambah Impian"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
