"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import css from "./Modal.module.css";

const modalRootId = "modal-root";

function ensureModalRoot() {
  let el = document.getElementById(modalRootId);
  if (!el) {
    el = document.createElement("div");
    el.id = modalRootId;
    document.body.appendChild(el);
  }
  return el;
}

export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleClose = () => router.back();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const root = ensureModalRoot();

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onMouseDown={handleClose}
    >
      <div className={css.modal} onMouseDown={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    root
  );
}
