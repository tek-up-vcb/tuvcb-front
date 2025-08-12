import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';

const DiplomaForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    level: '',
    field: '',
  });

  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation basique
    if (!formData.name || !formData.level || !formData.field) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      await onSubmit(formData);
      // Réinitialiser le formulaire après succès
      setFormData({
        name: '',
        description: '',
        level: '',
        field: '',
      });
    } catch (err) {
      setError('Erreur lors de la création du diplôme');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nouveau Diplôme</CardTitle>
        <CardDescription>
          Ajoutez un nouveau type de diplôme disponible
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="mb-4" variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom du diplôme *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Diplôme d'Ingénieur Informatique"
                required
              />
            </div>

            <div>
              <Label htmlFor="level">Niveau *</Label>
              <Select
                value={formData.level}
                onValueChange={(value) => setFormData({ ...formData, level: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="License">License</SelectItem>
                  <SelectItem value="Master">Master</SelectItem>
                  <SelectItem value="Doctorat">Doctorat</SelectItem>
                  <SelectItem value="Certificat">Certificat</SelectItem>
                  <SelectItem value="Formation">Formation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="field">Domaine *</Label>
              <Input
                id="field"
                value={formData.field}
                onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                placeholder="Ex: Informatique, Data Science..."
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description détaillée du diplôme..."
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Création...' : 'Créer le Diplôme'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DiplomaForm;
