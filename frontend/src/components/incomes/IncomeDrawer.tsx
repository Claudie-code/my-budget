import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { IncomeList } from './IncomeList';
import { IncomeForm } from './IncomeForm';

export const IncomeDrawer = ({ trigger }: { trigger: React.ReactNode }) => {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>

      <DrawerContent className="w-full max-w-md p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Incomes</h2>
            <p className="text-sm text-muted-foreground">View and manage your incomes</p>
          </div>

          <IncomeForm />

          <div className="border-t pt-4">
            <IncomeList />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
