import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Edit, Trash2, Plus } from 'lucide-react';
import Skeleton from '../ui/Skeleton';

const DiplomaList = ({ diplomas, onEdit, onDelete, onCreateNew, loading = false }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Available Diplomas</CardTitle>
            {onCreateNew && (
              <Button onClick={onCreateNew} size="sm" variant="soft" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Diploma
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 rounded-lg border border-border/70 bg-card">
                <div className="flex items-center justify-between mb-2">
                  <Skeleton className="h-5 w-48" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
                <Skeleton className="h-4 w-64 mb-2" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!diplomas || diplomas.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Available Diplomas</CardTitle>
            {onCreateNew && (
              <Button onClick={onCreateNew} size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Diploma
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No diplomas available</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create your first diploma to get started
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Available Diplomas ({diplomas.length})</CardTitle>
          {onCreateNew && (
            <Button onClick={onCreateNew} size="sm" variant="soft" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Diploma
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-border/40 rounded-lg overflow-hidden border border-border/40">
          {diplomas.map(diploma => (
            <div key={diploma.id} className="bg-card p-4 hover:bg-muted/50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-base">{diploma.name}</h3>
                    <Badge variant={diploma.isActive ? "default" : "secondary"}>
                      {diploma.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 mb-2 text-sm">
                    <Badge variant="outline">{diploma.level}</Badge>
                    <span className="text-muted-foreground">{diploma.field}</span>
                  </div>
                  
                  {diploma.description && (
                    <p className="text-sm text-muted-foreground mt-2">{diploma.description}</p>
                  )}
                  
                  <div className="text-xs text-muted-foreground mt-2">
                    Created on {new Date(diploma.createdAt).toLocaleDateString('en-US')}
                  </div>
                </div>

                {(onEdit || onDelete) && (
                  <div className="flex gap-2 ml-4">
          {onEdit && (
                      <Button
                        size="sm"
            variant="soft"
                        onClick={() => onEdit(diploma)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
          {onDelete && (
                      <Button
                        size="sm"
            variant="soft"
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
