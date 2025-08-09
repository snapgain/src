import React from 'react';

const Select = React.forwardRef(({ children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    >
      {children}
    </select>
  );
});

const SelectContent = React.forwardRef(({ children, ...props }, ref) => {
  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
});

const SelectItem = React.forwardRef(({ children, value, ...props }, ref) => {
  return (
    <option ref={ref} value={value} {...props}>
      {children}
    </option>
  );
});

const SelectTrigger = React.forwardRef(({ children, ...props }, ref) => {
  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
});

const SelectValue = React.forwardRef(({ placeholder, ...props }, ref) => {
  return (
    <span ref={ref} {...props}>
      {placeholder}
    </span>
  );
});

Select.displayName = "Select";
SelectContent.displayName = "SelectContent";
SelectItem.displayName = "SelectItem";
SelectTrigger.displayName = "SelectTrigger";
SelectValue.displayName = "SelectValue";

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };