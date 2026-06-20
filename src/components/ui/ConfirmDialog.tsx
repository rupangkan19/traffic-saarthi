import { Modal } from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <p className="text-[14px] text-[var(--text-secondary)] mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-[13px] border border-[var(--border)] rounded-[6px] text-[var(--text-secondary)] hover:bg-[var(--surface-3)]"
        >Cancel</button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 text-[13px] bg-[var(--red)] text-white rounded-[6px] hover:opacity-90"
        >Confirm</button>
      </div>
    </Modal>
  );
}
