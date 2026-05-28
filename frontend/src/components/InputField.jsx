import React from 'react';

const InputField = ({ label, type = 'text', value, onChange, placeholder, required = false, icon: Icon }) => {
  return (
    <div className="mb-4 w-full">
      {label && (
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Icon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          className={`input-base ${Icon ? 'pl-10' : ''}`}
          placeholder={placeholder}
          required={required}
        />
      </div>
    </div>
  );
};

export default InputField;
