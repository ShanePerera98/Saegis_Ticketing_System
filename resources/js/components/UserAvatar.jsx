import React from 'react';

const UserAvatar = ({ 
  user, 
  size = 'md', 
  className = '',
  showFallback = true 
}) => {
  // Size configurations
  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm', 
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
    '2xl': 'h-20 w-20 text-xl',
    '3xl': 'h-24 w-24 text-2xl'
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;
  
  // Get user initials for fallback
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`${sizeClass} rounded-full overflow-hidden bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0 ${className}`}>
      {user?.profile_image ? (
        <img 
          src={user.profile_image} 
          alt={`${user.name || 'User'}'s profile`}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Hide image and show fallback if image fails to load
            e.target.style.display = 'none';
            if (showFallback && e.target.nextSibling) {
              e.target.nextSibling.style.display = 'flex';
            }
          }}
        />
      ) : null}
      
      {/* Fallback initials */}
      <span 
        className={`font-medium text-gray-700 dark:text-gray-200 ${
          user?.profile_image ? 'hidden' : 'flex'
        } items-center justify-center w-full h-full`}
        style={{ display: user?.profile_image ? 'none' : 'flex' }}
      >
        {getInitials(user?.name)}
      </span>
    </div>
  );
};

export default UserAvatar;
