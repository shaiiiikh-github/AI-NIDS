// src/pages/UserProfilePage.tsx
import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { ArrowLeft, User, Mail, Briefcase, Pencil, Save, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { ProfileHero } from '@/components/identity/ProfileHero';
import { EditableField } from '@/components/identity/EditableField';
import { SettingToggle } from '@/components/identity/SettingToggle';
import { DangerAction } from '@/components/identity/DangerAction';
import { CollapsibleSection } from '@/components/identity/CollapsibleSection';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

export const UserProfilePage: React.FC = () => {
  const { user, updateUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [originalUser, setOriginalUser] = useState(user);

  const updateField = (field: keyof typeof user, value: string) => {
    updateUser({ [field]: value });
  };

  const handleSaveAll = () => {
    toast.success('Profile updated successfully');
    setIsEditing(false);
    setOriginalUser(user);
  };

  const handleCancel = () => {
    updateUser(originalUser);
    setIsEditing(false);
  };

  const handleToggle2FA = (checked: boolean) => {
    setIs2FAEnabled(checked);
    toast.success(checked ? '2FA enabled' : '2FA disabled');
  };

  const handleToggleNotifications = (checked: boolean) => {
    setIsNotificationsEnabled(checked);
    toast.success(checked ? 'Notifications enabled' : 'Notifications disabled');
  };

  const handleDeleteAccount = () => {
    toast.error('Account deletion request submitted');
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 md:px-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-neutral-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
        </div>
        {!isEditing && (
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              setOriginalUser(user);
              setIsEditing(true);
            }}
            className="bg-primary hover:bg-primary/90 flex items-center gap-2"
          >
            <Pencil className="w-4 h-4" />
            Edit Profile
          </Button>
        )}
      </div>

      {/* Profile Hero */}
      <ProfileHero
        user={user}
        className={cn(
          'bg-white/5 backdrop-blur-sm border rounded-2xl p-6 transition-all',
          isEditing ? 'border-primary/50 shadow-[0_0_30px_rgba(37,99,235,0.15)]' : 'border-white/10'
        )}
      />

      {/* Personal Information */}
      <CollapsibleSection title="Personal Information" defaultOpen>
        <div className="space-y-4">
          <EditableField
            label="Full Name"
            value={user.fullName}
            onSave={(val) => updateField('fullName', val)}
            isEditing={isEditing}
            icon={<User className="w-4 h-4" />}
          />
          <EditableField
            label="Email"
            value={user.email}
            onSave={(val) => updateField('email', val)}
            isEditing={isEditing}
            icon={<Mail className="w-4 h-4" />}
            type="email"
          />
          <EditableField
            label="Organization"
            value={user.organization || ''}
            onSave={(val) => updateField('organization', val)}
            isEditing={isEditing}
            icon={<Briefcase className="w-4 h-4" />}
            placeholder="Add your organization"
          />
        </div>
      </CollapsibleSection>

      {/* Security Settings */}
      <CollapsibleSection title="Security Settings" defaultOpen>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
            <div>
              <p className="text-sm font-medium text-white">Two‑Factor Authentication</p>
              <p className="text-xs text-neutral-400">Add an extra layer of security</p>
            </div>
            <SettingToggle
              label="2FA"
              checked={is2FAEnabled}
              onToggle={handleToggle2FA}
            />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
            <div>
              <p className="text-sm font-medium text-white">Email Notifications</p>
              <p className="text-xs text-neutral-400">Receive security alerts via email</p>
            </div>
            <SettingToggle
              label="Notifications"
              checked={isNotificationsEnabled}
              onToggle={handleToggleNotifications}
            />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
            <div>
              <p className="text-sm font-medium text-white">Password</p>
              <p className="text-xs text-neutral-400">Change your password</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => toast('Redirect to change password')}>
              Change
            </Button>
          </div>
        </div>
      </CollapsibleSection>

      {/* Danger Zone */}
      <CollapsibleSection title="Danger Zone" defaultOpen={false}>
        <div className="space-y-4">
          <DangerAction
            title="Delete Account"
            description="Permanently delete your account and all associated data."
            buttonLabel="Delete Account"
            onConfirm={handleDeleteAccount}
          />
        </div>
      </CollapsibleSection>

      {/* Edit Actions */}
      {isEditing && (
        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2">
            <X className="w-4 h-4" />
            Cancel
          </Button>
          <Button onClick={handleSaveAll} className="bg-primary hover:bg-primary/90 flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      )}

      <Toaster position="bottom-right" />
    </div>
  );
};