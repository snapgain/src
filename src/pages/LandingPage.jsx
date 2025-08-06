
import React from 'react';
import { Hero } from '@/components/sections/Hero';
import { Features } from '@/components/sections/Features';
import { SubscriptionCTA } from '@/components/sections/SubscriptionCTA';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleSubscribe = () => {
        // In a real app, this would likely trigger a payment flow.
        // For now, we'll just redirect to signup.
        navigate('/auth/signup');
    };

    return (
        <div>
            <section id="hero" className="container mx-auto px-4 py-16">
                 <Hero user={user} onSubscribe={handleSubscribe} />
            </section>
            <section id="features" className="bg-gray-100 py-20">
                <Features />
            </section>
            <section id="pricing" className="container mx-auto px-4 py-20">
                <SubscriptionCTA onSubscribe={handleSubscribe} />
            </section>
        </div>
    );
}

export default LandingPage;
