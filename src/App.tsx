import { useState } from 'react';
import FileUpload from './components/FileUpload';
import Payslip from './components/Payslip';
import PrintButton from './components/PrintButton';
import { PayslipData } from './types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import JSZip from 'jszip';

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
      // 1. Initialize a new virtual ZIP folder
      const zip = new JSZip();

      for (let i = 0; i < payslips.length; i++) {
        const data = payslips[i];
        const element = document.getElementById(`payslip-${i}`);
        
        if (element) {
          const canvas = await html2canvas(element, { scale: 2 });
          const imgData = canvas.toDataURL('image/png');
          
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
          
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

          const periodParts = data['Pay Period']?.split(' - ')[1]?.split(' ') || [];
          const month = periodParts[1] || 'Month';
          const year = periodParts[2] || 'Year';
          const fileName = `${data['Employee Name']}_${month}-${year}.pdf`;

          // 2. IMPORTANT CHANGE: Output the PDF as a Blob (raw data) instead of saving
          const pdfBlob = pdf.output('blob');
          
          // 3. Add that Blob directly into our virtual ZIP folder
          zip.file(fileName, pdfBlob);
        }
      }

      // 4. Compress the virtual folder into a single physical ZIP file
      const zipContent = await zip.generateAsync({ type: 'blob' });

      // 5. Trigger the download of the ZIP file using a temporary hidden link
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(zipContent);
      downloadLink.download = 'Payslips_Archive.zip';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      
      // Clean up the memory and remove the hidden link
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(downloadLink.href);

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