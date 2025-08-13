import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Award, FileText } from 'lucide-react';

// Import des composants
import DiplomaForm from '../components/diplomas/DiplomaForm';
import DiplomaList from '../components/diplomas/DiplomaList';
import DiplomaRequestForm from '../components/diplomas/DiplomaRequestForm';
import DiplomaRequestList from '../components/diplomas/DiplomaRequestList';
import SignatureDialog from '../components/diplomas/SignatureDialog';

// Import des services
import diplomasService from '../services/diplomasService';
import studentsService from '../services/studentsService';
import promotionsService from '../services/promotionsService';
import usersService from '../services/usersService';
import AuthService from '../lib/authService';

const ManageDiplomas = () => {
  const navigate = useNavigate();
  
  // États pour les données
  const [diplomas, setDiplomas] = useState([]);
  const [diplomaRequests, setDiplomaRequests] = useState([]);
  const [students, setStudents] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [users, setUsers] = useState([]);

  // États pour l'interface
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // États pour la signature
  const [signatureDialog, setSignatureDialog] = useState({
    isOpen: false,
    request: null,
  });

  // Utilisateur actuel
  const [currentUser, setCurrentUser] = useState(null);

  // Chargement initial des données
  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      // Vérifier l'authentification
      if (!AuthService.isAuthenticated()) {
        navigate('/login');
        return;
      }

      try {
        // Charger le profil utilisateur
        await loadCurrentUser();
        // Charger les autres données
        await loadData();
      } catch (error) {
        console.error('Error during initialization:', error);
        AuthService.logout();
        navigate('/login');
      }
    };

    checkAuthAndLoadData();
  }, [navigate]);

  const loadCurrentUser = async () => {
    try {
      if (!AuthService.isAuthenticated()) {
        setCurrentUser(null);
        return;
      }
      
      const profile = await AuthService.getProfile();
      console.log('✅ User loaded - wallet:', profile?.walletAddress);
      setCurrentUser(profile);
    } catch (err) {
      console.error('❌ Error loading user:', err);
      setCurrentUser(null);
      throw err;
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [diplomasData, requestsData, studentsData, promotionsData, usersData] = await Promise.all([
        diplomasService.getAllDiplomas(),
        diplomasService.getAllDiplomaRequests(),
        studentsService.getAllStudents(),
        promotionsService.getAllPromotions(),
        usersService.getAllUsers(),
      ]);

      setDiplomas(diplomasData);
      setDiplomaRequests(requestsData);
      setStudents(studentsData);
      setPromotions(promotionsData);
      setUsers(usersData);
      
      // Logs pour debugging
      console.log('Diplomas received:', diplomasData);
      console.log('Students received:', studentsData);
      console.log('Promotions received:', promotionsData);
      console.log('Users received:', usersData);
    } catch (err) {
      setError('Erreur lors du chargement des données: ' + err.message);
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  // Gestion des diplômes
  const handleCreateDiploma = async (diplomaData) => {
    setActionLoading(true);
    try {
      await diplomasService.createDiploma(diplomaData);
      setSuccess('Diplôme créé avec succès');
      await loadData(); // Recharger les données
    } catch (err) {
      throw new Error('Erreur lors de la création du diplôme');
    } finally {
      setActionLoading(false);
    }
  };

  // Gestion des demandes
  const handleCreateDiplomaRequest = async (requestData) => {
    console.log('=== HANDLE CREATE DIPLOMA REQUEST ===');
    console.log('Current user at submission:', currentUser);
    console.log('Current user type:', typeof currentUser);
    console.log('Current user is null?', currentUser === null);
    console.log('Current user is undefined?', currentUser === undefined);
    console.log('Current user keys:', currentUser ? Object.keys(currentUser) : 'N/A');
    console.log('Current user.id:', currentUser?.id);
    console.log('Current user.userId:', currentUser?.userId);
    console.log('Current user.address:', currentUser?.address);
    
    if (!currentUser) {
      console.error('No current user - throwing error');
      throw new Error('Utilisateur non connecté');
    }

    // Utiliser l'ID correct selon la structure de l'objet user
    const userId = currentUser.id || currentUser.userId || currentUser.address;
    console.log('Using userId:', userId);

    if (!userId) {
      console.error('No valid user ID found');
      throw new Error('ID utilisateur introuvable');
    }

    console.log('=== DEBUG CREATE DIPLOMA REQUEST ===');
    console.log('Current user:', currentUser);
    console.log('Request data:', requestData);

    setActionLoading(true);
    try {
      const result = await diplomasService.createDiplomaRequest(requestData);
      console.log('Request created successfully:', result);
      setSuccess('Demande de diplôme créée avec succès');
      await loadData(); // Recharger les données
    } catch (err) {
      console.error('Full error details:', err);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      throw new Error('Erreur lors de la création de la demande: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSignRequest = async (requestId, signatureData) => {
    if (!currentUser) {
      throw new Error('Utilisateur non connecté');
    }

    setActionLoading(true);
    try {
      await diplomasService.signDiplomaRequest(requestId, signatureData);
      setSuccess('Signature enregistrée avec succès');
      await loadData(); // Recharger les données
    } catch (err) {
      throw new Error('Erreur lors de la signature');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (!currentUser) {
      setError('Utilisateur non connecté');
      return;
    }

    if (!confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
      return;
    }

    setActionLoading(true);
    try {
      await diplomasService.deleteDiplomaRequest(requestId);
      setSuccess('Demande supprimée avec succès');
      await loadData(); // Recharger les données
    } catch (err) {
      setError('Erreur lors de la suppression: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Gestion de la signature
  const openSignatureDialog = (request) => {
    setSignatureDialog({
      isOpen: true,
      request: request,
    });
  };

  const closeSignatureDialog = () => {
    setSignatureDialog({
      isOpen: false,
      request: null,
    });
  };

  // Gestion des messages
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 10000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (loading || !currentUser) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {loading ? 'Chargement des données...' : 'Chargement du profil utilisateur...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Award className="h-8 w-8" />
          Gestion des Diplômes
        </h1>
        <p className="text-gray-600 mt-2">
          Créez et gérez les diplômes, ainsi que les demandes de soumission
        </p>
      </div>

      {/* Messages */}
      {error && (
        <Alert className="mb-4" variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4" variant="default">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Contenu principal */}
      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Demandes de Diplômes
          </TabsTrigger>
          <TabsTrigger value="diplomas" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Diplômes Disponibles
          </TabsTrigger>
        </TabsList>

        {/* Onglet Demandes */}
        <TabsContent value="requests" className="space-y-6">          
          {/* Formulaire de création de demande */}
          <DiplomaRequestForm
            diplomas={diplomas}
            students={students}
            promotions={promotions}
            users={users}
            onSubmit={handleCreateDiplomaRequest}
            loading={actionLoading}
          />

          {/* Liste des demandes */}
          <DiplomaRequestList
            requests={diplomaRequests}
            users={users}
            students={students}
            currentUserId={currentUser?.walletAddress}
            onSign={openSignatureDialog}
            onDelete={handleDeleteRequest}
            loading={false}
          />
        </TabsContent>

        {/* Onglet Diplômes */}
        <TabsContent value="diplomas" className="space-y-6">
          {/* Formulaire de création de diplôme */}
          <DiplomaForm
            onSubmit={handleCreateDiploma}
            loading={actionLoading}
          />

          {/* Liste des diplômes */}
          <DiplomaList
            diplomas={diplomas}
            loading={false}
          />
        </TabsContent>
      </Tabs>

      {/* Dialog de signature */}
      <SignatureDialog
        isOpen={signatureDialog.isOpen}
        onClose={closeSignatureDialog}
        request={signatureDialog.request}
        users={users}
        students={students}
        onSign={handleSignRequest}
        loading={actionLoading}
      />
    </div>
  );
};

export default ManageDiplomas;
