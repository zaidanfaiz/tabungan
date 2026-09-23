"use client";

import { useState, useEffect, useRef } from "react";
import { GOALS } from "@/lib/constants";
import { fmt, digits } from "@/lib/storage";

const QUICK_AMOUNTS = [10_000, 35_000, 50_000, 100_000];

export default function AddEntrySheet({
  isOpen,
  initialGoal = "ipad",
  onClose,
  onSubmit,
}) {
  const [amount, setAmount] = useState(35_000);
  const [goal, setGoal] = useState(initialGoal);
  const [hasError, setHasError] = useState(false);
  const inputRef = useRef(null);
  const sheetRef = useRef(null);

  useEffect(() => {
    if (initialGoal) {
      setGoal(initialGoal);
    }
  }, [initialGoal]);

  useEffect(() => {
    if (isOpen) {
      setHasError(false);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAmountChange = (e) => {
    const raw = digits(e.target.value).slice(0, 12);
    const val = raw ? Number(raw) : 0;
    setAmount(val);
    if (val > 0) setHasError(false);
  };

  const handleSelectQuick = (amt) => {
    setAmount(amt);
    setHasError(false);
    inputRef.current?.focus();
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!amount || amount < 1) {
      setHasError(true);
      inputRef.current?.focus();
      return;
    }
    onSubmit({ amount, goal });
  };

  return (
    <>
      <div className="backdrop" onClick={onClose} />
      <div
        ref={sheetRef}
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheetTitle"
        tabIndex={-1}
      >
        <div className="sheet-handle" aria-hidden="true" />
        <div className="sheet-head">
          <h2 id="sheetTitle">
            Nabung untuk {GOALS[goal]?.short || "Impian"}{" "}
            <svg aria-hidden="true">
              <use href="#d-heart" />
            </svg>
          </h2>
          <button
            className="icon-btn"
            type="button"
            aria-label="Tutup"
            onClick={onClose}
          >
            <svg aria-hidden="true">
              <use href="#d-x" />
            </svg>
          </button>
        </div>

        <div className="sheet-amount">
          <span className="sheet-rp">Rp</span>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={amount ? amount.toLocaleString("id-ID") : ""}
            onChange={handleAmountChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            aria-label="Nominal nabung dalam rupiah"
          />
        </div>

        {hasError && (
          <p className="field-err" role="alert">
            nominalnya belum diisi, ya
          </p>
        )}

        <div className="chips" role="group" aria-label="Nominal cepat">
          {QUICK_AMOUNTS.map((amt) => (
            <button
              key={amt}
              type="button"
              className={`chip ${amount === amt ? "is-on" : ""}`}
              onClick={() => handleSelectQuick(amt)}
            >
              Rp{amt.toLocaleString("id-ID")}
            </button>
          ))}
        </div>

        <p className="sheet-label">masuk ke impian</p>
        <div className="chips chips--goal" role="group" aria-label="Pilih impian">
          <button
            type="button"
            className={`chip chip--goal chip--peach ${goal === "ipad" ? "is-on" : ""}`}
            onClick={() => setGoal("ipad")}
          >
            iPad
          </button>
          <button
            type="button"
            className={`chip chip--goal chip--lav ${goal === "iphone" ? "is-on" : ""}`}
            onClick={() => setGoal("iphone")}
          >
            iPhone 11 Pro Max
          </button>
        </div>

        <button
          className="btn-save btn-save--wide"
          type="button"
          onClick={handleSubmit}
        >
          <span className="btn-save-label">
            Catat nabungnya{" "}
            <svg aria-hidden="true">
              <use href="#d-heart" />
            </svg>
          </span>
        </button>
      </div>
    </>
  );
}
