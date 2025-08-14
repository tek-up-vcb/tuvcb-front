import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Award, FileText, Plus } from 'lucide-react';

// Import components
import DiplomaForm from '../components/diplomas/DiplomaForm';
import DiplomaList from '../components/diplomas/DiplomaList';
import DiplomaRequestForm from '../components/diplomas/DiplomaRequestForm';
import DiplomaRequestList from '../components/diplomas/DiplomaRequestList';
import SignatureDialog from '../components/diplomas/SignatureDialog';

// Import services
import diplomasService from '../services/diplomasService';
import studentsService from '../services/studentsService';
import promotionsService from '../services/promotionsService';
import usersService from '../services/usersService';
import AuthService from '../lib/authService';

const ManageDiplomas = () => {
  const navigate = useNavigate();
  
  // States for data
  const [diplomas, setDiplomas] = useState([]);
  const [diplomaRequests, setDiplomaRequests] = useState([]);
  const [students, setStudents] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [users, setUsers] = useState([]);

  // States for interface
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // States for signature
  const [signatureDialog, setSignatureDialog] = useState({
    isOpen: false,
    request: null,
  });

  // State for diploma request dialog
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);

  // State for diploma creation dialog
  const [diplomaDialogOpen, setDiplomaDialogOpen] = useState(false);

  // Current user
  const [currentUser, setCurrentUser] = useState(null);

  // Initial data loading
  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      // Check authentication
      if (!AuthService.isAuthenticated()) {
        navigate('/login');
        return;
      }

      try {
        // Load user profile
        await loadCurrentUser();
        // Load other data
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
      console.log('✅ User profile structure:', profile);
      console.log('✅ User ID:', profile?.id);
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
      setError('Error loading data: ' + err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Diploma management
  const handleCreateDiploma = async (diplomaData) => {
    setActionLoading(true);
    try {
      await diplomasService.createDiploma(diplomaData);
      setSuccess('Diploma created successfully');
      await loadData(); // Reload data
    } catch (err) {
      throw new Error('Error creating diploma');
    } finally {
      setActionLoading(false);
    }
  };

  // Request management
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
      throw new Error('User not logged in');
    }

      // Use correct ID according to user object structure
      const userId = currentUser.id || currentUser.userId || currentUser.address;
    console.log('Using userId:', userId);

    if (!userId) {
      console.error('No valid user ID found');
      throw new Error('User ID not found');
    }

    console.log('=== DEBUG CREATE DIPLOMA REQUEST ===');
    console.log('Current user:', currentUser);
    console.log('Request data:', requestData);

    setActionLoading(true);
    try {
      const result = await diplomasService.createDiplomaRequest(requestData);
      console.log('Request created successfully:', result);
      setSuccess('Diploma request created successfully');
      await loadData(); // Reload data
    } catch (err) {
      console.error('Full error details:', err);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      throw new Error('Error creating request: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSignRequest = async (requestId, signatureData) => {
    if (!currentUser) {
      throw new Error('User not logged in');
    }

    setActionLoading(true);
    try {
      await diplomasService.signDiplomaRequest(requestId, signatureData);
      setSuccess('Signature recorded successfully');
      await loadData(); // Reload data
    } catch (err) {
      throw new Error('Error during signature');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (!currentUser) {
      setError('User not logged in');
      return;
    }

    if (!confirm('Are you sure you want to delete this request?')) {
      return;
    }

    setActionLoading(true);
    try {
      await diplomasService.deleteDiplomaRequest(requestId);
      setSuccess('Request deleted successfully');
      await loadData(); // Reload data
    } catch (err) {
      setError('Error deleting request: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Signature management
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

  // Request dialog management
  const openRequestDialog = () => {
    setRequestDialogOpen(true);
  };

  const closeRequestDialog = () => {
    setRequestDialogOpen(false);
  };

  const handleRequestSubmit = async (requestData) => {
    try {
      await handleCreateDiplomaRequest(requestData);
      closeRequestDialog();
    } catch (error) {
      // Error is already handled in handleCreateDiplomaRequest
      throw error;
    }
  };

  // Diploma dialog management
  const openDiplomaDialog = () => {
    setDiplomaDialogOpen(true);
  };

  const closeDiplomaDialog = () => {
    setDiplomaDialogOpen(false);
  };

  const handleDiplomaSubmit = async (diplomaData) => {
    try {
      await handleCreateDiploma(diplomaData);
      closeDiplomaDialog();
    } catch (error) {
      // Error is already handled in handleCreateDiploma
      throw error;
    }
  };

  // Message management
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
            {loading ? 'Loading data...' : 'Loading user profile...'}
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
          Diploma Management
        </h1>
        <p className="text-gray-600 mt-2">
          Create and manage diplomas, as well as submission requests
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
            Diploma Requests
          </TabsTrigger>
          <TabsTrigger value="diplomas" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Available Diplomas
          </TabsTrigger>
        </TabsList>

        {/* Requests Tab */}
        <TabsContent value="requests" className="space-y-6">          
          {/* Requests list with header */}
          <DiplomaRequestList
            requests={diplomaRequests}
            users={users}
            students={students}
            currentUserId={currentUser?.id}
            onSign={openSignatureDialog}
            onDelete={handleDeleteRequest}
            onCreateNew={openRequestDialog}
            loading={false}
          />
        </TabsContent>

        {/* Diplomas Tab */}
        <TabsContent value="diplomas" className="space-y-6">
          {/* Diplomas list */}
          <DiplomaList
            diplomas={diplomas}
            onCreateNew={openDiplomaDialog}
            loading={false}
          />
        </TabsContent>
      </Tabs>

      {/* Signature dialog */}
      <SignatureDialog
        isOpen={signatureDialog.isOpen}
        onClose={closeSignatureDialog}
        request={signatureDialog.request}
        users={users}
        students={students}
        onSign={handleSignRequest}
        loading={actionLoading}
      />

      {/* Request creation dialog */}
      <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
        <DialogContent className="max-w-4xl border-0 shadow-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              New Diploma Request
            </DialogTitle>
            <DialogDescription>
              Create a new diploma submission request for students
            </DialogDescription>
          </DialogHeader>
          <DiplomaRequestForm
            diplomas={diplomas}
            students={students}
            promotions={promotions}
            users={users}
            onSubmit={handleRequestSubmit}
            onCancel={closeRequestDialog}
            loading={actionLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Diploma creation dialog */}
      <Dialog open={diplomaDialogOpen} onOpenChange={setDiplomaDialogOpen}>
        <DialogContent className="max-w-2xl border-0 shadow-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              New Diploma
            </DialogTitle>
            <DialogDescription>
              Create a new diploma template
            </DialogDescription>
          </DialogHeader>
          <DiplomaForm
            onSubmit={handleDiplomaSubmit}
            onCancel={closeDiplomaDialog}
            loading={actionLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageDiplomas;
