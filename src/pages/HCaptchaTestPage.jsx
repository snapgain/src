import React from 'react';
import { Layout } from '@/components/layout/Layout';
import HCaptchaForm from '@/components/auth/HCaptchaForm';

export function HCaptchaTestPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">hCaptcha Integration Test</h1>
          <p className="text-gray-600">
            This page demonstrates the hCaptcha integration for form protection.
          </p>
        </div>
        
        <div className="flex justify-center">
          <HCaptchaForm />
        </div>

        <div className="mt-12 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Implementation Details</h2>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-3">Steps to configure hCaptcha:</h3>
            
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Sign up at <a href="https://www.hcaptcha.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">hCaptcha.com</a></li>
              <li>Create a new site and get your site key</li>
              <li>Add <code className="bg-gray-200 px-1 rounded">VITE_HCAPTCHA_SITE_KEY=your_site_key</code> to .env.local</li>
              <li>Implement backend verification with the secret key</li>
              <li>Test the integration</li>
            </ol>

            <h3 className="font-semibold mb-3 mt-6">Backend Verification (Node.js example):</h3>
            <pre className="bg-gray-800 text-green-400 p-4 rounded text-xs overflow-x-auto">
{`const verifyHCaptcha = async (token) => {
  const response = await fetch('https://hcaptcha.com/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      secret: process.env.HCAPTCHA_SECRET_KEY,
      response: token,
    }),
  });
  
  const data = await response.json();
  return data.success;
};`}
            </pre>

            <h3 className="font-semibold mb-3 mt-6">Features included:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>✅ Token verification handling</li>
              <li>✅ Expiration management</li>
              <li>✅ Error handling</li>
              <li>✅ Form submission protection</li>
              <li>✅ Reset functionality</li>
              <li>✅ Visual feedback</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default HCaptchaTestPage;
