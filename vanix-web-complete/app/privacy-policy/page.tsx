export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur rounded-2xl shadow-xl p-8 md:p-12 border-2 border-[#5e63b6]/20">
        <h1 className="text-4xl font-bold text-[#27296d] mb-6">Privacy Policy</h1>
        <p className="text-[#5e63b6] mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-8 text-[#27296d]">
          <section>
            <h2 className="text-2xl font-semibold text-[#27296d] mb-4">1. Introduction</h2>
            <p>
              Welcome to Vanix. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you about how we look after your personal data when you visit 
              our website and tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#27296d] mb-4">2. Information We Collect</h2>
            <p className="mb-3">We may collect, use, store and transfer different kinds of personal data about you:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-[#5e63b6]">Identity Data:</strong> includes username, name, or similar identifier</li>
              <li><strong className="text-[#5e63b6]">Contact Data:</strong> includes email address and telephone numbers</li>
              <li><strong className="text-[#5e63b6]">Technical Data:</strong> includes internet protocol (IP) address, browser type and version</li>
              <li><strong className="text-[#5e63b6]">Usage Data:</strong> includes information about how you use our website and services</li>
              <li><strong className="text-[#5e63b6]">Marketing Data:</strong> includes your preferences in receiving marketing from us</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#27296d] mb-4">3. How We Use Your Information</h2>
            <p className="mb-3">We use your personal data for the following purposes:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>To register you as a new customer</li>
              <li>To process and deliver your orders</li>
              <li>To manage our relationship with you</li>
              <li>To improve our website, products/services, and customer service</li>
              <li>To send you marketing communications (with your consent)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#27296d] mb-4">4. Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being 
              accidentally lost, used, or accessed in an unauthorized way. We limit access to your personal 
              data to those employees, agents, contractors, and other third parties who have a business need to know.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#27296d] mb-4">5. Data Retention</h2>
            <p>
              We will only retain your personal data for as long as necessary to fulfil the purposes we 
              collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#27296d] mb-4">6. Your Legal Rights</h2>
            <p className="mb-3">Under certain circumstances, you have rights under data protection laws in relation to your personal data:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Request access to your personal data</li>
              <li>Request correction of your personal data</li>
              <li>Request erasure of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request restriction of processing your personal data</li>
              <li>Request transfer of your personal data</li>
              <li>Right to withdraw consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#27296d] mb-4">7. Cookies</h2>
            <p>
              Our website uses cookies to distinguish you from other users. This helps us to provide you 
              with a good experience when you browse our website and also allows us to improve our site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#27296d] mb-4">8. Third-Party Links</h2>
            <p>
              This website may include links to third-party websites, plug-ins, and applications. Clicking 
              on those links or enabling those connections may allow third parties to collect or share data 
              about you. We do not control these third-party websites and are not responsible for their privacy statements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#27296d] mb-4">9. Contact Us</h2>
            <p className="mb-3">
              If you have any questions about this privacy policy or our privacy practices, please contact us:
            </p>
            <div className="bg-[#DCD0FF]/20 rounded-lg p-4 border-2 border-[#5e63b6]/20">
              <p className="font-semibold text-[#27296d]">Vanix</p>
              <p className="text-[#5e63b6]">Email: contact@vanix.com</p>
              <p className="text-[#5e63b6]">Phone: +1 (234) 567-890</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#27296d] mb-4">10. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes by 
              posting the new privacy policy on this page and updating the "Last updated" date at the top of this policy.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
