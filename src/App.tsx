import { useState } from 'react';
import FileUpload from './components/FileUpload';
import Payslip from './components/Payslip';
import PrintButton from './components/PrintButton';
import { PayslipData } from './types';
// Import the new library
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
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
      const zip = new JSZip();

      for (let i = 0; i < payslips.length; i++) {
        const data = payslips[i];
        const element = document.getElementById(`payslip-${i}`);
        
        if (element) {
          // Use html-to-image instead of html2canvas
          // pixelRatio: 2 ensures high resolution (mimicking scale: 2)
          const imgData = await toPng(element, { pixelRatio: 2 });
          
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          
          // html-to-image gives us a data URL, we need to calculate the height
          // We can create a quick image object in memory to get the dimensions
          const img = new Image();
          img.src = imgData;
          await new Promise((resolve) => { img.onload = resolve; });
          
          const pdfHeight = (img.height * pdfWidth) / img.width;
          
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

          const periodParts = data['Pay Period']?.split(' - ')[1]?.split(' ') || [];
          const month = periodParts[1] || 'Month';
          const year = periodParts[2] || 'Year';
          const fileName = `${data['Employee Name']}_${month}-${year}.pdf`;

          const pdfBlob = pdf.output('blob');
          zip.file(fileName, pdfBlob);
        }
      }

      const zipContent = await zip.generateAsync({ type: 'blob' });

      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(zipContent);
      downloadLink.download = 'Payslips_Archive.zip';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      
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
                <div key={index} id={`payslip-${index}`} className="mb-8 bg-white">
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