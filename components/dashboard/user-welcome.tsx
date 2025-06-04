import { UserProfile } from '@/lib/auth-service';

interface UserWelcomeProps {
  user: UserProfile;
}

export function UserWelcome({ user }: UserWelcomeProps) {
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'hr': return 'Ressources Humaines';
      case 'tutor': return 'Tuteur';
      case 'intern': return 'Stagiaire';
      case 'finance': return 'Finance';
      default: return role;
    }
  };

  const getWelcomeMessage = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Gérez l\'ensemble de la plateforme et supervisez toutes les activités.';
      case 'hr':
        return 'Gérez les stagiaires, validez les demandes et supervisez les processus RH.';
      case 'tutor':
        return 'Suivez vos stagiaires assignés et validez leurs demandes.';
      case 'intern':
        return 'Consultez votre progression et gérez vos demandes de stage.';
      case 'finance':
        return 'Gérez les aspects financiers et validez les demandes liées aux paiements.';
      default:
        return 'Bienvenue sur la plateforme de gestion des stages.';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
          <span className="text-white font-semibold text-lg">
            {user.full_name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bonjour, {user.full_name}
          </h1>
          <p className="text-gray-600">
            {getRoleDisplayName(user.role)} - {getWelcomeMessage(user.role)}
          </p>
        </div>
      </div>
    </div>
  );
}