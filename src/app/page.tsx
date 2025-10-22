"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Star, Gift, Gamepad2, Target, Zap, Users, CheckCircle, ArrowRight, Sparkles, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useTranslations } from "next-intl"

export default function HomePage() {
  const t = useTranslations("home");
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black text-foreground mb-6 text-balance">
            {t("heroTitle1")}{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t("heroTitle2")}
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-3xl mx-auto">
            {t("heroSubtitle")}
          </p>

          <div>
            {!isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-lg px-8 py-6"
                  onClick={() => router.push("/auth/register")}
                >
                  {t("signupParent")}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6 bg-transparent"
                  onClick={() => router.push("/auth/login")}
                >
                  {t("login")}
                </Button>
              </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-lg px-8 py-6"
                    onClick={() => {
                      user?.role == "Parent" ? (
                        router.push("/parent/dashboard")
                      ) : user?.role == "Child" && (
                        router.push("/child/dashboard")
                      )
                    }}
                  >
                    {user?.role == "Parent" ? 
                        t("parentPage")
                       : user?.role == "Child" && 
                        t("childPage")
                      }
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              )
            }
          </div>
          
          

          {/* Hero Image Placeholder */}
          <div className="max-w-4xl mx-auto">
            <img
              src="/happy-family-with-parent-and-child-learning-togeth.png"
              alt="Parent and child using Learn Link together"
              className="w-full rounded-2xl shadow-2xl border-4 border-white"
            />
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">{t("whyChoose")}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("whyChooseDesc")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* For Parents */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-blue-600">{t("features.parents.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {t("features.parents.desc")}
              </p>
              <ul className="text-sm space-y-2">
                {t.raw("features.parents.list").map((item: string, i: number) => (
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  {item}
                </li>
                ))}
                {/* <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  Monitor progress
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  Set up rewards
                </li> */}
              </ul>
            </CardContent>
          </Card>

          {/* For Children */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-green-50 to-white border-2 border-green-200">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-green-600">{t("features.children.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {t("features.children.desc")}
              </p>
              <ul className="text-sm space-y-2">
                {t.raw("features.children.list").map((item: string, i: number) => (
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {item}
                </li>
                ))}
                {/* <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Earn points & badges
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Unlock rewards
                </li> */}
              </ul>
            </CardContent>
          </Card>

          {/* Gamification */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-purple-600">{t("features.gamification.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {t("features.gamification.desc")}
              </p>
              <ul className="text-sm space-y-2">
                {t.raw("features.gamification.list").map((item: string, i: number) => (
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-500" />
                  {item}
                </li>
                ))}
                {/* <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-500" />
                  Achievement badges
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-500" />
                  Progress tracking
                </li> */}
              </ul>
            </CardContent>
          </Card>

          {/* Safe & Easy */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-primary">{t("features.safe.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {t("features.safe.desc")}
              </p>
              <ul className="text-sm space-y-2">
                {t.raw("features.safe.list").map((item: string, i: number) => (
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  {item}
                </li>
                ))}
                {/* <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Kid-friendly interface
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Parental controls
                </li> */}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">{t("howItWorksTitle")}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("howItWorksDesc")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((step) => (
            <div key={step} className="text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                    step === 1 ? "bg-gradient-to-br from-blue-500 to-blue-600" :
                    step === 2 ? "bg-gradient-to-br from-green-500 to-green-600" :
                    "bg-gradient-to-br from-purple-500 to-purple-600"
                  }`}>
                {step === 1 && <Target className="w-10 h-10 text-white" />}
                {step === 2 && <Zap className="w-10 h-10 text-white" />}
                {step === 3 && <Gift className="w-10 h-10 text-white" />}
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">{t(`steps.${step}.title`)}</h3>
              <p className="text-muted-foreground">
                {t(`steps.${step}.desc`)}
              </p>
            </div>
            ))}
{/* 
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">2. Child Completes & Submits</h3>
              <p className="text-muted-foreground">
                Children complete tasks and submit proof of completion through photos, videos, or text updates.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Gift className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">3. Review & Reward</h3>
              <p className="text-muted-foreground">
                Parents review submissions, award points, and children redeem rewards from the family store.
              </p>
            </div> */}
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">{t("screenshotsTitle")}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("screenshotsDesc")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Parent View */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <Users className="w-5 h-5" />
                {t("screens.parent")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <img
                src="/learnlink_parent_dashboard_1.png"
                alt="Parent dashboard view"
                className="w-full h-64 object-cover"
              />
            </CardContent>
          </Card>

          {/* Child View */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <Star className="w-5 h-5" />
                {t("screens.child")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <img
                src="/learnlink_child_dashboard_1.png"
                alt="Child interface view"
                className="w-full h-64 object-cover"
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gradient-to-r from-orange-50 to-pink-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">{t("testimonialsTitle")}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("testimonialsDesc")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Parent Testimonial */}
            <Card className="bg-white border-2 border-blue-200">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Sarah M., Parent</h4>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground italic">
                  "{t("parentTestimonial")}"
                </p>
              </CardContent>
            </Card>

            {/* Child Testimonial */}
            <Card className="bg-white border-2 border-green-200">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Alex, Age 10</h4>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground italic">
                  "{t("childTestimonial")}"
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-primary to-secondary text-white border-0 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90"></div>
          <CardContent className="relative z-10 text-center py-16 px-8">
            <Sparkles className="w-16 h-16 mx-auto mb-6 text-white/80" />
            <h2 className="text-4xl font-bold mb-4">{t("finalCtaTitle")}</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {t("finalCtaDesc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6"
                onClick={() => router.push("/auth/register")}
              >
                {t("finalCtaStart")}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 text-lg px-8 py-6 bg-transparent"
                onClick={() => router.push("/auth/demo")}
              >
                {t("finalCtaDemo")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <Footer />
    </div>
  )
}
