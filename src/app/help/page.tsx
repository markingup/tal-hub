import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { HelpCircle, MessageCircle, BookOpen } from 'lucide-react'
import { Layout } from '@/components/layout'

export const metadata: Metadata = {
  title: 'Help & Support - TALHub',
  description: 'Get help with TALHub, find answers to common questions, and contact support.',
}

export default function HelpPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Help & Support</h1>
        <p className="text-muted-foreground text-lg">
          Find answers to common questions and get the help you need with TALHub.
        </p>
      </div>

      <Tabs defaultValue="getting-started" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="getting-started" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Getting Started
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Contact Us
          </TabsTrigger>
        </TabsList>

        <TabsContent value="getting-started" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to TALHub</CardTitle>
              <CardDescription>
                Learn how to get started with managing your tenant-landlord disputes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">1. Create Your Account</h3>
                <p className="text-muted-foreground mb-4">
                  Sign up using your email address. You'll receive a magic link to authenticate your account.
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Use a valid email address you check regularly</li>
                  <li>Check your spam folder if you don&apos;t receive the magic link</li>
                  <li>Your account will be created with the default "tenant" role</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">2. Set Up Your Profile</h3>
                <p className="text-muted-foreground mb-4">
                  Complete your profile with your contact information and role details.
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Add your full name and phone number</li>
                  <li>Update your role if you&apos;re a landlord or lawyer</li>
                  <li>Profile information helps other participants identify you</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">3. Create or Join a Case</h3>
                <p className="text-muted-foreground mb-4">
                  Start managing your dispute by creating a new case or joining an existing one.
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Click "New Case" to create a dispute</li>
                  <li>Add other participants (landlord, tenant, lawyer)</li>
                  <li>Set case type and initial details</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">4. Manage Your Case</h3>
                <p className="text-muted-foreground mb-4">
                  Use TALHub's tools to organize your dispute effectively.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Documents</h4>
                    <p className="text-sm text-muted-foreground">
                      Upload and share lease agreements, notices, photos, and other evidence.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Messages</h4>
                    <p className="text-sm text-muted-foreground">
                      Communicate with other participants in real-time.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Deadlines</h4>
                    <p className="text-sm text-muted-foreground">
                      Track important dates and tasks related to your case.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Consultations</h4>
                    <p className="text-sm text-muted-foreground">
                      Request legal consultations with qualified lawyers.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find answers to common questions about using TALHub.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">How do I change my role from tenant to landlord?</h3>
                  <p className="text-muted-foreground">
                    You can update your role in your profile settings. Go to your profile page and select the appropriate role from the dropdown menu.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Can I invite other people to my case?</h3>
                  <p className="text-muted-foreground">
                    Yes, you can add other participants to your case. Click "Add Participant" and enter their email address. They'll receive an invitation to join the case.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">What file types can I upload?</h3>
                  <p className="text-muted-foreground">
                    You can upload PDFs, images (JPG, PNG), documents (DOC, DOCX), and other common file types. Maximum file size is 10MB per file.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">How secure is my data?</h3>
                  <p className="text-muted-foreground">
                    TALHub uses industry-standard security measures including encryption, secure authentication, and role-based access control. Only case participants can view your information.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Can I delete a case?</h3>
                  <p className="text-muted-foreground">
                    Only the case creator can delete a case. Go to case settings and select "Delete Case" to permanently remove it.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">How do I get help with legal questions?</h3>
                  <p className="text-muted-foreground">
                    You can request a consultation with a qualified lawyer through the "Consultations" tab in your case. Lawyers can provide legal advice for a fee.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">What happens if I forget my password?</h3>
                  <p className="text-muted-foreground">
                    TALHub uses magic link authentication, so you don&apos;t need to remember a password. Simply enter your email address and check for the magic link.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Can I use TALHub on my mobile device?</h3>
                  <p className="text-muted-foreground">
                    Yes, TALHub is fully responsive and works on all devices including smartphones and tablets. You can access all features through your mobile browser.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you within 24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help you?" />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Please describe your question or issue..."
                    className="min-h-[120px]"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emergency Support</CardTitle>
              <CardDescription>
                For urgent legal matters or technical issues.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm text-red-800 dark:text-red-200">
                  <strong>Emergency:</strong> If you&apos;re facing an immediate legal threat (eviction, lockout, etc.), 
                  please contact your local legal aid office or emergency services immediately. TALHub is not a 
                  substitute for emergency legal assistance.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </Layout>
  )
}
