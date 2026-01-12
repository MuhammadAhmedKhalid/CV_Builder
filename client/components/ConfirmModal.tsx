"use client";

import { CSSProperties } from "react";
import * as Colors from "@/lib/colors";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>{title}</h2>

        {description && (
          <p style={styles.description}>{description}</p>
        )}

        <div style={styles.actions}>
          <button style={styles.cancelBtn} onClick={onCancel}>
            {cancelText}
          </button>

          <button style={styles.confirmBtn} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles: Record<string, CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: Colors.OVERLAY,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px", 
    zIndex: 1000,
  },

  modal: {
    backgroundColor: Colors.WHITE,
    width: "100%",
    maxWidth: "420px",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: `0 20px 40px ${Colors.MODAL_SHADOW}`,
  },

  title: {
    fontSize: "20px",
    fontWeight: 700,
    color: Colors.PRIMARY_DARK,
    marginBottom: "8px",
  },

  description: {
    fontSize: "14px",
    color: Colors.PRIMARY,
    lineHeight: 1.5,
    marginBottom: "24px",
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    flexWrap: "wrap",
  },

  cancelBtn: {
    padding: "8px 14px",
    borderRadius: "8px",
    border: `1px solid ${Colors.BORDER_PRIMARY}`,
    backgroundColor: Colors.WHITE,
    color: Colors.PRIMARY_DARK,
    cursor: "pointer",
    fontWeight: 500,
    minWidth: "96px",
  },

  confirmBtn: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: Colors.PRIMARY,
    color: Colors.WHITE,
    cursor: "pointer",
    fontWeight: 600,
    minWidth: "96px",
  },
};