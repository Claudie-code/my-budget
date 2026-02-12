import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { IncomeList } from './IncomeList';
import { IncomeForm } from './IncomeForm';
import { Pencil } from 'lucide-react';
import type { Income } from '@/types/dashboard';

export const IncomeDrawer = ({ incomes }: { incomes: Income[] }) => {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <button className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted">
          <Pencil className="h-4 w-4" />
          Manage
        </button>
      </DrawerTrigger>

      <DrawerContent className="w-full max-w-md p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Incomes</h2>
            <p className="text-sm text-muted-foreground">View and manage your incomes</p>
          </div>

          <IncomeForm />

          <div className="border-t pt-4">
            <IncomeList incomes={incomes} />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
