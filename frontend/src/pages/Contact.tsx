import Navigation from '@/components/Navigation';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    farmSize: '',
    message: '',
    interest: 'general'
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{status:'idle'|'ok'|'error'; msg?:string}>({status:'idle'});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResult({status:'idle'});
    try {
      const res = await fetch('/api/v1/features/contact/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if(res.ok){
        setResult({status:'ok', msg: data.detail || 'Message sent'});
        setFormData(prev=>({...prev, message:''}));
      } else {
        setResult({status:'error', msg: data.detail || 'Failed to send'});
      }
    } catch(err:any){
      setResult({status:'error', msg: err.message || 'Network error'});
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactMethods = [
    {
      title: "Sales & Partnerships",
      description: "Discuss solutions for your farm or become a partner",
      contact: "sales@farmverse@gmail.com",
      phone: "+91 7303142024",
      icon: "💼"
    },
    {
      title: "Technical Support",
      description: "Get help with existing products and services",
      contact: "support@farmverse@gamil.com", 
      phone: "+91 7303142024",
      icon: "🔧"
    },
    {
      title: "Research & Development",
      description: "Collaborate on agricultural research projects",
      contact: "research@farmverse@gamil.com",
      phone: "++91 7303142024",
      icon: "🔬"
    }
  ];

  const offices = [
    {
      location: "Delhi Headquarters",
      address: "Noida, Uttar Pradesh 201301",
      phone: "",
      email: "headquarters@agrifuture.com"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Get in <span className="text-primary">Touch</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Ready to transform your farming operations? Our team of agricultural technology experts 
              is here to help you find the perfect solution for your needs.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            {/* Contact Form */}
            <Card className="hover-lift animate-fade-in-scale">
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="mt-1" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company">Company/Farm Name</Label>
                      <Input id="company" name="company" value={formData.company} onChange={handleChange} className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="farmSize">Farm Size</Label>
                      <select id="farmSize" name="farmSize" value={formData.farmSize} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground">
                        <option value="">Select farm size</option>
                        <option value="small">Small (0-10 hectares)</option>
                        <option value="medium">Medium (10-100 hectares)</option>
                        <option value="large">Large (100+ hectares)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="interest">Area of Interest</Label>
                    <select id="interest" name="interest" value={formData.interest} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground">
                      <option value="general">General Inquiry</option>
                      <option value="smart-irrigation">Smart Irrigation Systems</option>
                      <option value="drone-monitoring">Drone Monitoring</option>
                      <option value="iot-sensors">IoT Sensor Networks</option>
                      <option value="ai-analytics">AI Analytics Platform</option>
                      <option value="precision-farming">Precision Farming</option>
                      <option value="partnership">Partnership Opportunities</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={5} className="mt-1" placeholder="Tell us about your farming challenges and how we can help..." />
                  </div>

                  {result.status !== 'idle' && (
                    <div className={`text-sm font-medium ${result.status==='ok' ? 'text-green-600' : 'text-red-600'}`}>{result.msg}</div>
                  )}

                  <Button type="submit" disabled={submitting} className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                    {submitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Contact Methods */}
              <div>
                <h3 className="text-2xl font-bold mb-6">Contact Methods</h3>
                <div className="space-y-6">
                  {contactMethods.map((method, index) => (
                    <Card key={index} className="hover-lift">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="text-3xl">{method.icon}</div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-2">{method.title}</h4>
                            <p className="text-muted-foreground mb-3">{method.description}</p>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center">
                                <span className="font-medium">Email:</span>
                                <a href={`mailto:${method.contact}`} className="ml-2 text-primary hover:underline">
                                  {method.contact}
                                </a>
                              </div>
                              <div className="flex items-center">
                                <span className="font-medium">Phone:</span>
                                <a href={`tel:${method.phone}`} className="ml-2 text-primary hover:underline">
                                  {method.phone}
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Office Locations */}
              <div>
                <h3 className="text-2xl font-bold mb-6">Office Locations</h3>
                <div className="space-y-4">
                  {offices.map((office, index) => (
                    <Card key={index} className="hover-lift">
                      <CardContent className="p-6">
                        <h4 className="font-semibold text-lg mb-2">{office.location}</h4>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div>{office.address}</div>
                          {office.phone && <div>Phone: {office.phone}</div>}
                          <div>Email: <a href={`mailto:${office.email}`} className="text-primary hover:underline">{office.email}</a></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  question: "How quickly can you implement solutions?",
                  answer: "Implementation timelines vary based on solution complexity and farm size. Simple IoT systems can be deployed in 2-4 weeks, while comprehensive solutions may take 2-3 months."
                },
                {
                  question: "Do you provide training and support?",
                  answer: "Yes! We offer comprehensive training for your team and provide ongoing technical support to ensure you get the most value from our solutions."
                },
                {
                  question: "Can you work with existing farm equipment?",
                  answer: "Absolutely! Our solutions are designed to integrate with existing farm infrastructure. We'll assess your current setup and recommend the best integration approach."
                },
                {
                  question: "What about data security and privacy?",
                  answer: "We take data security seriously. All farm data is encrypted, stored securely, and you maintain full ownership of your information."
                }
              ].map((faq, index) => (
                <Card key={index} className="hover-lift">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-3">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of farmers who have already transformed their operations with our smart farming technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                Schedule a Consultation
              </Button>
              <Button variant="outline" size="lg">
                Download Brochure
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;