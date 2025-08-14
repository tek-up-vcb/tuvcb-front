import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Edit, Trash2, Plus } from 'lucide-react';

const DiplomaList = ({ diplomas, onEdit, onDelete, onCreateNew, loading = false }) => {
  if (loading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Available Diplomas</CardTitle>
            {onCreateNew && (
              <Button onClick={onCreateNew} size="sm" className="flex items-center gap-2 border-0 shadow-sm">
                <Plus className="h-4 w-4" />
                New Diploma
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!diplomas || diplomas.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Available Diplomas</CardTitle>
            {onCreateNew && (
              <Button onClick={onCreateNew} size="sm" className="flex items-center gap-2 border-0 shadow-sm">
                <Plus className="h-4 w-4" />
                New Diploma
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600">No diplomas available</p>
            <p className="text-sm text-gray-500 mt-1">
              Create your first diploma to get started
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Available Diplomas ({diplomas.length})</CardTitle>
          {onCreateNew && (
            <Button onClick={onCreateNew} size="sm" className="flex items-center gap-2 border-0 shadow-sm">
              <Plus className="h-4 w-4" />
              New Diploma
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {diplomas.map(diploma => (
            <div key={diploma.id} className="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-all duration-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-base">{diploma.name}</h3>
                    <Badge variant={diploma.isActive ? "default" : "secondary"}>
                      {diploma.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-2">
                    <Badge variant="outline">{diploma.level}</Badge>
                    <span className="text-sm text-gray-600">{diploma.field}</span>
                  </div>
                  
                  {diploma.description && (
                    <p className="text-sm text-gray-500 mt-2">{diploma.description}</p>
                  )}
                  
                  <div className="text-xs text-gray-400 mt-2">
                    Created on {new Date(diploma.createdAt).toLocaleDateString('en-US')}
                  </div>
                </div>

                {(onEdit || onDelete) && (
                  <div className="flex gap-2 ml-4">
                    {onEdit && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(diploma)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDelete(diploma.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DiplomaList;
