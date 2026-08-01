// src/components/identity/ProfileHero.tsx
import React from 'react';
import { Mail, Briefcase, Calendar } from 'lucide-react';
import { cn } from '@/utils/cn';

// Define the type locally (or move to a shared types file later)
interface UserProfile {
  fullName: string;
  email: string;
  role: string;
  organization?: string;
  createdAt?: string;
  avatar?: string;
}

interface ProfileHeroProps {
  user: UserProfile;
  className?: string;
}

export const ProfileHero: React.FC<ProfileHeroProps> = ({ user, className }) => {
  return (
    <div className={cn('flex items-start gap-6 p-6 bg-white/5 rounded-2xl border border-white/10', className)}>
      <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-3xl font-bold text-primary shrink-0">
        {user.avatar ? (
          <img src={user.avatar} alt={user.fullName} className="w-full h-full rounded-full object-cover" />
        ) : (
          user.fullName.charAt(0)
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-bold text-white">{user.fullName}</h2>
        <p className="text-sm text-neutral-400">{user.role}</p>
        <div className="flex flex-wrap gap-4 mt-3 text-xs text-neutral-400">
          {user.email && (
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> {user.email}
            </span>
          )}
          {user.organization && (
            <span className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" /> {user.organization}
            </span>
          )}
          {user.createdAt && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Joined {new Date(user.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};