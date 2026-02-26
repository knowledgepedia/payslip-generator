import { useState } from 'react';
import FileUpload from './components/FileUpload';
import Payslip from './components/Payslip';
import PrintButton from './components/PrintButton';
import { PayslipData } from './types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function App() {
  const [payslips, setPayslips] = useState<PayslipData[]>([]);
  const [isExporting, setIsExporting] = useState(false);

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

  const handleExportPDFs = async () => {
    setIsExporting(true);
    
    try {
      // Loop through each payslip data entry
      for (let i = 0; i < payslips.length; i++) {
        const data = payslips[i];
        const element = document.getElementById(`payslip-${i}`);
        
        if (element) {
          // 1. Take a screenshot of the DOM element
          const canvas = await html2canvas(element, { scale: 2 });
          const imgData = canvas.toDataURL('image/png');
          
          // 2. Create the PDF ('p' = portrait, 'mm' = millimeters, 'a4' size)
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
          
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

          // 3. Extract the date to format "MMM-YYYY"
          // Assuming 'Pay Period' is like "01 Jan 2026 - 31 Jan 2026"
          const periodParts = data['Pay Period']?.split(' - ')[1]?.split(' ') || [];
          const month = periodParts[1] || 'Month';
          const year = periodParts[2] || 'Year';
          
          const fileName = `${data['Employee Name']}_${month}-${year}.pdf`;

          // 4. Trigger the download for this specific payslip
          pdf.save(fileName);
        }
      }
    } catch (error) {
      console.error("Error generating PDFs:", error);
    } finally {
      setIsExporting(false);
    }
  };

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
                /* Added a unique ID to wrap each Payslip so html2canvas can target it */
                <div key={index} id={`payslip-${index}`} className="mb-8">
                  <Payslip data={payslip} />
                </div>
              ))}
            </div>
            <PrintButton onClick={handleExportPDFs} isExporting={isExporting} />
          </>
        )}
      </main>
    </div>
  );
}