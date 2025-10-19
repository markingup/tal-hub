import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, Users, MessageCircle, FileText, Calendar, Zap, Heart, CheckCircle, Bolt, Lock, Database, UserCheck, FileCheck, Scale, FolderOpen, Clock } from 'lucide-react'
import { Layout } from '@/components/layout'

export const metadata: Metadata = {
  title: 'About TALHub - Tenant-Landlord Dispute Management',
  description: 'Learn about TALHub, the comprehensive platform for managing tenant-landlord disputes with transparency, security, and efficiency.',
}

export default function AboutPage() {
  return (
    <Layout>
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
            TALHub exists to make housing disputes simpler, fairer, and less stressful for everyone.
            We believe that clear information, open communication, and organized documentation lead to faster, more balanced outcomes — without unnecessary conflict.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="text-center p-6 border rounded-lg">
              <Scale className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Fair Resolution</h3>
              <p className="text-muted-foreground">
                We help tenants and landlords reach solutions through transparency and collaboration, not confusion or confrontation.
              </p>
            </div>
            <div className="text-center p-6 border rounded-lg">
              <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Trust & Security</h3>
              <p className="text-muted-foreground">
                Your case data and communications are protected with the same standards trusted by legal and housing institutions across Canada.
              </p>
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-lg font-medium">
              Built to empower both sides — with clarity, fairness, and respect.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Features Overview */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-center mb-4">Platform Features</h2>
        <p className="text-center text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
          Everything you need to manage your housing case — organized, transparent, and secure.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <FolderOpen className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Case Management</CardTitle>
              <CardDescription>
                Keep every detail in one place — from participant info to communication history — with role-based permissions for secure collaboration.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Document Sharing</CardTitle>
              <CardDescription>
                Upload and organize leases, notices, photos, and legal files safely. Share them only with those who need access.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <MessageCircle className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Real-Time Messaging</CardTitle>
              <CardDescription>
                Communicate directly with participants through secure, time-stamped chat threads — no lost emails or confusion.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Clock className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Deadline Tracking</CardTitle>
              <CardDescription>
                Never miss a key date again. Get reminders for hearings, filings, and important case milestones.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Security & Privacy</CardTitle>
              <CardDescription>
                Your data stays encrypted and protected by strict access controls and Canadian-hosted servers.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Modern, Secure, and Effortless</CardTitle>
              <CardDescription>
                Built to make managing your housing case simple, fast, and worry-free — so you can focus on resolution, not red tape.
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
            Your trust matters. TALHub protects your information with the same level of care used by professional legal and housing systems — keeping your documents and communications safe at every step.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <Database className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="text-lg font-semibold mb-3">Your Data, Protected</h3>
              <p className="text-sm text-muted-foreground">
                All files and messages are encrypted end-to-end and stored securely on Canadian servers. Only you and authorized parties can access them.
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <UserCheck className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="text-lg font-semibold mb-3">Controlled Access</h3>
              <p className="text-sm text-muted-foreground">
                Each user has clear, role-based permissions — ensuring only the right people see the right information.
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <FileCheck className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="text-lg font-semibold mb-3">Transparency & Accountability</h3>
              <p className="text-sm text-muted-foreground">
                Every action is logged for traceability, and you can request deletion of your data anytime under our privacy policy.
              </p>
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-lg font-medium">
              Secure by design. Private by default.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Modern, Secure, and Effortless */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Modern, Secure, and Effortless</CardTitle>
          <CardDescription>
            TALHub is built to make managing your housing case simple, fast, and worry-free.
            Behind the scenes, we use trusted, modern tools so you can focus on what matters — your case.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <CheckCircle className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-2">Private and Encrypted</h3>
              <p className="text-sm text-muted-foreground">
                Your documents and data stay fully protected
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Bolt className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-2">Fast and Reliable</h3>
              <p className="text-sm text-muted-foreground">
                Instant updates and smooth performance across devices
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Lock className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-2">Secure Access</h3>
              <p className="text-sm text-muted-foreground">
                Password-free login and verified user authentication
              </p>
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-lg font-medium">
              Safe. Efficient. Built for real tenants and landlords.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Get in Touch</CardTitle>
          <CardDescription>
            Have questions about TALHub? We&apos;re here to help.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button className="w-full" asChild>
              <a href="/help">Visit Help Center</a>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <a href="/auth/sign-in">Get Started</a>
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </Layout>
  )
}
