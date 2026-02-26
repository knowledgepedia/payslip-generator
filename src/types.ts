export interface EmployeeData {
  [key: string]: string | number;
}

export interface PayslipData extends EmployeeData {
  'Employee Name': string;
  'Designation': string;
  'Employee ID': string;
  'MOL ID': string;
  'Date of Joining': string;
  'Pay Period': string;
  'Pay Date': string;
  'Account Number': string;
  'Paid Days': number;
  'LOP Days': number;
  'Basic Pay': number;
  'Housing Allowance': number;
  'Transport Allowance': number;
  'Other Allowance': number;
  'Reimbursement (Internet)': number;
  'Loss of Pay (1 Day)': number;
  'Health Insurance Premium': number;
  'Tax / Statutory Deductions': number;
}
