import React from 'react';
import { Helmet } from 'react-helmet';
import { Card } from '@/components/ui/card';

function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About Us - SnapGain</title>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] bg-clip-text text-transparent mb-6">
              About Us
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              SnapGain was born from a simple idea: making rewards easy for everyone.
            </p>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto space-y-12">
            {/* About Us Story */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm p-8 md:p-12 space-y-8">
              <div className="text-lg text-gray-700 leading-loose space-y-6">
                <p>
                  SnapGain was created in the UK by a frequent traveller and expert rewards-seeker who always struggled to quickly compare cashback rates, loyalty points, and gift card promotions.
                </p>
                <p className="border-l-4 border-[#7D4DFB] pl-6 text-xl font-medium text-gray-800">
                  Despite always looking for the smartest way to pay, we found ourselves spending too much time juggling different apps, comparing rates manually, and ultimately missing better deals.
                </p>
                <p>
                  Determined to change that, she imagined a single, smart tool that could bring together all the cashback apps, airline points, and bank offers in one place, instantly showing the best way to pay.
                  That's how SnapGain was born: a fast and intuitive app that empowers users to make smarter choices and save both time and money.
                </p>
                <p className="font-semibold text-gray-900">
                  Today, SnapGain is more than just a tool—it's a new way to live and shop intelligently.
                </p>
              </div>
            </Card>

            {/* Mission & Vision */}
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] bg-clip-text text-transparent">
                Our Mission & Vision
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Mission */}
                <Card className="p-8 bg-gradient-to-br from-purple-50 to-white border-2 border-purple-100">
                  <h3 className="text-2xl font-bold text-[#7D4DFB] mb-4">Mission</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Our mission is to make reward-based shopping accessible, transparent and fun. We envision a world where consumers always buy smarter, with confidence and clarity, in just a few taps.
                  </p>
                </Card>

                {/* Vision */}
                <Card className="p-8 bg-gradient-to-br from-pink-50 to-white border-2 border-pink-100">
                  <h3 className="text-2xl font-bold text-[#FF3FCE] mb-4">Vision</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We envision a world where deciding how to pay is no longer a chore. A world where every purchase — whether your morning coffee or your next holiday flight — earns you the best possible return. With SnapGain, buying smarter and with confidence is just a tap away.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AboutPage;