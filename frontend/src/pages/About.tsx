import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const About = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About <span className="text-primary">Farmverse</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">  
            </p>
          </div>
          {/* Mission Section */}
          <div className="grid md:grid-cols-2 gap-12 mb-20">
            <div className="animate-fade-in-scale">
              <h2 className="text-3xl font-bold mb-6 text-primary">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                To empower farmers in India with intelligent technology solutions that increase crop yields, 
                reduce environmental impact, and create sustainable agricultural practices for future generations.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We believe that the intersection of technology and agriculture holds the key to feeding 
                the world's growing population while preserving our planet's precious resources.
              </p>
            </div>
            <div className="animate-fade-in-scale stagger-1">
              <h2 className="text-3xl font-bold mb-6 text-primary">Our Vision</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                A world where every farm operates at peak efficiency, using minimal resources to produce 
                maximum yields, while contributing to global food security and environmental sustainability.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We envision farms as interconnected ecosystems of smart technology, where AI-powered 
                assistance  and real-time gamification can help[ farmers to know about the crops in the best way ].
              </p>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-12">Our Core Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Sustainability",
                  description: "Every solution we develop prioritizes environmental protection and resource conservation.",
                  icon: "🌱"
                },
                {
                  title: "Innovation", 
                  description: "We continuously push the boundaries of agricultural technology to solve tomorrow's challenges with the help of Artificial Intellegence .",
                  icon: "💡"
                },
                {
                  title: "Partnership",
                  description: "We work hand-in-hand with farmers, understanding their needs and challenges firsthand.",
                  icon: "🤝"
                }
              ].map((value, index) => (
                <Card key={index} className="text-center hover-lift animate-fade-in-scale stagger-2">
                  <CardHeader>
                    <div className="text-4xl mb-4">{value.icon}</div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-12">Meet Our Team</h2>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { name: "Anish Deshmukh", role: "Team lead ", expertise: "AI and management" },
                { name: "Bithal Mohanty", role: "Backend/ML", expertise: "Ai/Ml" },
                { name: "Neha Mishra", role: "Backend/ML", expertise: "Ai/ML" },
                { name: "Mritunjay Singh", role: "Frontend", expertise: "Ui/ux" },
                { name: "Nikhil Gupta", role: "Frontend(lead)", expertise: "Frontend" },
                { name: "Purvi Sharma", role: "Researcher", expertise: "Reserch and content" }
              ].map((member, index) => (
                <Card key={index} className="text-center hover-lift animate-fade-in-scale stagger-3">
                  <CardContent className="p-6">
                    <div className="w-24 h-24 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl">👤</span>
                    </div>
                    <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                    <p className="text-primary font-medium mb-2">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.expertise}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;