'use client';

import { motion } from 'framer-motion';
import { User, MapPin, Building2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserRole } from '@/store/useOnboardingStore';

interface RoleOption {
  id: UserRole;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const roles: RoleOption[] = [
  {
    id: 'tourist',
    title: 'Tourist',
    description: 'Find amazing tours and book local guides.',
    icon: <User className="w-8 h-8" />,
    color: 'bg-blue-50 text-blue-600 border-blue-200',
  },
  {
    id: 'guide',
    title: 'Guide',
    description: 'Share your knowledge and earn from your trips.',
    icon: <MapPin className="w-8 h-8" />,
    color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  },
  {
    id: 'agency',
    title: 'Agency',
    description: 'Manage multiple listings and grow your business.',
    icon: <Building2 className="w-8 h-8" />,
    color: 'bg-purple-50 text-purple-600 border-purple-200',
  },
];

interface RoleSelectorProps {
  selectedRole: UserRole;
  onSelect: (role: UserRole) => void;
}

export function RoleSelector({ selectedRole, onSelect }: RoleSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {roles.map((role) => {
        const isSelected = selectedRole === role.id;
        return (
          <motion.button
            key={role.id}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(role.id)}
            className={cn(
              'relative flex flex-col items-center p-6 text-center border-2 rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2',
              role.color,
              isSelected ? 'ring-2 ring-sky-500 ring-offset-2 border-transparent' : 'border-slate-100 hover:border-slate-200',
              role.id === 'tourist' && 'role-card-tourist'
            )}
          >
            {isSelected && (
              <div className="absolute top-3 right-3">
                <CheckCircle2 className="w-5 h-5 fill-current" />
              </div>
            )}
            <div className="mb-4 p-3 rounded-full bg-white shadow-sm ring-1 ring-slate-100">
              {role.icon}
            </div>
            <h3 className="text-lg font-bold mb-1">{role.title}</h3>
            <p className="text-sm opacity-80">{role.description}</p>
          </motion.button>
        );
      })}
    </div>
  );
}
