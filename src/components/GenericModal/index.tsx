import { useEffect } from "react";
import { IoClose } from "react-icons/io5";

export interface GenericModalProps {
  onClose: () => void;
  open: boolean;
}

const GenericModal: React.FC<React.PropsWithChildren<GenericModalProps>> = ({
  onClose,
  open,
  children,
}) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-xl w-96">
        <div className="flex justify-end">
          <button onClick={onClose}>
            <IoClose className="h-6 w-6" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default GenericModal;
