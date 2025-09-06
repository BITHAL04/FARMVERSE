import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Farm?
            <span className="block text-primary">Let's Get Started</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of farmers already using our technology to increase yields, reduce costs, and protect the environment.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="hover-lift animate-fade-in-scale">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Get Your Free Consultation</CardTitle>
              <p className="text-center text-muted-foreground">
                Schedule a personalized demo and ROI analysis for your farm
              </p>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" required className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" required className="mt-1" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" required className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" className="mt-1" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="farmName">Farm/Company Name</Label>
                    <Input id="farmName" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="farmSize">Farm Size (hectares)</Label>
                    <Input id="farmSize" placeholder="e.g., 100" className="mt-1" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="crops">Primary Crops</Label>
                  <Input id="crops" placeholder="e.g., Corn, Soybeans, Wheat" className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="interest">What interests you most?</Label>
                  <select 
                    id="interest" 
                    className="mt-1 w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option>Smart Irrigation Systems</option>
                    <option>Drone Monitoring</option>
                    <option>IoT Sensor Networks</option>
                    <option>AI Analytics Platform</option>
                    <option>Complete Smart Farm Solution</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="message">Tell us about your farming challenges</Label>
                  <Textarea 
                    id="message" 
                    rows={4} 
                    placeholder="What challenges are you facing that technology could help solve?"
                    className="mt-1"
                  />
                </div>

                <Button className="w-full hero-gradient text-primary-foreground text-lg py-6">
                  Schedule Free Consultation
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By submitting this form, you agree to receive communications from AgriFuture. 
                  We respect your privacy and never share your information.
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information & Benefits */}
          <div className="space-y-8 animate-fade-in-scale stagger-1">
            {/* Quick Contact */}
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">📞</span>
                  Prefer to Talk Directly?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="font-semibold">Sales:</span>
                  <a href="tel:+15551234567" className="text-primary hover:underline">+1 (555) 123-4567</a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">Email:</span>
                  <a href="mailto:sales@agrifuture.com" className="text-primary hover:underline">sales@agrifuture.com</a>
                </div>
                <div className="text-sm text-muted-foreground">
                  Available Monday-Friday, 8am-6pm EST
                </div>
              </CardContent>
            </Card>

            {/* What You Get */}
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">🎁</span>
                  What You'll Receive
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Personalized farm analysis and ROI projections",
                    "Live demonstration of our technology in action",
                    "Custom implementation roadmap for your farm",
                    "Free consultation with our agricultural experts",
                    "Detailed pricing and financing options"
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Customer Success Stats */}
            <Card className="hover-lift hero-gradient text-white">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold mb-4">Join Our Success Stories</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">15,000+</div>
                    <div className="text-sm opacity-90">Farmers Served</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">40%</div>
                    <div className="text-sm opacity-90">Avg Yield Increase</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">$150K</div>
                    <div className="text-sm opacity-90">Avg Annual Savings</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="hover-lift border-orange-200 bg-orange-50 dark:bg-orange-900/20">
              <CardContent className="p-6 text-center">
                <div className="text-2xl mb-2">🚨</div>
                <h3 className="font-bold mb-2">Emergency Support</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  24/7 technical support for urgent issues
                </p>
                <a 
                  href="tel:+15559111234" 
                  className="text-orange-600 font-semibold hover:underline"
                >
                  +1 (555) 911-1234
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;