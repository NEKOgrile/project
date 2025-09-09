import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { supabase } from '../../supabase';
import { User, AppSettings } from '../../types';
import { t } from '../../utils/translations';
import { getUsers, saveUser } from '../../utils/storage';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onNavigateToRegister: () => void;
  settings: AppSettings;
}

const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  onNavigateToRegister,
  settings
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password) // ⚠️ à hasher en prod !
        .single();

      if (fetchError || !data) {
        setError("Email ou mot de passe incorrect.");
      } else {
        // Récupère tous les users existants
        const users = getUsers();

        // Vérifie si l'utilisateur existe déjà
        const existing = users.find(u => u.id === data.id);

        let updatedUsers: User[];
        if (existing) {
          // Mise à jour de l’utilisateur existant pour garder ses sélections
          const mergedUser = { ...existing, ...data, selections: existing.selections || [] };
          updatedUsers = users.map(u => (u.id === data.id ? mergedUser : u));
          saveUser(mergedUser);
          localStorage.setItem('currentUser', JSON.stringify(mergedUser));
          onLogin(mergedUser);
        } else {
          // Nouvel utilisateur
          updatedUsers = [...users, data];
          saveUser(data);
          localStorage.setItem('currentUser', JSON.stringify(data));
          onLogin(data);
        }

        // Met à jour le localStorage avec tous les users
        localStorage.setItem('users', JSON.stringify(updatedUsers));
      }
    } catch (err) {
      console.error(err);
      setError("Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl mb-4 shadow-lg shadow-cyan-500/25">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">FutureApp</h1>
          <p className="text-white/70">{t('welcome', settings.language)}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Input
                id="email"
                type="email"
                label={t('email', settings.language)}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@email.com"
                required
              />
              <Input
                id="password"
                type="password"
                label={t('password', settings.language)}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    {t('login', settings.language)}...
                  </div>
                ) : (
                  t('login', settings.language)
                )}
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-center text-white/70 text-sm">
              {t('dontHaveAccount', settings.language)}{' '}
              <button
                onClick={onNavigateToRegister}
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                {t('createAccount', settings.language)}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
