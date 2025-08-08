import React, { useState, useRef } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

export function HCaptchaForm() {
  const [formData, setFormData] = useState({
    email: '',
    message: ''
  });
  const [captchaToken, setCaptchaToken] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const captchaRef = useRef(null);

  // Chave do site hCaptcha (você precisa configurar no .env.local)
  const HCAPTCHA_SITE_KEY = import.meta.env.VITE_HCAPTCHA_SITE_KEY || "ES_b1112a2a44c543d8807090a20fc6b7cf";

  const handleCaptchaVerify = (token) => {
    console.log('hCaptcha token:', token);
    setCaptchaToken(token);
    toast({
      title: "Captcha Verified",
      description: "You have been verified as human!",
    });
  };

  const handleCaptchaExpire = () => {
    console.log('hCaptcha expired');
    setCaptchaToken(null);
    toast({
      title: "Captcha Expired",
      description: "Please complete the captcha again.",
      variant: "destructive"
    });
  };

  const handleCaptchaError = (err) => {
    console.error('hCaptcha error:', err);
    setCaptchaToken(null);
    toast({
      title: "Captcha Error",
      description: "There was an error with the captcha. Please try again.",
      variant: "destructive"
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!captchaToken) {
      toast({
        title: "Verification Required",
        description: "Please complete the captcha before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simula envio para o servidor
      console.log('Submitting form with captcha token:', captchaToken);
      
      // Aqui você enviaria os dados para seu backend
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          captchaToken
        })
      });

      if (response.ok) {
        toast({
          title: "Form Submitted",
          description: "Your message has been sent successfully!",
        });
        
        // Reset form
        setFormData({ email: '', message: '' });
        setCaptchaToken(null);
        captchaRef.current?.resetCaptcha();
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your form. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Contact Form with hCaptcha</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="your.email@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              placeholder="Your message here..."
              className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label>Human Verification</Label>
            <HCaptcha
              ref={captchaRef}
              sitekey={HCAPTCHA_SITE_KEY}
              onVerify={handleCaptchaVerify}
              onExpire={handleCaptchaExpire}
              onError={handleCaptchaError}
              theme="light" // ou "dark"
              size="normal" // ou "compact"
            />
          </div>

          <Button 
            type="submit" 
            disabled={!captchaToken || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Form'}
          </Button>

          {captchaToken && (
            <div className="text-sm text-green-600">
              ✅ Captcha verified successfully
            </div>
          )}
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Configuration Notes:</h3>
          <ul className="text-sm space-y-1">
            <li>• Add VITE_HCAPTCHA_SITE_KEY to your .env.local</li>
            <li>• Get your site key from hCaptcha dashboard</li>
            <li>• Verify token on your backend</li>
            <li>• Currently using test key for demo</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default HCaptchaForm;
