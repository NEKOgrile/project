import React, { useState } from 'react';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import { User, AppSettings } from '../../types';
import { t } from '../../utils/translations';

interface ProfilePageProps {
  user: User;
  onUpdateProfile: (user: User) => void;
  onBack: () => void;
  settings: AppSettings;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  onUpdateProfile,
  onBack,
  settings
}) => {
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [message, setMessage] = useState('');

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedUser = {
      ...user,
      username: formData.username,
      email: formData.email
    };
    
    onUpdateProfile(updatedUser);
    setMessage(t('profileUpdated', settings.language));
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmNewPassword) {
      setMessage(t('passwordMismatch', settings.language));
      return;
    }
    
    if (formData.currentPassword !== user.password) {
      setMessage('Mot de passe actuel incorrect');
      return;
    }
    
    const updatedUser = {
      ...user,
      password: formData.newPassword
    };
    
    onUpdateProfile(updatedUser);
    setMessage('Mot de passe mis à jour avec succès');
    setShowPasswordForm(false);
    setFormData({
      ...formData,
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="min-h-screen p-4 lg:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold text-white">
            {t('profile', settings.language)}
          </h1>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <p className="text-green-400">{message}</p>
          </div>
        )}

        {/* Profile Information */}
        <Card>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">
              Informations du profil
            </h2>
            
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <Input
                id="username"
                label={t('username', settings.language)}
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                required
              />
              
              <Input
                id="email"
                type="email"
                label={t('email', settings.language)}
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
              
              <Button type="submit" variant="primary">
                <Save className="w-4 h-4 mr-2" />
                {t('save', settings.language)}
              </Button>
            </form>
          </div>
        </Card>

        {/* Password Change */}
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {t('changePassword', settings.language)}
              </h2>
              {!showPasswordForm && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowPasswordForm(true)}
                >
                  Modifier
                </Button>
              )}
            </div>
            
            {showPasswordForm && (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <Input
                  id="currentPassword"
                  type="password"
                  label="Mot de passe actuel"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  required
                />
                
                <Input
                  id="newPassword"
                  type="password"
                  label="Nouveau mot de passe"
                  value={formData.newPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                  required
                />
                
                <Input
                  id="confirmNewPassword"
                  type="password"
                  label="Confirmer le nouveau mot de passe"
                  value={formData.confirmNewPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmNewPassword: e.target.value }))}
                  required
                />
                
                <div className="flex space-x-3">
                  <Button type="submit" variant="primary">
                    <Save className="w-4 h-4 mr-2" />
                    Changer le mot de passe
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setFormData({
                        ...formData,
                        currentPassword: '',
                        newPassword: '',
                        confirmNewPassword: ''
                      });
                    }}
                  >
                    {t('cancel', settings.language)}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </Card>

        {/* Account Statistics */}
        <Card>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">
              Statistiques du compte
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-cyan-400 mb-1">
                  {user.selections?.length || 0}
                </div>
                <div className="text-white/70 text-sm">Sélections</div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-teal-400 mb-1">
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
                <div className="text-white/70 text-sm">Membre depuis</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-red-400">
              Zone dangereuse
            </h2>
            
            <p className="text-white/70 text-sm">
              La suppression de votre compte est irréversible. Toutes vos données seront perdues.
            </p>
            
            <Button
              variant="secondary"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {t('deleteAccount', settings.language)}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;