export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface ExpenseLine {
  id: string;
  label: string;
  amount: number;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  department: string;
  billableRate: number;
  estimatedHours: number;
  expenses: ExpenseLine[];
  taxPercent: number;
  bonus: number;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: string;
}

export const DEPARTMENTS = [
  'Engineering',
  'Product',
  'People & Culture',
  'Finance',
  'Operations',
  'Sales',
] as const;

export function computeTaskFinancials(t: TaskItem): {
  labor: number;
  expenseTotal: number;
  subtotal: number;
  tax: number;
  grand: number;
} {
  const labor = t.billableRate * t.estimatedHours;
  const expenseTotal = t.expenses.reduce((s, e) => s + (e.amount || 0), 0);
  const subtotal = labor + expenseTotal;
  const tax = subtotal * (t.taxPercent / 100);
  const grand = subtotal + tax + t.bonus;
  return { labor, expenseTotal, subtotal, tax, grand };
}
