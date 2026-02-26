import { Download, Loader2 } from 'lucide-react';

interface PrintButtonProps {
  onClick: () => void;
  isExporting?: boolean;
}

export default function PrintButton({ onClick, isExporting }: PrintButtonProps) {
  return (
    <button 
      onClick={onClick} 
      disabled={isExporting}
      className="no-print bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg shadow flex items-center gap-2 transition-colors duration-300 fixed bottom-8 right-8 z-50"
    >
      {isExporting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
      {isExporting ? 'Exporting...' : 'Export All as PDFs'}
    </button>
  );
}