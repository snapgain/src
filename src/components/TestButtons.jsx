import React from 'react';
import { Button } from '@/components/ui/button';

export function TestButtons() {
  const handleTest = () => {
    alert('Button clicked!');
    console.log('Test button clicked');
  };

  return (
    <div className="p-4 space-y-4">
      <h2>Test Buttons</h2>
      <Button onClick={handleTest}>Test Button 1</Button>
      <button onClick={handleTest} className="px-4 py-2 bg-blue-500 text-white rounded">
        Native Button
      </button>
      <div onClick={handleTest} className="px-4 py-2 bg-green-500 text-white rounded cursor-pointer">
        Div Button
      </div>
    </div>
  );
}
