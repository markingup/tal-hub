import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, Users, MessageCircle, FileText, Calendar, Zap, Heart, Mail, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About TALHub - Tenant-Landlord Dispute Management',
  description: 'Learn about TALHub, the comprehensive platform for managing tenant-landlord disputes with transparency, security, and efficiency.',
}

export default function AboutPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About TALHub</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Empowering tenants and landlords with transparent, secure, and efficient dispute management tools.
        </p>
      </div>

      {/* Mission Statement */}
      <Card className="mb-8">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl mb-4">Our Mission</CardTitle>
          <CardDescription className="text-lg">
            TALHub was created to address the complexity and inefficiency that often characterizes tenant-landlord disputes. 
            We believe that transparency, clear communication, and organized documentation can resolve conflicts more 
            effectively than traditional adversarial approaches.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="text-center p-6 border rounded-lg">
              <Heart className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Fair Resolution</h3>
              <p className="text-muted-foreground">
                We promote fair and transparent dispute resolution processes that benefit all parties involved.
              </p>
            </div>
            <div className="text-center p-6 border rounded-lg">
              <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Secure Platform</h3>
              <p className="text-muted-foreground">
                Your data and communications are protected with enterprise-grade security and privacy controls.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Overview */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-center mb-8">Platform Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Case Management</CardTitle>
              <CardDescription>
                Organize disputes with structured case files, participant management, and role-based access control.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Document Sharing</CardTitle>
              <CardDescription>
                Securely upload, organize, and share lease agreements, notices, photos, and legal documents.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <MessageCircle className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Real-time Messaging</CardTitle>
              <CardDescription>
                Communicate with all case participants through secure, real-time messaging channels.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Calendar className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Deadline Tracking</CardTitle>
              <CardDescription>
                Stay on top of important dates, hearings, and deadlines with automated reminders and notifications.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Role-based Access</CardTitle>
              <CardDescription>
                Secure access controls ensure only authorized participants can view case information and documents.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Modern Technology</CardTitle>
              <CardDescription>
                Built with modern web technologies for fast, reliable, and mobile-friendly user experience.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Security & Privacy */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Security & Privacy</CardTitle>
          <CardDescription>
            Your trust is our priority. We implement industry-leading security measures to protect your data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Data Protection</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• End-to-end encryption for all communications</li>
                <li>• Secure file storage with access controls</li>
                <li>• Regular security audits and updates</li>
                <li>• Compliance with privacy regulations</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Access Control</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Role-based permissions for all users</li>
                <li>• Secure authentication with magic links</li>
                <li>• Audit trails for all platform activities</li>
                <li>• Data retention and deletion policies</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technology Stack */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Built with Modern Technology</CardTitle>
          <CardDescription>
            TALHub leverages cutting-edge web technologies to deliver a fast, secure, and reliable experience.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Frontend</h3>
              <p className="text-sm text-muted-foreground">
                Next.js 15, TypeScript, Tailwind CSS, React Query
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Backend</h3>
              <p className="text-sm text-muted-foreground">
                Supabase, PostgreSQL, Row Level Security
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Security</h3>
              <p className="text-sm text-muted-foreground">
                Magic Link Auth, RLS Policies, Encrypted Storage
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Get in Touch</CardTitle>
          <CardDescription>
            Have questions about TALHub? We're here to help.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-sm text-muted-foreground">support@talhub.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Phone Support</p>
                  <p className="text-sm text-muted-foreground">1-800-TAL-HUB (1-800-825-482)</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <Button className="w-full" asChild>
                <a href="/help">Visit Help Center</a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="/auth/sign-in">Get Started</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
