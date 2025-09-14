import { Translation } from '../types';

export const translations: Record<'fr' | 'en', Translation> = {
  fr: {
    // Authentication
    'login': 'Connexion',
    'register': 'Inscription',
    'email': 'Email',
    'password': 'Mot de passe',
    'confirmPassword': 'Confirmation du mot de passe',
    'username': 'Pseudo',
    'forgotPassword': 'Mot de passe oublié ?',
    'createAccount': 'Créer un compte',
    'backToLogin': 'Retour à la connexion',
    'alreadyHaveAccount': 'Déjà un compte ?',
    'dontHaveAccount': 'Pas encore de compte ?',
    
    // Navigation
    'home': 'Accueil',
    'calendar': 'Calendrier',
    'statistics': 'Statistiques',
    'settings': 'Paramètres',
    'profile': 'Profil',
    'logout': 'Déconnexion',
    
    // Dashboard
    'welcome': 'Bienvenue',
    'totalActiveUsers': 'Utilisateurs actifs',
    'selectedSlots': 'Créneaux sélectionnés',
    'yourSelections': 'Vos sélections',
    'selectSlot': 'Cliquez pour sélectionner',
    'selectedBy': 'Sélectionné par',
    
    // Days
    'monday': 'Lundi',
    'tuesday': 'Mardi',
    'wednesday': 'Mercredi',
    'thursday': 'Jeudi',
    'friday': 'Vendredi',
    'saturday': 'Samedi',
    'sunday': 'Dimanche',
    
    // Profile
    'editProfile': 'Modifier le profil',
    'changePassword': 'Changer le mot de passe',
    'deleteAccount': 'Supprimer le compte',
    'save': 'Sauvegarder',
    'cancel': 'Annuler',
    
    // Settings
    'language': 'Langue',
    'theme': 'Thème',
    'blueNight': 'Nuit bleue',
    'anthracite': 'Gris anthracite',
    
    // Messages
    'loginSuccess': 'Connexion réussie !',
    'loginError': 'Email ou mot de passe incorrect',
    'registerSuccess': 'Compte créé avec succès !',
    'registerError': 'Erreur lors de la création du compte',
    'passwordMismatch': 'Les mots de passe ne correspondent pas',
    'profileUpdated': 'Profil mis à jour avec succès',
    'settingsUpdated': 'Paramètres sauvegardés',
    'accountDeleted': 'Compte supprimé avec succès',
    'deleteAccountConfirm': 'Êtes-vous sûr de vouloir supprimer votre compte ?',
    'deleteAccountWarning': 'Cette action est irréversible et toutes vos données seront perdues.',
    'currentPassword': 'Mot de passe actuel',
    'newPassword': 'Nouveau mot de passe',
    'confirmNewPassword': 'Confirmer le nouveau mot de passe',
    'passwordTooShort': 'Le mot de passe doit contenir au moins 6 caractères',
    'incorrectCurrentPassword': 'Mot de passe actuel incorrect',
    'passwordUpdated': 'Mot de passe mis à jour avec succès',
    'emailAlreadyExists': 'Cet email est déjà utilisé',
    'updateError': 'Erreur lors de la mise à jour',
    'unexpectedError': 'Une erreur inattendue s\'est produite',
    'filter': 'Filtre',
    'mostPopular': 'Plus populaire',
    'selectAll': 'Tout sélectionner',
    'deselectAll': 'Tout désélectionner',
    'usersVisible': 'utilisateurs visibles',
    'filterUsers': 'Filtrer les utilisateurs'
  },
  en: {
    // Authentication
    'login': 'Login',
    'register': 'Register',
    'email': 'Email',
    'password': 'Password',
    'confirmPassword': 'Confirm Password',
    'username': 'Username',
    'forgotPassword': 'Forgot password?',
    'createAccount': 'Create Account',
    'backToLogin': 'Back to Login',
    'alreadyHaveAccount': 'Already have an account?',
    'dontHaveAccount': "Don't have an account?",
    
    // Navigation
    'home': 'Home',
    'calendar': 'Calendar',
    'statistics': 'Statistics',
    'settings': 'Settings',
    'profile': 'Profile',
    'logout': 'Logout',
    
    // Dashboard
    'welcome': 'Welcome',
    'totalActiveUsers': 'Active Users',
    'selectedSlots': 'Selected Slots',
    'yourSelections': 'Your Selections',
    'selectSlot': 'Click to select',
    'selectedBy': 'Selected by',
    
    // Days
    'monday': 'Monday',
    'tuesday': 'Tuesday',
    'wednesday': 'Wednesday',
    'thursday': 'Thursday',
    'friday': 'Friday',
    'saturday': 'Saturday',
    'sunday': 'Sunday',
    
    // Profile
    'editProfile': 'Edit Profile',
    'changePassword': 'Change Password',
    'deleteAccount': 'Delete Account',
    'save': 'Save',
    'cancel': 'Cancel',
    
    // Settings
    'language': 'Language',
    'theme': 'Theme',
    'blueNight': 'Blue Night',
    'anthracite': 'Anthracite Grey',
    
    // Messages
    'loginSuccess': 'Login successful!',
    'loginError': 'Invalid email or password',
    'registerSuccess': 'Account created successfully!',
    'registerError': 'Error creating account',
    'passwordMismatch': 'Passwords do not match',
    'profileUpdated': 'Profile updated successfully',
    'settingsUpdated': 'Settings saved',
    'accountDeleted': 'Account deleted successfully',
    'deleteAccountConfirm': 'Are you sure you want to delete your account?',
    'deleteAccountWarning': 'This action is irreversible and all your data will be lost.',
    'currentPassword': 'Current Password',
    'newPassword': 'New Password',
    'confirmNewPassword': 'Confirm New Password',
    'passwordTooShort': 'Password must be at least 6 characters long',
    'incorrectCurrentPassword': 'Current password is incorrect',
    'passwordUpdated': 'Password updated successfully',
    'emailAlreadyExists': 'This email is already in use',
    'updateError': 'Error during update',
    'unexpectedError': 'An unexpected error occurred',
    'filter': 'Filter',
    'mostPopular': 'Most popular',
    'selectAll': 'Select all',
    'deselectAll': 'Deselect all',
    'usersVisible': 'users visible',
    'filterUsers': 'Filter users'
  }
};

export const t = (key: string, language: 'fr' | 'en'): string => {
  return translations[language][key] || key;
};