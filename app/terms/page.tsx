import { Shield, FileText, Users, AlertTriangle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Terms of 
            <span className="text-orange-600"> Service</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto">
            Please read these terms carefully before using Sanatan Blogs. 
            By using our platform, you agree to these terms.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Shield className="h-8 w-8 text-orange-600 mr-3" />
                1. Acceptance of Terms
              </h2>
                              <p className="text-gray-700 mb-4">
                  By accessing and using Sanatan Blogs (&ldquo;the Platform&rdquo;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Users className="h-8 w-8 text-orange-600 mr-3" />
                2. User Accounts and Registration
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  To access certain features of the Platform, you must register for an account. You agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate, current, and complete information during registration</li>
                  <li>Maintain and update your account information to keep it accurate</li>
                  <li>Maintain the security of your password and account</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                </ul>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="h-8 w-8 text-orange-600 mr-3" />
                3. Content Guidelines and User Conduct
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>You agree not to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Post content that is illegal, harmful, threatening, abusive, or defamatory</li>
                  <li>Infringe on intellectual property rights or privacy rights</li>
                  <li>Post spam, commercial content, or unsolicited promotional material</li>
                  <li>Impersonate others or misrepresent your identity</li>
                  <li>Attempt to gain unauthorized access to the Platform or other users&apos; accounts</li>
                  <li>Use automated systems to access the Platform without permission</li>
                  <li>Interfere with the proper functioning of the Platform</li>
                </ul>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <AlertTriangle className="h-8 w-8 text-orange-600 mr-3" />
                4. Content Moderation and Approval
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Sanatan Blogs maintains a content approval system to ensure quality and community standards:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All blog posts require admin approval before publication</li>
                  <li>We reserve the right to reject, edit, or remove content that violates our guidelines</li>
                  <li>Decisions regarding content approval are at our sole discretion</li>
                  <li>We may temporarily or permanently suspend accounts for policy violations</li>
                </ul>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                5. Intellectual Property Rights
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  By posting content on Sanatan Blogs, you retain ownership of your intellectual property. However, you grant us a worldwide, non-exclusive, royalty-free license to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Display, reproduce, and distribute your content on the Platform</li>
                  <li>Use your content for promotional purposes related to the Platform</li>
                  <li>Modify your content as necessary for technical requirements</li>
                </ul>
                <p>
                  You represent that you have the right to grant these licenses and that your content does not infringe on any third-party rights.
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                6. Privacy and Data Protection
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms of Service.
                </p>
                <p>
                  By using the Platform, you consent to the collection and use of your information as described in our Privacy Policy.
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                7. Disclaimers and Limitations
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  The Platform is provided &ldquo;as is&rdquo; without warranties of any kind. We disclaim all warranties, express or implied, including but not limited to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Warranties of merchantability and fitness for a particular purpose</li>
                  <li>Warranties that the Platform will be uninterrupted or error-free</li>
                  <li>Warranties regarding the accuracy or reliability of content</li>
                </ul>
                <p>
                  In no event shall Sanatan Blogs be liable for any indirect, incidental, special, or consequential damages arising from your use of the Platform.
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                8. Termination
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  We may terminate or suspend your account and access to the Platform at any time, with or without cause, with or without notice. You may terminate your account at any time by contacting us.
                </p>
                <p>
                  Upon termination, your right to use the Platform will cease immediately, and we may delete your account and content.
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                9. Changes to Terms
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  We reserve the right to modify these Terms of Service at any time. We will notify users of significant changes by posting the new terms on the Platform and updating the &ldquo;Last updated&rdquo; date.
                </p>
                <p>
                  Your continued use of the Platform after changes become effective constitutes acceptance of the new terms.
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                10. Governing Law and Jurisdiction
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  These Terms of Service shall be governed by and construed in accordance with the laws of [Your Jurisdiction]. Any disputes arising from these terms or your use of the Platform shall be subject to the exclusive jurisdiction of the courts in [Your Jurisdiction].
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                11. Contact Information
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="font-semibold">Sanatan Blogs</p>
                  <p>Email: admin@sanatanblogs.com</p>
                  <p>Address: [Your Business Address]</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-orange-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            Questions About Our Terms?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            If you have any questions or concerns about these terms, 
            we&apos;re here to help. Contact our support team for clarification.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:admin@sanatanblogs.com"
              className="inline-flex items-center px-8 py-3 bg-white text-orange-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Support
            </a>
            <a
              href="/privacy"
              className="inline-flex items-center px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </section>
    </div>
  );
} 