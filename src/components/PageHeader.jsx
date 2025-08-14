import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowLeft, Award, Users, UserCheck } from 'lucide-react';

const PAGE_CONFIGS = {
  diplomas: {
    title: 'Diploma Management',
    description: 'Create and manage diplomas, as well as submission requests',
    icon: Award,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600'
  },
  students: {
    title: 'Student Management',
    description: 'Manage students and their promotions',
    icon: Users,
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600'
  },
  users: {
    title: 'User Management',
    description: 'Manage system users and their permissions',
    icon: UserCheck,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600'
  }
};

const PageHeader = ({ 
  pageType, 
  customTitle, 
  customDescription, 
  customIcon: CustomIcon,
  showIcon = true,
  showDivider = true 
}) => {
  const navigate = useNavigate();
  const config = PAGE_CONFIGS[pageType];
  
  if (!config && !customTitle) {
    console.warn('PageHeader: pageType not found and no customTitle provided');
    return null;
  }

  const title = customTitle || config?.title;
  const description = customDescription || config?.description;
  const Icon = CustomIcon || config?.icon;
  const iconBg = config?.iconBg || 'bg-gray-50';
  const iconColor = config?.iconColor || 'text-gray-600';

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate('/dashboard')}
            variant="ghost"
            size="sm"
            className="gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          {showDivider && <div className="h-6 w-px bg-gray-300" />}
          
          <div className="flex items-center gap-3">
            {showIcon && Icon && (
              <div className={`p-2 ${iconBg} rounded-lg`}>
                <Icon className={`h-6 w-6 ${iconColor}`} />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 text-left">{title}</h1>
              {description && (
                <p className="text-sm text-gray-600 mt-1">{description}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
