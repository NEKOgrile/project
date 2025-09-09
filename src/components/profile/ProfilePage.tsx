import React, { useState } from 'react';
import { ArrowLeft, Save, Trash2, User as UserIcon, Mail, Lock, Calendar } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import { User, AppSettings } from '../../types';
import { t } from '../../utils/translations';
import { supabase } from '../../supabase';

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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const clearMessages = () => {
    setTimeout(() => {
      setMessage('');
      setError('');
    }, 5000);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Vérifier si l'email est déjà utilisé par un autre utilisateur
      if (formData.email !== user.email) {
        const { data: existingUser, error: checkError } = await supabase
          .from('users')
          .select('id')
          .eq('email', formData.email)
          .neq('id', user.id)
          .maybeSingle();

        if (checkError) {
          console.error('Erreur lors de la vérification de l\'email:', checkError);
          setError('Erreur lors de la vérification de l\'email');
          clearMessages();
          return;
        }

        if (existingUser) {
          setError('Cet email est déjà utilisé par un autre utilisateur');
          clearMessages();
          return;
        }
      }

      // Mettre à jour les informations dans Supabase
      const { data, error: updateError } = await supabase
        .from('users')
        .update({
          username: formData.username,
          email: formData.email
        })
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) {
        console.error('Erreur lors de la mise à jour:', updateError);
        setError('Erreur lors de la mise à jour du profil');
        clearMessages();
        return;
      }

      // Mettre à jour l'utilisateur local
      const updatedUser = {
        ...user,
        username: data.username,
        email: data.email
      };

      onUpdateProfile(updatedUser);
      setMessage(t('profileUpdated', settings.language));
      clearMessages();

    } catch (err) {
      console.error('Erreur:', err);
      setError('Une erreur inattendue s\'est produite');
      clearMessages();
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setError('');
    setMessage('');

    try {
      // Vérifications côté client
      if (formData.newPassword !== formData.confirmNewPassword) {
        setError(t('passwordMismatch', settings.language));
        clearMessages();
        return;
      }

      if (formData.newPassword.length < 6) {
        setError('Le nouveau mot de passe doit contenir au moins 6 caractères');
        clearMessages();
        return;
      }

      // Vérifier le mot de passe actuel
      if (formData.currentPassword !== user.password) {
        setError('Mot de passe actuel incorrect');
        clearMessages();
        return;
      }

      // Mettre à jour le mot de passe dans Supabase
      const { error: updateError } = await supabase
        .from('users')
        .update({
          password: formData.newPassword
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Erreur lors de la mise à jour du mot de passe:', updateError);
        setError('Erreur lors de la mise à jour du mot de passe');
        clearMessages();
        return;
      }

      // Mettre à jour l'utilisateur local
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
      clearMessages();

    } catch (err) {
      console.error('Erreur:', err);
      setError('Une erreur inattendue s\'est produite');
      clearMessages();
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      return;
    }

    if (!window.confirm('Dernière confirmation : toutes vos données seront perdues définitivement.')) {
      return;
    }

    try {
      setLoading(true);

      // Supprimer l'utilisateur de Supabase
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', user.id);

      if (deleteError) {
        console.error('Erreur lors de la suppression:', deleteError);
        setError('Erreur lors de la suppression du compte');
        clearMessages();
        return;
      }

      // Nettoyer le localStorage
      localStorage.removeItem('currentUser');
      localStorage.removeItem('users');
      localStorage.removeItem('appSettings');

      // Rediriger vers la page de connexion
      window.location.reload();

    } catch (err) {
      console.error('Erreur:', err);
      setError('Une erreur inattendue s\'est produite');
      clearMessages();
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Date inconnue';
    }
  };

  return (
    <div className="min-h-screen p-4 lg:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
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
          <h1 className="text-3xl font-bold text-white">
            {t('profile', settings.language)}
          </h1>
        </div>

        {/* Messages */}
        {message && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <p className="text-green-400">{message}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card className="text-center p-8">
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/25">
                <UserIcon className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{user.username}</h2>
              <p className="text-white/70 mb-4">{user.email}</p>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-center space-x-2 text-white/70">
                  <Calendar className="w-4 h-4" />
                  <span>Membre depuis {formatDate(user.createdAt)}</span>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-2xl font-bold text-cyan-400 mb-1">
                    {user.selections?.length || 0}
                  </div>
                  <div className="text-white/70">Créneaux sélectionnés</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Profile Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <Card>
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <UserIcon className="w-6 h-6 text-cyan-400" />
                  <h2 className="text-xl font-semibold text-white">
                    Informations du profil
                  </h2>
                </div>
                
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      id="username"
                      label={t('username', settings.language)}
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      required
                      disabled={loading}
                    />
                    
                    <Input
                      id="email"
                      type="email"
                      label={t('email', settings.language)}
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      variant="primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Mise à jour...
                        </div>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          {t('save', settings.language)}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </Card>

            {/* Password Change */}
            <Card>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Lock className="w-6 h-6 text-cyan-400" />
                    <h2 className="text-xl font-semibold text-white">
                      {t('changePassword', settings.language)}
                    </h2>
                  </div>
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
                      disabled={passwordLoading}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        id="newPassword"
                        type="password"
                        label="Nouveau mot de passe"
                        value={formData.newPassword}
                        onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                        required
                        disabled={passwordLoading}
                        placeholder="Min. 6 caractères"
                      />
                      
                      <Input
                        id="confirmNewPassword"
                        type="password"
                        label="Confirmer le nouveau mot de passe"
                        value={formData.confirmNewPassword}
                        onChange={(e) => setFormData(prev => ({ ...prev, confirmNewPassword: e.target.value }))}
                        required
                        disabled={passwordLoading}
                      />
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button 
                        type="submit" 
                        variant="primary"
                        disabled={passwordLoading}
                      >
                        {passwordLoading ? (
                          <div className="flex items-center">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            Mise à jour...
                          </div>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Changer le mot de passe
                          </>
                        )}
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
                        disabled={passwordLoading}
                      >
                        {t('cancel', settings.language)}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </Card>

            {/* Danger Zone */}
            <Card>
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-red-400">
                  Zone dangereuse
                </h2>
                
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                  <p className="text-white/70 text-sm mb-4">
                    La suppression de votre compte est irréversible. Toutes vos données, 
                    y compris vos sélections de créneaux, seront définitivement perdues.
                  </p>
                  
                  <Button
                    variant="secondary"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
                    onClick={handleDeleteAccount}
                    disabled={loading}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t('deleteAccount', settings.language)}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;