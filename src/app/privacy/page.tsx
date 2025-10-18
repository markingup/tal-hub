import { LegalDisclaimer } from "@/components/legal-disclaimer";
import { Layout } from "@/components/layout";

export default function PrivacyPage() {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="prose prose-gray max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
          <p className="text-muted-foreground">
            We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.
          </p>
          <div className="mt-3">
            <h3 className="text-lg font-medium mb-2">Personal Information</h3>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Name and email address</li>
              <li>Account credentials</li>
              <li>Profile information</li>
              <li>Communication preferences</li>
            </ul>
          </div>
          <div className="mt-3">
            <h3 className="text-lg font-medium mb-2">Usage Information</h3>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Log data (IP address, browser type, pages visited)</li>
              <li>Device information</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
          <p className="text-muted-foreground">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send technical notices, updates, and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Monitor and analyze trends and usage</li>
            <li>Detect, investigate, and prevent security incidents</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. Information Sharing</h2>
          <p className="text-muted-foreground">
            We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
            <li>With your explicit consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and prevent fraud</li>
            <li>With service providers who assist us in operating our platform</li>
            <li>In connection with a business transfer or acquisition</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
          <p className="text-muted-foreground">
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Cookies and Tracking</h2>
          <p className="text-muted-foreground">
            We use cookies and similar tracking technologies to enhance your experience on our platform. You can control cookie settings through your browser preferences.
          </p>
          <div className="mt-3">
            <h3 className="text-lg font-medium mb-2">Types of Cookies We Use</h3>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. Your Rights</h2>
          <p className="text-muted-foreground">
            Depending on your location, you may have certain rights regarding your personal information:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
            <li>Access to your personal information</li>
            <li>Correction of inaccurate information</li>
            <li>Deletion of your personal information</li>
            <li>Portability of your data</li>
            <li>Objection to processing</li>
            <li>Withdrawal of consent</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">7. Data Retention</h2>
          <p className="text-muted-foreground">
            We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">8. International Transfers</h2>
          <p className="text-muted-foreground">
            Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your personal information in accordance with this Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">9. Children's Privacy</h2>
          <p className="text-muted-foreground">
            Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">10. Changes to This Privacy Policy</h2>
          <p className="text-muted-foreground">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">11. Contact Us</h2>
          <p className="text-muted-foreground">
            If you have any questions about this Privacy Policy or our privacy practices, please contact us.
          </p>
        </section>
      </div>

      <div className="mt-8 pt-6 border-t">
        <LegalDisclaimer />
      </div>
    </div>
    </Layout>
  );
}
