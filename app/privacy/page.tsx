import { Shield, Eye, Lock, Database, Mail, Globe } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Privacy 
            <span className="text-orange-600"> Policy</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto">
            We respect your privacy and are committed to protecting your personal information. 
            This policy explains how we collect, use, and safeguard your data.
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

      {/* Privacy Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Shield className="h-8 w-8 text-orange-600 mr-3" />
                1. Information We Collect
              </h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Information</h3>
                <p>We collect information you provide directly to us, including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Name, email address, and username during registration</li>
                  <li>Profile information, bio, and avatar images</li>
                  <li>Blog posts, comments, and other content you create</li>
                  <li>Communication preferences and newsletter subscriptions</li>
                  <li>Contact information when you reach out to us</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Automatically Collected Information</h3>
                <p>When you use our Platform, we automatically collect:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>IP address and device information</li>
                  <li>Browser type and operating system</li>
                  <li>Pages visited and time spent on the Platform</li>
                  <li>Click patterns and navigation behavior</li>
                  <li>Error logs and performance data</li>
                </ul>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Eye className="h-8 w-8 text-orange-600 mr-3" />
                2. How We Use Your Information
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide, maintain, and improve our Platform services</li>
                  <li>Process your registration and manage your account</li>
                  <li>Display your content and profile to other users</li>
                  <li>Send you important updates about our services</li>
                  <li>Respond to your comments, questions, and support requests</li>
                  <li>Monitor and analyze Platform usage and trends</li>
                  <li>Prevent fraud and ensure Platform security</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Database className="h-8 w-8 text-orange-600 mr-3" />
                3. Information Sharing and Disclosure
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:</p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Public Content</h3>
                <p>Your blog posts, comments, and public profile information are visible to other Platform users and may be indexed by search engines.</p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Service Providers</h3>
                <p>We may share information with trusted third-party service providers who assist us in operating our Platform, such as:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Cloud hosting and storage providers</li>
                  <li>Email service providers</li>
                  <li>Analytics and monitoring services</li>
                  <li>Payment processors (if applicable)</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Legal Requirements</h3>
                <p>We may disclose your information if required by law or in response to valid legal requests, such as subpoenas or court orders.</p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Business Transfers</h3>
                <p>In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the business transaction.</p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Lock className="h-8 w-8 text-orange-600 mr-3" />
                4. Data Security
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>We implement appropriate technical and organizational measures to protect your personal information:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Secure password hashing and authentication</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication requirements</li>
                  <li>Monitoring for suspicious activities</li>
                </ul>
                <p>
                  However, no method of transmission over the internet or electronic storage is 100% secure. 
                  While we strive to protect your information, we cannot guarantee absolute security.
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Globe className="h-8 w-8 text-orange-600 mr-3" />
                5. Cookies and Tracking Technologies
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>We use cookies and similar tracking technologies to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Remember your preferences and login status</li>
                  <li>Analyze Platform usage and performance</li>
                  <li>Provide personalized content and features</li>
                  <li>Improve user experience and functionality</li>
                </ul>
                <p>
                  You can control cookie settings through your browser preferences. 
                  However, disabling cookies may affect Platform functionality.
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                6. Your Rights and Choices
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>You have the following rights regarding your personal information:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Access:</strong> Request a copy of your personal information</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                  <li><strong>Objection:</strong> Object to certain processing of your data</li>
                  <li><strong>Withdrawal:</strong> Withdraw consent for data processing</li>
                </ul>
                <p>
                  To exercise these rights, please contact us using the information provided below.
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                7. Data Retention
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  We retain your personal information for as long as necessary to provide our services 
                  and fulfill the purposes outlined in this policy. Specific retention periods include:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Account information: Until account deletion or 3 years of inactivity</li>
                  <li>Blog posts and comments: Until account deletion or content removal</li>
                  <li>Log data: 12 months for security and debugging purposes</li>
                  <li>Marketing communications: Until you unsubscribe</li>
                </ul>
                <p>
                  We may retain certain information for longer periods if required by law or 
                  for legitimate business purposes.
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                8. Children&apos;s Privacy
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Our Platform is not intended for children under 13 years of age. 
                  We do not knowingly collect personal information from children under 13.
                </p>
                <p>
                  If you are a parent or guardian and believe your child has provided us with 
                  personal information, please contact us immediately.
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                9. International Data Transfers
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Your information may be transferred to and processed in countries other than your own. 
                  We ensure appropriate safeguards are in place to protect your data during such transfers.
                </p>
                <p>
                  If you are located in the European Economic Area (EEA), we rely on adequacy decisions 
                  or standard contractual clauses for international data transfers.
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                10. Changes to This Policy
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any 
                  material changes by posting the new policy on our Platform and updating the &ldquo;Last updated&rdquo; date.
                </p>
                <p>
                  Your continued use of the Platform after changes become effective constitutes 
                  acceptance of the updated policy.
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Mail className="h-8 w-8 text-orange-600 mr-3" />
                11. Contact Us
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  If you have any questions about this Privacy Policy or our data practices, 
                  please contact us:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="font-semibold">Sanatan Blogs</p>
                  <p>Email: admin@sanatanblogs.com</p>
                  <p>Address: [Your Business Address]</p>
                  <p className="mt-4">
                    For privacy-related inquiries, please include &ldquo;Privacy Policy&rdquo; in the subject line.
                  </p>
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
            Questions About Your Privacy?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            We&apos;re committed to transparency and protecting your privacy. 
            Contact us if you have any questions about how we handle your data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:admin@sanatanblogs.com"
              className="inline-flex items-center px-8 py-3 bg-white text-orange-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Privacy Team
            </a>
            <a
              href="/terms"
              className="inline-flex items-center px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </section>
    </div>
  );
} 