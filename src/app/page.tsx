"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Layout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home as HomeIcon, 
  Building2, 
  Scale, 
  MessageSquare, 
  Users, 
  Shield, 
  Play,
  ClipboardList,
  Calendar,
  FileText,
  ShieldCheck
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { useI18n } from "@/components/i18n-provider";

/**
 * TALHub Homepage Component
 * 
 * High-conversion landing page for Quebec TAL case management
 * Follows UNIX principles: single responsibility, clear content, simple design
 * Now uses unified i18n system for bilingual support
 */

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { t } = useI18n();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <Layout>
        <div className="container py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>{t('common.loading')}</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Don't render if user is authenticated (will redirect)
  if (user) {
    return null;
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                {t('pages.home.hero.headline')}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                {t('pages.home.hero.subheadline')}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="text-lg px-8 py-6" onClick={() => router.push('/auth/sign-in')}>
                {t('pages.home.hero.ctaPrimary')}
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                <Play className="h-5 w-5 mr-2" />
                {t('pages.home.hero.ctaSecondary')}
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {Array.isArray(t('pages.home.hero.trustBadges')) && (t('pages.home.hero.trustBadges') as string[]).map((badge: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  <Shield className="h-3 w-3 mr-1" />
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Empathy Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-16">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">
                {t('pages.home.problem.headline')}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t('pages.home.problem.subcopy')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {Array.isArray(t('pages.home.problem.cards')) && (t('pages.home.problem.cards') as unknown as { title: string; description: string }[]).map((card: { title: string; description: string }, index: number) => {
                const icons = [HomeIcon, Building2, Scale];
                const Icon = icons[index] || HomeIcon;
                return (
                  <Card key={index} className="text-center p-8">
                    <CardContent className="space-y-4">
                      <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold">{card.title}</h3>
                      <p className="text-muted-foreground">{card.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-16">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">
                {t('pages.home.features.headline')}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t('pages.home.features.subheadline')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(t('pages.home.features.cards')) && (t('pages.home.features.cards') as unknown as { title: string; description: string }[]).map((card: { title: string; description: string }, index: number) => {
                const icons = [ClipboardList, MessageSquare, Calendar, Users, ShieldCheck, FileText];
                const Icon = icons[index] || ClipboardList;
                return (
                  <Card key={index} className="h-full">
                    <CardContent className="p-8 space-y-6 h-full flex flex-col">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 space-y-3 text-center">
                        <h3 className="text-xl font-semibold leading-tight">{card.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{card.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              {t('pages.home.cta.headline')}
            </h2>
            <p className="text-xl opacity-90">
              {t('pages.home.cta.subheadline')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              onClick={() => router.push('/auth/sign-in')}
            >
              {t('pages.home.cta.ctaPrimary')}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              {t('pages.home.cta.ctaSecondary')}
            </Button>
          </div>

          <p className="text-sm opacity-75">
            {t('pages.home.cta.trustNote')}
          </p>
        </div>
      </section>
    </Layout>
  );
}