import { Printer } from 'lucide-react';

interface PrintButtonProps {
  onClick: () => void;
}

export default function PrintButton({ onClick }: PrintButtonProps) {
  return (
    <button 
      onClick={onClick} 
      className="no-print bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow flex items-center gap-2 transition-colors duration-300 fixed bottom-8 right-8 z-50"
    >
      <Printer className="h-5 w-5" />
      Print All Payslips
    </button>
  );
}
