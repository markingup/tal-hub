"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Layout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home as HomeIcon, 
  Building2, 
  Scale, 
  FileText, 
  MessageSquare, 
  Calendar, 
  Users, 
  Shield, 
  CheckCircle, 
  Play,
  Star,
  Globe
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";

/**
 * TALHub Homepage Component
 * 
 * High-conversion landing page for Quebec TAL case management
 * Follows UNIX principles: single responsibility, clear content, simple design
 */

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [language, setLanguage] = useState<'en' | 'fr'>('en');

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
              <p>Loading...</p>
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

  const content = {
    en: {
      hero: {
        headline: "Manage your TAL case with confidence.",
        subheadline: "TALHub helps tenants, landlords, and lawyers in Quebec organize their housing cases, deadlines, and documents — all in one place.",
        ctaPrimary: "Get Started Free",
        ctaSecondary: "Watch a 1-minute demo",
        trustBadges: ["Data stored in Canada", "RLS secure by design", "Not affiliated with the TAL — built for clarity."]
      },
      problem: {
        headline: "Housing disputes shouldn't feel impossible to manage.",
        subcopy: "The TAL process can be stressful, disorganized, and confusing. We make it easier for everyone involved.",
        cards: [
          {
            icon: HomeIcon,
            title: "Tenants",
            description: "Track your case, upload evidence, and get guidance every step of the way."
          },
          {
            icon: Building2,
            title: "Landlords", 
            description: "Stay compliant, manage communications, and reach fair settlements faster."
          },
          {
            icon: Scale,
            title: "Lawyers",
            description: "Centralize client cases, automate documents, and get paid on time."
          }
        ]
      },
      features: {
        headline: "Built for the TAL process from start to finish.",
        subheadline: "Every document, message, and deadline — organized automatically.",
        items: [
          { icon: FileText, title: "Case Dashboard", description: "See all your active cases in one place" },
          { icon: FileText, title: "Document Vault", description: "Upload and tag your lease, photos, receipts" },
          { icon: MessageSquare, title: "Secure Messaging", description: "Communicate with lawyers or the other party" },
          { icon: Calendar, title: "Deadline Tracker", description: "Never miss a TAL date again" },
          { icon: FileText, title: "Form Generator", description: "Create compliant notices and forms in clicks" },
          { icon: Users, title: "Lawyer Collaboration", description: "Invite or hire a lawyer directly" }
        ]
      },
      testimonials: {
        headline: "Real cases. Real relief.",
        quotes: [
          { text: "I finally understood what to expect at the TAL.", author: "Tenant, Montreal" },
          { text: "My landlord and I reached a settlement in days, not months.", author: "Tenant, Laval" },
          { text: "Helps me keep track of 20+ client cases easily.", author: "Lawyer, Sherbrooke" }
        ]
      },
      pricing: {
        headline: "Flexible plans for every situation.",
        plans: [
          { name: "Free Plan", price: "Free", features: ["1 active case", "100 MB storage", "Basic tools"] },
          { name: "Pro Plan", price: "$9/month", features: ["Unlimited cases", "Document automation", "AI assistant"] },
          { name: "Lawyer Suite", price: "$39/month", features: ["Client management", "Payments", "Analytics"] }
        ]
      },
      faq: {
        headline: "Frequently Asked Questions",
        items: [
          {
            question: "Is TALHub affiliated with the TAL?",
            answer: "No. We're an independent platform built to help you manage your own case."
          },
          {
            question: "Is my data secure?",
            answer: "Yes. Everything is encrypted and stored in Canada."
          },
          {
            question: "Can I invite my landlord or lawyer?",
            answer: "Yes. You can add them directly to your case."
          }
        ]
      },
      finalCta: {
        headline: "Bring order to your TAL case today.",
        button: "Create your free account",
        subtext: "It takes under 2 minutes to start. No commitment."
      }
    },
    fr: {
      hero: {
        headline: "Gérez votre dossier TAL en toute confiance.",
        subheadline: "TALHub aide les locataires, propriétaires et avocats du Québec à organiser leurs dossiers de logement, échéances et documents — tout en un seul endroit.",
        ctaPrimary: "Commencer gratuitement",
        ctaSecondary: "Regarder une démo d'1 minute",
        trustBadges: ["Données stockées au Canada", "Sécurité RLS intégrée", "Non affilié au TAL — conçu pour la clarté."]
      },
      problem: {
        headline: "Les différends en logement ne devraient pas sembler impossibles à gérer.",
        subcopy: "Le processus TAL peut être stressant, désorganisé et confus. Nous le rendons plus facile pour tous les intervenants.",
        cards: [
          {
            icon: HomeIcon,
            title: "Locataires",
            description: "Suivez votre dossier, téléversez des preuves et obtenez des conseils à chaque étape."
          },
          {
            icon: Building2,
            title: "Propriétaires",
            description: "Respectez la conformité, gérez les communications et atteignez des règlements équitables plus rapidement."
          },
          {
            icon: Scale,
            title: "Avocats",
            description: "Centralisez les dossiers clients, automatisez les documents et soyez payé à temps."
          }
        ]
      },
      features: {
        headline: "Conçu pour le processus TAL du début à la fin.",
        subheadline: "Chaque document, message et échéance — organisés automatiquement.",
        items: [
          { icon: FileText, title: "Tableau de bord", description: "Voyez tous vos dossiers actifs en un seul endroit" },
          { icon: FileText, title: "Coffre-fort de documents", description: "Téléversez et étiquetez votre bail, photos, reçus" },
          { icon: MessageSquare, title: "Messagerie sécurisée", description: "Communiquez avec les avocats ou l'autre partie" },
          { icon: Calendar, title: "Suivi des échéances", description: "Ne manquez plus jamais une date TAL" },
          { icon: FileText, title: "Générateur de formulaires", description: "Créez des avis et formulaires conformes en quelques clics" },
          { icon: Users, title: "Collaboration avocat", description: "Invitez ou embauchez un avocat directement" }
        ]
      },
      testimonials: {
        headline: "Vrais dossiers. Vrai soulagement.",
        quotes: [
          { text: "J'ai finalement compris à quoi m'attendre au TAL.", author: "Locataire, Montréal" },
          { text: "Mon propriétaire et moi avons conclu un règlement en jours, pas en mois.", author: "Locataire, Laval" },
          { text: "M'aide à suivre facilement plus de 20 dossiers clients.", author: "Avocat, Sherbrooke" }
        ]
      },
      pricing: {
        headline: "Plans flexibles pour chaque situation.",
        plans: [
          { name: "Plan gratuit", price: "Gratuit", features: ["1 dossier actif", "100 Mo de stockage", "Outils de base"] },
          { name: "Plan Pro", price: "9$/mois", features: ["Dossiers illimités", "Automatisation des documents", "Assistant IA"] },
          { name: "Suite Avocat", price: "39$/mois", features: ["Gestion des clients", "Paiements", "Analytiques"] }
        ]
      },
      faq: {
        headline: "Questions fréquemment posées",
        items: [
          {
            question: "TALHub est-il affilié au TAL?",
            answer: "Non. Nous sommes une plateforme indépendante conçue pour vous aider à gérer votre propre dossier."
          },
          {
            question: "Mes données sont-elles sécurisées?",
            answer: "Oui. Tout est chiffré et stocké au Canada."
          },
          {
            question: "Puis-je inviter mon propriétaire ou avocat?",
            answer: "Oui. Vous pouvez les ajouter directement à votre dossier."
          }
        ]
      },
      finalCta: {
        headline: "Apportez l'ordre à votre dossier TAL aujourd'hui.",
        button: "Créer votre compte gratuit",
        subtext: "Cela prend moins de 2 minutes pour commencer. Aucun engagement."
      }
    }
  };

  const t = content[language];

  return (
    <Layout>
      {/* Language Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm border rounded-lg px-3 py-2">
          <Globe className="h-4 w-4" />
          <button
            onClick={() => setLanguage('en')}
            className={`text-sm px-2 py-1 rounded ${language === 'en' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('fr')}
            className={`text-sm px-2 py-1 rounded ${language === 'fr' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
          >
            FR
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                {t.hero.headline}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                {t.hero.subheadline}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="text-lg px-8 py-6" onClick={() => router.push('/auth/sign-in')}>
                {t.hero.ctaPrimary}
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                <Play className="h-5 w-5 mr-2" />
                {t.hero.ctaSecondary}
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {t.hero.trustBadges.map((badge, index) => (
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
          <div className="text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">
                {t.problem.headline}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t.problem.subcopy}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {t.problem.cards.map((card, index) => (
                <Card key={index} className="text-center p-6">
                  <CardContent className="space-y-4">
                    <div className="flex justify-center">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <card.icon className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">{card.title}</h3>
                      <p className="text-muted-foreground">{card.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product Overview */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">
                {t.features.headline}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t.features.subheadline}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {t.features.items.map((feature, index) => (
                <Card key={index} className="p-6">
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="pt-8">
              <Button size="lg" className="text-lg px-8 py-6" onClick={() => router.push('/auth/sign-in')}>
                Start Free – No Credit Card Required
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshot Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              {language === 'en' ? 'See how it works.' : 'Voyez comment ça fonctionne.'}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {language === 'en' ? 'Stay organized, secure, and ready.' : 'Restez organisé, sécurisé et prêt.'}
            </p>
            
            <div className="bg-muted/50 rounded-lg p-8 border-2 border-dashed border-muted-foreground/20">
              <div className="text-muted-foreground">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">
                  {language === 'en' ? 'Dashboard mockup placeholder' : 'Aperçu du tableau de bord'}
                </p>
                <p className="text-sm mt-2">
                  {language === 'en' ? 'Interactive case timeline, chat, and document list coming soon' : 'Chronologie de dossier interactive, chat et liste de documents bientôt disponibles'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              {t.testimonials.headline}
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {t.testimonials.quotes.map((quote, index) => (
                <Card key={index} className="p-6">
                  <CardContent className="space-y-4">
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-lg italic">
                      &ldquo;{quote.text}&rdquo;
                    </blockquote>
                    <footer className="text-sm text-muted-foreground">
                      — {quote.author}
                    </footer>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              {t.pricing.headline}
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {t.pricing.plans.map((plan, index) => (
                <Card key={index} className={`p-6 ${index === 1 ? 'border-primary shadow-lg scale-105' : ''}`}>
                  <CardContent className="space-y-6">
                    <div className="text-center space-y-2">
                      <h3 className="text-xl font-semibold">{plan.name}</h3>
                      <div className="text-3xl font-bold">{plan.price}</div>
                    </div>
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full" 
                      variant={index === 1 ? 'default' : 'outline'}
                      onClick={() => router.push('/auth/sign-in')}
                    >
                      {language === 'en' ? 'Get Started' : 'Commencer'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <p className="text-sm text-muted-foreground">
              {language === 'en' ? 'No credit card required' : 'Aucune carte de crédit requise'}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              {t.faq.headline}
            </h2>

            <div className="space-y-6">
              {t.faq.items.map((item, index) => (
                <Card key={index} className="p-6">
                  <CardContent className="space-y-4">
                    <h3 className="text-lg font-semibold">{item.question}</h3>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            {t.finalCta.headline}
          </h2>
          <Button 
            size="lg" 
            variant="secondary" 
            className="text-lg px-8 py-6"
            onClick={() => router.push('/auth/sign-in')}
          >
            {t.finalCta.button}
          </Button>
          <p className="text-primary-foreground/80">
            {t.finalCta.subtext}
          </p>
        </div>
      </section>
    </Layout>
  );
}
