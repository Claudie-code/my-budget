import { Check } from 'lucide-react';

export default function AuthLeftPanel() {
  return (
    <div className="hidden md:flex w-1/2 bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-400 text-white p-12 flex-col justify-center rounded-l-lg shadow-lg">
      <h1 className="text-4xl font-extrabold mb-4 tracking-wide">MyBudget</h1>
      <p className="text-lg mb-6">
        Take control of your finances effortlessly. Track, plan, and optimize your budget with ease.
      </p>
      <ul className="space-y-2 text-sm">
        <li className="flex">
          <Check className="pr-2" /> Visualize your spending
        </li>
        <li className="flex">
          <Check className="pr-2" /> Set and achieve your financial goals
        </li>
        <li className="flex">
          <Check className="pr-2" /> Secure and private
        </li>
      </ul>
    </div>
  );
}
