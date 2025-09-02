
import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import usersService from '../services/usersService';
import AuthService from '../lib/authService';

const AccountSettings = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Charger le profil utilisateur depuis le localStorage ou l'API
    const profile = AuthService.getUserProfile();
    if (profile) {
      setUser(profile);
      setForm({
        firstName: profile.firstName || profile.prenom || '',
        lastName: profile.lastName || profile.nom || '',
      });
    } else {
      // fallback API
      AuthService.getProfile().then((profile) => {
        setUser(profile);
        setForm({
          firstName: profile.firstName || profile.prenom || '',
          lastName: profile.lastName || profile.nom || '',
        });
      });
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setEditMode(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setEditMode(false);
    setForm({
      firstName: user.firstName || user.prenom || '',
      lastName: user.lastName || user.nom || '',
    });
    setError('');
    setSuccess('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const updated = await usersService.updateUser(user.id, {
        nom: form.lastName,
        prenom: form.firstName,
      });
      setUser({ ...user, ...updated });
      AuthService.getProfile().then((profile) => {
        localStorage.setItem('user_profile', JSON.stringify(profile));
      });
      setSuccess('Profil mis à jour avec succès.');
      setEditMode(false);
    } catch {
      setError("Erreur lors de la mise à jour du profil.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div>Chargement...</div>;

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-md p-8 shadow-lg border-none">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Mon profil</h2>
          {!editMode && (
            <Button variant="outline" onClick={handleEdit} className="ml-2">Modifier</Button>
          )}
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom</label>
            {editMode ? (
              <Input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
                autoFocus
              />
            ) : (
              <div className="py-2 px-3 bg-muted rounded">{user.lastName || user.nom}</div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Prénom</label>
            {editMode ? (
              <Input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            ) : (
              <div className="py-2 px-3 bg-muted rounded">{user.firstName || user.prenom}</div>
            )}
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          {editMode && (
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={handleCancel} disabled={loading}>Annuler</Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
};

export default AccountSettings;
