import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Star, Gift, Gamepad2, Target, Zap, Users, CheckCircle, ArrowRight, Sparkles, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black text-foreground mb-6 text-balance">
            Connect Learning.{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Strengthen Bonds.
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-3xl mx-auto">
            Learn Link helps parents guide children's learning with tasks, rewards, and fun challenges. Turn everyday
            learning into an exciting adventure for the whole family!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-lg px-8 py-6"
            >
              Sign Up as Parent
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
              Log In
            </Button>
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
          <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose Learn Link?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Designed for both parents and children with features that make learning fun and rewarding
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* For Parents */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-blue-600">For Parents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Assign tasks, track progress, and reward your child's learning achievements.
              </p>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  Create custom tasks
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  Monitor progress
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  Set up rewards
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* For Children */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-green-50 to-white border-2 border-green-200">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-green-600">For Children</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Complete tasks, earn points, and redeem amazing rewards in a fun way.
              </p>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Fun task completion
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Earn points & badges
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Unlock rewards
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Gamification */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-purple-600">Gamification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Minigames, badges, and achievements make learning feel like play.
              </p>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-500" />
                  Interactive minigames
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-500" />
                  Achievement badges
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-500" />
                  Progress tracking
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Safe & Easy */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-primary">Safe & Easy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Secure platform with kid-friendly design and parental controls.
              </p>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Secure & private
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Kid-friendly interface
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Parental controls
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple 3-step process that brings families together through learning
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">1. Parents Assign Tasks</h3>
              <p className="text-muted-foreground">
                Create learning tasks, homework assignments, or chores with clear instructions and point values.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">2. Child Completes & Submits</h3>
              <p className="text-muted-foreground">
                Children complete tasks and submit proof of completion through photos, videos, or text updates.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Gift className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">3. Review & Reward</h3>
              <p className="text-muted-foreground">
                Parents review submissions, award points, and children redeem rewards from the family store.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">See Learn Link in Action</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover how both parents and children experience the magic of gamified learning
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Parent View */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <Users className="w-5 h-5" />
                Parent Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <img src="/parent-dashboard-interface-with-task-management-an.png" alt="Parent dashboard view" className="w-full h-64 object-cover" />
            </CardContent>
          </Card>

          {/* Child View */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <Star className="w-5 h-5" />
                Child Interface
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <img src="/colorful-child-interface-with-games--rewards-and-a.png" alt="Child interface view" className="w-full h-64 object-cover" />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gradient-to-r from-orange-50 to-pink-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">What Families Are Saying</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real feedback from parents and children using Learn Link
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
                  "My kid is excited to study every day with Learn Link! The gamification makes homework feel like play,
                  and I love being able to track their progress and celebrate their achievements."
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
                  "I love unlocking rewards after finishing my homework! The mini-games are super fun, and I can't wait
                  to earn enough points for the new art supplies in the reward store!"
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
            <h2 className="text-4xl font-bold mb-4">Ready to Transform Learning?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of families who have made learning fun, rewarding, and meaningful with Learn Link.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 text-lg px-8 py-6 bg-transparent"
              >
                Watch Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <Footer />
    </div>
  )
}
