import React from 'react';
import { PayslipData } from '../types';

interface PayslipProps {
  data: PayslipData;
}

const Payslip: React.FC<PayslipProps> = ({ data }) => {

  const grossEarnings = (
    (data['Basic Pay'] || 0) + 
    (data['Housing Allowance'] || 0) + 
    (data['Transport Allowance'] || 0) + 
    (data['Other Allowance'] || 0) + 
    (data['Reimbursement (Internet)'] || 0)
  );

  const totalDeductions = (
    (data['Loss of Pay (1 Day)'] || 0) + 
    (data['Health Insurance Premium'] || 0) + 
    (data['Tax / Statutory Deductions'] || 0)
  );

  const netPay = grossEarnings - totalDeductions;

  const toWords = (num: number): string => {
    const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
    const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    
    if ((num = num.toString()).length > 9) return 'overflow';
    const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return ''; 
    let str = '';
    str += (n[1] != '00') ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != '00') ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != '00') ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != '0') ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != '00') ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
    return str.trim().split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') + ' Only.';
  };

  return (
    <div className="payslip-container max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-8 print-border mb-8 break-inside-avoid">
        <header className="text-center border-b-2 border-gray-800 pb-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">NexGen Automation & AI Ltd.</h1>
            <p className="text-sm text-gray-600 mt-1">Tech Park, Phase 2, Pune, Maharashtra 411057, India</p>
            <div className="mt-4 inline-block bg-blue-50 border border-blue-200 text-blue-800 px-6 py-2 rounded-full font-semibold">
                Payslip for the Period of {data['Pay Period']?.split(' - ')[1]?.split(' ')[1]} {data['Pay Period']?.split(' - ')[1]?.split(' ')[2]}
            </div>
        </header>

        <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4 uppercase tracking-wider border-b pb-1">Employee Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm">
                <div className="space-y-2">
                    <div className="flex justify-between border-b border-gray-100 pb-1">
                        <span className="font-semibold text-gray-600">Employee Name:</span>
                        <span className="font-medium text-gray-900">{data['Employee Name']}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-1">
                        <span className="font-semibold text-gray-600">Designation:</span>
                        <span className="font-medium text-gray-900">{data['Designation']}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-1">
                        <span className="font-semibold text-gray-600">Employee ID:</span>
                        <span className="font-medium text-gray-900">{data['Employee ID']}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-1">
                        <span className="font-semibold text-gray-600">MOL ID:</span>
                        <span className="font-medium text-gray-900">{data['MOL ID']}</span>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between border-b border-gray-100 pb-1">
                        <span className="font-semibold text-gray-600">Date of Joining:</span>
                        <span className="font-medium text-gray-900">{data['Date of Joining']}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-1">
                        <span className="font-semibold text-gray-600">Pay Period:</span>
                        <span className="font-medium text-gray-900">{data['Pay Period']}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-1">
                        <span className="font-semibold text-gray-600">Pay Date:</span>
                        <span className="font-medium text-gray-900">{data['Pay Date']}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-1">
                        <span className="font-semibold text-gray-600">Account Number:</span>
                        <span className="font-medium text-gray-900">{data['Account Number']}</span>
                    </div>
                </div>
            </div>
        </section>

        <section className="mb-8 grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <span className="block text-sm font-semibold text-gray-500 uppercase">Paid Days</span>
                <span className="block text-2xl font-bold text-gray-800">{data['Paid Days']}</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <span className="block text-sm font-semibold text-gray-500 uppercase">LOP Days</span>
                <span className="block text-2xl font-bold text-red-600">{data['LOP Days']}</span>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <span className="block text-sm font-semibold text-blue-600 uppercase">Net Pay</span>
                <span className="block text-2xl font-bold text-blue-900">AED {netPay.toFixed(2)}</span>
            </div>
        </section>

        <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4 uppercase tracking-wider border-b pb-1">Salary Breakup</h2>
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="py-2 px-3 border border-gray-300 font-bold uppercase">Earnings</th>
                                <th className="py-2 px-3 border border-gray-300 font-bold uppercase text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td className="py-2 px-3 border border-gray-200 text-gray-800">Basic Pay</td><td className="py-2 px-3 border border-gray-200 text-right text-gray-900 font-medium">{Number(data['Basic Pay']).toFixed(2)}</td></tr>
                            <tr><td className="py-2 px-3 border border-gray-200 text-gray-800">Housing Allowance</td><td className="py-2 px-3 border border-gray-200 text-right text-gray-900 font-medium">{Number(data['Housing Allowance']).toFixed(2)}</td></tr>
                            <tr><td className="py-2 px-3 border border-gray-200 text-gray-800">Transport Allowance</td><td className="py-2 px-3 border border-gray-200 text-right text-gray-900 font-medium">{Number(data['Transport Allowance']).toFixed(2)}</td></tr>
                            <tr><td className="py-2 px-3 border border-gray-200 text-gray-800">Other Allowance</td><td className="py-2 px-3 border border-gray-200 text-right text-gray-900 font-medium">{Number(data['Other Allowance']).toFixed(2)}</td></tr>
                            <tr><td className="py-2 px-3 border border-gray-200 text-gray-800">Reimbursement (Internet)</td><td className="py-2 px-3 border border-gray-200 text-right text-gray-900 font-medium">{Number(data['Reimbursement (Internet)']).toFixed(2)}</td></tr>
                        </tbody>
                        <tfoot>
                            <tr className="bg-gray-50 font-bold text-gray-900">
                                <td className="py-2 px-3 border border-gray-300">Gross Earnings</td>
                                <td className="py-2 px-3 border border-gray-300 text-right">{grossEarnings.toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div className="w-full md:w-1/2">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="py-2 px-3 border border-gray-300 font-bold uppercase">Deductions</th>
                                <th className="py-2 px-3 border border-gray-300 font-bold uppercase text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                           <tr><td className="py-2 px-3 border border-gray-200 text-gray-800">Loss of Pay (1 Day)</td><td className="py-2 px-3 border border-gray-200 text-right text-gray-900 font-medium">{Number(data['Loss of Pay (1 Day)']).toFixed(2)}</td></tr>
                           <tr><td className="py-2 px-3 border border-gray-200 text-gray-800">Health Insurance Premium</td><td className="py-2 px-3 border border-gray-200 text-right text-gray-900 font-medium">{Number(data['Health Insurance Premium']).toFixed(2)}</td></tr>
                           <tr><td className="py-2 px-3 border border-gray-200 text-gray-800">Tax / Statutory Deductions</td><td className="py-2 px-3 border border-gray-200 text-right text-gray-900 font-medium">{Number(data['Tax / Statutory Deductions']).toFixed(2)}</td></tr>
                           <tr><td className="py-2 px-3 border border-gray-200 text-gray-800 text-transparent select-none">-</td><td className="py-2 px-3 border border-gray-200 text-right text-transparent select-none">-</td></tr>
                           <tr><td className="py-2 px-3 border border-gray-200 text-gray-800 text-transparent select-none">-</td><td className="py-2 px-3 border border-gray-200 text-right text-transparent select-none">-</td></tr>
                        </tbody>
                        <tfoot>
                            <tr className="bg-gray-50 font-bold text-gray-900">
                                <td className="py-2 px-3 border border-gray-300">Total Deductions</td>
                                <td className="py-2 px-3 border border-gray-300 text-right text-red-600">{totalDeductions.toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </section>

        <section className="mt-8 pt-6 border-t-2 border-gray-800 flex flex-col items-center">
            <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0">
                    <span className="block text-sm font-semibold text-gray-600 uppercase mb-1">Net Pay for the Month</span>
                    <span className="block text-gray-800 text-sm italic">Amount in words:</span>
                    <span className="block text-gray-900 font-bold mt-1 text-lg">{toWords(netPay)}</span>
                </div>
                <div className="text-right">
                    <span className="block text-4xl font-black text-blue-900 tracking-tight">AED {netPay.toFixed(2)}</span>
                </div>
            </div>
        </section>

        <footer className="mt-12 pt-8 flex justify-between items-end border-t border-gray-200 text-sm text-gray-500">
            <div>
                <p>This is a system-generated document and does not require a signature.</p>
            </div>
            <div className="text-center">
                <div className="w-32 border-b border-gray-400 mb-2"></div>
                <p>Authorized Signatory</p>
            </div>
        </footer>
    </div>
  );
};

export default Payslip;
