import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const ConfirmDialog = ({ open, title, description, onConfirm, onCancel, loading }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-200"
        onClick={onCancel}
        aria-label="Close confirm dialog background"
      />
      {/* Dialog content */}
      <div className="relative z-10">
        <Dialog open={open} onOpenChange={onCancel}>
          <DialogContent className="sm:max-w-[400px] p-6 bg-white text-slate-900 rounded-xl shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-red-600 mb-2">{title}</DialogTitle>
              {description && <DialogDescription className="mb-4 text-gray-700">{description}</DialogDescription>}
            </DialogHeader>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={onCancel} disabled={loading}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={onConfirm} loading={loading}>
                Confirmer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ConfirmDialog; 