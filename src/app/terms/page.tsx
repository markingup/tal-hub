import { LegalDisclaimer } from "@/components/legal-disclaimer";
import { Layout } from "@/components/layout";

export default function TermsPage() {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <div className="prose prose-gray max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground">
            By accessing and using TALHub ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. Use License</h2>
          <p className="text-muted-foreground">
            Permission is granted to temporarily use TALHub for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
            <li>modify or copy the materials</li>
            <li>use the materials for any commercial purpose or for any public display</li>
            <li>attempt to reverse engineer any software contained on the website</li>
            <li>remove any copyright or other proprietary notations from the materials</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
          <p className="text-muted-foreground">
            When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Privacy Policy</h2>
          <p className="text-muted-foreground">
            Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Prohibited Uses</h2>
          <p className="text-muted-foreground">
            You may not use our Service:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
            <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
            <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
            <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
            <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
            <li>To submit false or misleading information</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. Content</h2>
          <p className="text-muted-foreground">
            Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the content that you post to the Service, including its legality, reliability, and appropriateness.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">7. Termination</h2>
          <p className="text-muted-foreground">
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">8. Disclaimer</h2>
          <p className="text-muted-foreground">
            The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, this Company excludes all representations, warranties, conditions and terms relating to our website and the use of this website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">9. Limitation of Liability</h2>
          <p className="text-muted-foreground">
            In no event shall TALHub, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">10. Governing Law</h2>
          <p className="text-muted-foreground">
            These Terms shall be interpreted and governed by the laws of the jurisdiction in which TALHub operates, without regard to its conflict of law provisions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">11. Changes to Terms</h2>
          <p className="text-muted-foreground">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">12. Contact Information</h2>
          <p className="text-muted-foreground">
            If you have any questions about these Terms of Service, please contact us.
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
