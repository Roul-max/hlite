import React from 'react';

const InputField = ({ 
  type = 'text', 
  name, 
  placeholder, 
  value, 
  onChange, 
  icon: Icon, 
  required = false,
  className = '',
  ...props 
}) => {
  return (
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`
          w-full px-4 py-3 ${Icon ? 'pl-10' : 'pl-4'} 
          border border-gray-300 rounded-lg 
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
          transition-all duration-200 
          bg-white/50 backdrop-blur-sm
          placeholder-gray-500
          ${className}
        `}
        {...props}
      />
    </div>
  );
};

export default InputField;