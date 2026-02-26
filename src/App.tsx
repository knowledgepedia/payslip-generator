import { useState } from 'react';
import FileUpload from './components/FileUpload';
import Payslip from './components/Payslip';
import PrintButton from './components/PrintButton';
import { PayslipData } from './types';

export default function App() {
  const [payslips, setPayslips] = useState<PayslipData[]>([]);

  const handleFileUpload = (data: any[][]) => {
    const headers = data[0].map(header => header.trim());
    const rows = data.slice(1);

    const parsedData: PayslipData[] = rows.map(row => {
      const rowData: any = {};
      headers.forEach((header, index) => {
        rowData[header] = row[index];
      });
      return rowData as PayslipData;
    });
    setPayslips(parsedData);
  };

  const handlePrint = () => {
    window.print();
  }

  return (
    <div className="bg-gray-100 min-h-screen font-sans text-gray-800 p-4 md:p-8">
      <main className="max-w-7xl mx-auto">
        <div className="no-print">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Payslip Generator</h1>
            <p className="mt-2 text-lg text-gray-600">Upload a CSV or XLSX file to generate payslips in bulk.</p>
          </header>
          <div className="max-w-2xl mx-auto mb-12">
            <FileUpload onFileUpload={handleFileUpload} />
          </div>
        </div>

        {payslips.length > 0 && (
          <>
            <div id="payslip-section">
              {payslips.map((payslip, index) => (
                <Payslip key={index} data={payslip} />
              ))}
            </div>
            <PrintButton onClick={handlePrint} />
          </>
        )}
      </main>
    </div>
  );
}
