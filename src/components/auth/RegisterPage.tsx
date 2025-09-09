import React, { useState } from 'react';
import { supabase } from '../../supabase';
import { UserPlus } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { t } from '../../utils/translations';
import { AppSettings } from '../../types';

interface RegisterPageProps {
  onRegister: (user: any) => void;
  onNavigateToLogin: () => void;
  settings: AppSettings;
}

const RegisterPage: React.FC<RegisterPageProps> = ({
  onRegister,
  onNavigateToLogin,
  settings
}) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.username.length < 3) {
      newErrors.username = 'Le pseudo doit contenir au moins 3 caractères';
    }

    if (!formData.email.includes('@')) {
      newErrors.email = 'Email invalide';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('passwordMismatch', settings.language);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    setLoading(true);

    try {
      // Vérifie si l'email existe déjà
      const { data: existing, error: fetchError } = await supabase
        .from('users')
        .select('id')
        .eq('email', formData.email)
        .maybeSingle();

      if (fetchError) {
        console.error('Erreur lors de la vérification:', fetchError);
        setErrors({ general: 'Erreur lors de la vérification' });
        return;
      }

      if (existing) {
        setErrors({ email: 'Cet email est déjà utilisé' });
        return;
      }

      // Crée un nouvel utilisateur
      const { data, error: insertError } = await supabase
        .from('users')
        .insert([{
          username: formData.username,
          email: formData.email,
          password: formData.password, // ⚠️ à hasher en prod !
          available_date: [],
          createdat: new Date().toISOString()
        }])
        .select()
        .single();

      if (insertError) {
        console.error('Erreur lors de la création:', insertError);
        setErrors({ general: 'Erreur lors de la création du compte' });
        return;
      }

      onRegister(data);
    } catch (err) {
      console.error(err);
      setErrors({ general: t('registerError', settings.language) });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl mb-4 shadow-lg shadow-teal-500/25">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {t('createAccount', settings.language)}
          </h1>
          <p className="text-white/70">Rejoignez l'application futuriste</p>
        </div>

        {/* Register Form */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Input
                id="username"
                type="text"
                label={t('username', settings.language)}
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="MonPseudo"
                error={errors.username}
                required
              />

              <Input
                id="email"
                type="email"
                label={t('email', settings.language)}
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="exemple@email.com"
                error={errors.email}
                required
              />

              <Input
                id="password"
                type="password"
                label={t('password', settings.language)}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="••••••••"
                error={errors.password}
                required
              />

              <Input
                id="confirmPassword"
                type="password"
                label={t('confirmPassword', settings.language)}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="••••••••"
                error={errors.confirmPassword}
                required
              />
            </div>

            {errors.general && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{errors.general}</p>
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
                    {t('createAccount', settings.language)}...
                  </div>
                ) : (
                  t('createAccount', settings.language)
                )}
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-center text-white/70 text-sm">
              {t('alreadyHaveAccount', settings.language)}{' '}
              <button
                onClick={onNavigateToLogin}
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                {t('login', settings.language)}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
