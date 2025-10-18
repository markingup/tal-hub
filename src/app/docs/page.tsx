import { Metadata } from 'next'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen, 
  Code, 
  Database, 
  Globe,
  Terminal,
  Layers
} from 'lucide-react'
import { OverviewSection } from '@/components/docs/overview-section'
import { ArchitectureSection } from '@/components/docs/architecture-section'
import { ApiSection } from '@/components/docs/api-section'
import { DatabaseSection } from '@/components/docs/database-section'
import { DevelopmentSection } from '@/components/docs/development-section'
import { DeploymentSection } from '@/components/docs/deployment-section'

export const metadata: Metadata = {
  title: 'Documentation - TALHub',
  description: 'Technical documentation, API reference, and development guides for TALHub.',
}

export default function DocsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">TALHub Documentation</h1>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          Comprehensive technical documentation for developers, contributors, and system administrators working with TALHub.
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="architecture" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            <span className="hidden sm:inline">Architecture</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            <span className="hidden sm:inline">API</span>
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Database</span>
          </TabsTrigger>
          <TabsTrigger value="development" className="flex items-center gap-2">
            <Terminal className="h-4 w-4" />
            <span className="hidden sm:inline">Development</span>
          </TabsTrigger>
          <TabsTrigger value="deployment" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Deploy</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OverviewSection />
        </TabsContent>

        <TabsContent value="architecture" className="space-y-6">
          <ArchitectureSection />
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <ApiSection />
        </TabsContent>

        <TabsContent value="database" className="space-y-6">
          <DatabaseSection />
        </TabsContent>

        <TabsContent value="development" className="space-y-6">
          <DevelopmentSection />
        </TabsContent>

        <TabsContent value="deployment" className="space-y-6">
          <DeploymentSection />
        </TabsContent>
      </Tabs>
    </div>
  )
}
