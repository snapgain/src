import React from 'react';
import { Helmet } from 'react-helmet';

function TermsOfServicePage() {
  return (
    <>
      <Helmet>
        <title>Terms of Service - SnapGain</title>
      </Helmet>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto prose lg:prose-xl">
          <h1>Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

          <h2>1. Agreement to Terms</h2>
          <p>By using the SnapGain application ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service.</p>

          <h2>2. The Service</h2>
          <p>SnapGain provides users with real-time comparisons of financial returns from cashback platforms, loyalty programs, and gift cards. The service is for informational purposes only. All calculations are estimates based on data from third-party sources.</p>

          <h2>3. Affiliate Disclosure</h2>
          <p>SnapGain participates in affiliate marketing programs. When you click on links to various merchants on this site and make a purchase, this can result in a commission that is credited to this site. This helps support our work but does not affect the price you pay or the data we present.</p>

          <h2>4. Disclaimer of Warranty</h2>
          <p>The Service is provided "as is." SnapGain makes no warranty or representation that the information provided will be accurate, reliable, or current. We are not an official partner of any platform displayed and rely on public or affiliate data. You are responsible for verifying all offers and terms on the partner's website before making any transaction.</p>

          <h2>5. Limitation of Liability</h2>
          <p>In no event shall SnapGain be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>

          <h2>6. Governing Law</h2>
          <p>These Terms shall be governed by the laws of the United Kingdom, without regard to its conflict of law provisions.</p>
        </div>
      </div>
    </>
  );
}

export default TermsOfServicePage;