import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger, Button, Input, Badge } from '@/shared/components/ui';
import { 
  Search, 
  Filter, 
  Star, 
  Download, 
  Eye, 
  Clock,
  Zap,
  Shield,
  Bot,
  MessageSquare,
  BarChart3,
  Database,
  Cloud,
  Cog,
  CreditCard,
  Globe,
  Smartphone,
  Mail,
  Calendar,
  FileText,
  Users,
  Truck,
  ShoppingCart
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function ServiceMarketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const serviceCategories = [
    { id: 'all', label: 'All Services', count: 234 },
    { id: 'integration', label: 'Integration', count: 45 },
    { id: 'automation', label: 'Automation', count: 38 },
    { id: 'analytics', label: 'Analytics', count: 29 },
    { id: 'communication', label: 'Communication', count: 33 },
    { id: 'security', label: 'Security', count: 25 },
    { id: 'ai-ml', label: 'AI/ML', count: 21 },
    { id: 'productivity', label: 'Productivity', count: 43 }
  ];

  const featuredServices = [
    {
      id: 1,
      name: 'Advanced Analytics Suite',
      description: 'Comprehensive business intelligence and data visualization platform',
      category: 'Analytics',
      provider: 'DataFlow Inc.',
      price: '$299/month',
      rating: 4.8,
      reviews: 342,
      downloads: '12.5K',
      icon: BarChart3,
      color: 'text-chart-1',
      bgColor: 'bg-chart-1/10',
      tags: ['Business Intelligence', 'Reporting', 'Dashboard'],
      featured: true,
      lastUpdated: '2 days ago'
    },
    {
      id: 2,
      name: 'AI Customer Service Bot',
      description: 'Intelligent chatbot with natural language processing for customer support',
      category: 'AI/ML',
      provider: 'BotTech Solutions',
      price: '$199/month',
      rating: 4.9,
      reviews: 567,
      downloads: '18.2K',
      icon: Bot,
      color: 'text-chart-5',
      bgColor: 'bg-chart-5/10',
      tags: ['NLP', 'Customer Support', 'Automation'],
      featured: true,
      lastUpdated: '1 week ago'
    },
    {
      id: 3,
      name: 'Enterprise Security Shield',
      description: 'Advanced cybersecurity solution with threat detection and prevention',
      category: 'Security',
      provider: 'SecureFlow',
      price: '$599/month',
      rating: 4.7,
      reviews: 289,
      downloads: '8.9K',
      icon: Shield,
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10',
      tags: ['Cybersecurity', 'Threat Detection', 'Compliance'],
      featured: true,
      lastUpdated: '3 days ago'
    },
    {
      id: 4,
      name: 'Cloud Integration Hub',
      description: 'Seamless integration with 500+ cloud services and APIs',
      category: 'Integration',
      provider: 'CloudConnect',
      price: '$149/month',
      rating: 4.6,
      reviews: 423,
      downloads: '15.7K',
      icon: Cloud,
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10',
      tags: ['API Integration', 'Cloud Services', 'Webhooks'],
      featured: false,
      lastUpdated: '5 days ago'
    }
  ];

  const allServices = [
    ...featuredServices,
    {
      id: 5,
      name: 'Email Marketing Automation',
      description: 'Advanced email campaigns with AI-powered personalization',
      category: 'Communication',
      provider: 'MailFlow Pro',
      price: '$89/month',
      rating: 4.5,
      reviews: 234,
      downloads: '9.8K',
      icon: Mail,
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10',
      tags: ['Email Marketing', 'Automation', 'Personalization'],
      featured: false,
      lastUpdated: '1 week ago'
    },
    {
      id: 6,
      name: 'Smart Calendar Scheduler',
      description: 'AI-powered scheduling with calendar optimization',
      category: 'Productivity',
      provider: 'TimeSync',
      price: '$49/month',
      rating: 4.4,
      reviews: 156,
      downloads: '7.2K',
      icon: Calendar,
      color: 'text-chart-1',
      bgColor: 'bg-chart-1/10',
      tags: ['Scheduling', 'Calendar', 'AI Optimization'],
      featured: false,
      lastUpdated: '4 days ago'
    },
    {
      id: 7,
      name: 'Document Management Pro',
      description: 'Enterprise document management with version control',
      category: 'Productivity',
      provider: 'DocFlow Systems',
      price: '$129/month',
      rating: 4.6,
      reviews: 298,
      downloads: '11.3K',
      icon: FileText,
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10',
      tags: ['Document Management', 'Version Control', 'Collaboration'],
      featured: false,
      lastUpdated: '6 days ago'
    },
    {
      id: 8,
      name: 'Team Communication Hub',
      description: 'Unified communication platform for teams',
      category: 'Communication',
      provider: 'TeamChat Inc.',
      price: '$79/month',
      rating: 4.3,
      reviews: 187,
      downloads: '6.5K',
      icon: MessageSquare,
      color: 'text-chart-5',
      bgColor: 'bg-chart-5/10',
      tags: ['Team Chat', 'Video Calls', 'File Sharing'],
      featured: false,
      lastUpdated: '2 weeks ago'
    }
  ];

  const filteredServices = allServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           service.category.toLowerCase().replace('/', '-').replace(' ', '-') === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-6 border-b border-border/30 bg-background/50 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground tracking-tight">Service Marketplace</h1>
            <p className="text-base lg:text-lg text-muted-foreground font-medium mt-1 lg:mt-2">Discover and integrate powerful services</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 rounded-xl border-0 bg-muted/50 backdrop-blur-sm"
              />
            </div>
            <Button variant="outline" size="sm" className="rounded-xl border-0 bg-muted/50 backdrop-blur-sm font-semibold">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable Main Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="h-full flex flex-col">
          {/* Fixed Tabs Navigation */}
          <div className="flex-shrink-0 p-6 pb-0">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 rounded-2xl bg-muted/30 p-1">
              {serviceCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm font-semibold text-sm"
                >
                  <span className="hidden sm:inline">{category.label}</span>
                  <span className="sm:hidden">{category.label.split(' ')[0]}</span>
                  <Badge variant="secondary" className="ml-2 px-2 py-0.5 text-xs font-bold rounded-full">
                    {category.count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Scrollable Tab Content */}
          <div className="flex-1 overflow-y-auto hide-scrollbar p-6 pt-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="space-y-6">
              {/* Featured Services */}
              {selectedCategory === 'all' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground">Featured Services</h2>
                    <Badge variant="outline" className="rounded-full px-3 py-1 font-semibold bg-primary/10 text-primary border-primary/30">
                      <Star className="w-3 h-3 mr-1" />
                      Editor's Choice
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {featuredServices.map((service) => (
                      <Card key={service.id} className="border-0 shadow-lg bg-card/90 backdrop-blur-xl rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-12 h-12 rounded-xl ${service.bgColor} flex items-center justify-center`}>
                                <service.icon className={`w-6 h-6 ${service.color}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-lg font-semibold text-foreground truncate">{service.name}</CardTitle>
                                <p className="text-sm text-muted-foreground font-medium">{service.provider}</p>
                              </div>
                            </div>
                            <Badge variant="secondary" className="rounded-full px-2 py-1 text-xs font-bold bg-chart-2/10 text-chart-2">
                              Featured
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                            {service.description}
                          </CardDescription>
                          
                          <div className="flex flex-wrap gap-1">
                            {service.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs px-2 py-0.5 rounded-full font-medium">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                                <span className="font-semibold">{service.rating}</span>
                                <span className="text-muted-foreground ml-1">({service.reviews})</span>
                              </div>
                              <div className="flex items-center text-muted-foreground">
                                <Download className="w-4 h-4 mr-1" />
                                {service.downloads}
                              </div>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <Clock className="w-4 h-4 mr-1" />
                              {service.lastUpdated}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <div className="text-lg font-bold text-foreground">{service.price}</div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="rounded-xl font-semibold">
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button size="sm" className="rounded-xl font-semibold bg-primary hover:bg-primary/90">
                                Install
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* All Services Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">
                    {selectedCategory === 'all' ? 'All Services' : serviceCategories.find(cat => cat.id === selectedCategory)?.label}
                  </h2>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>{filteredServices.length} services found</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                  {filteredServices.map((service) => (
                    <Card key={service.id} className="border-0 shadow-lg bg-card/90 backdrop-blur-xl rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-xl ${service.bgColor} flex items-center justify-center`}>
                              <service.icon className={`w-5 h-5 ${service.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-base font-semibold text-foreground truncate">{service.name}</CardTitle>
                              <p className="text-xs text-muted-foreground font-medium">{service.provider}</p>
                            </div>
                          </div>
                          {service.featured && (
                            <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs font-bold bg-chart-2/10 text-chart-2">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <CardDescription className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                          {service.description}
                        </CardDescription>
                        
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center">
                              <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" />
                              <span className="font-semibold">{service.rating}</span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <Download className="w-3 h-3 mr-1" />
                              {service.downloads}
                            </div>
                          </div>
                          <div className="text-sm font-bold text-foreground">{service.price}</div>
                        </div>

                        <div className="flex space-x-2 pt-1">
                          <Button size="sm" variant="outline" className="flex-1 rounded-xl font-semibold text-xs">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" className="flex-1 rounded-xl font-semibold text-xs bg-primary hover:bg-primary/90">
                            Install
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredServices.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-muted/50 flex items-center justify-center">
                      <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">No services found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );}