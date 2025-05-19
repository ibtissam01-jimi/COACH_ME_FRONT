import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  children 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
        aria-label="Close modal background"
      />
      {/* Modal content */}
      <div className="relative z-10 bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 p-8 animate-fade-in">
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto p-6 bg-white rounded-2xl shadow-2xl modal-scroll">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-blue-700 mb-2 sticky top-0 bg-white z-10">{title}</DialogTitle>
              {description && (
                <DialogDescription className="mb-4 text-gray-500">{description}</DialogDescription>
              )}
            </DialogHeader>
            {children}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Modal; 