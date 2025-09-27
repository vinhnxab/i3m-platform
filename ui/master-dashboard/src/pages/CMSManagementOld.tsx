import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui';
import { mockCMSStats, mockArticles, mockThemes, mockCategories, mockMediaFiles } from '../../mock-data/cms';
import { 
  FileText, 
  Image, 
  Palette, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  User,
  Globe,
  Layout
} from 'lucide-react';
import { Input } from '@/shared/components/ui';

export function CMSManagement() {
  const [activeTab, setActiveTab] = useState('content');

  const contentStats = mockCMSStats;

  const articles = mockArticles;

  const categories = mockCategories;

  const mediaFiles = mockMediaFiles;

  const themes = mockThemes;

  return (
    <div className="w-full px-4 lg:px-6 py-4 lg:py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">CMS Management</h1>
          <p className="text-muted-foreground">Content Management System Dashboard</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            New Content
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Upload Media
          </Button>
        </div>
      </div>

      {/* CMS Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {contentStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className="stat-icon-container">
                  <Icon className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+{stat.change}</span> this month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* CMS Modules */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="media">Media Library</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="themes">Themes</TabsTrigger>
        </TabsList>

        {/* Content Management Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Content Management</CardTitle>
                  <CardDescription>Manage articles, pages, and content</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {articles.map((article) => (
                  <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{article.title}</h4>
                          {article.featured && (
                            <Badge variant="secondary" className="text-xs">Featured</Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {article.author}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {article.publishedAt || 'Not published'}
                          </span>
                          <span className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {article.views} views
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className={article.category}>{article.category}</Badge>
                      <Badge variant={
                        article.status === 'published' ? 'default' :
                        article.status === 'draft' ? 'secondary' :
                        article.status === 'review' ? 'outline' : 'destructive'
                      }>
                        {article.status}
                      </Badge>
                      <div className="flex space-x-1">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media Library Tab */}
        <TabsContent value="media" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Media Library</CardTitle>
              <CardDescription>Manage images, videos, and documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Recent Uploads</h4>
                  {mediaFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                          <Image className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{file.size} • {file.uploadedAt}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{file.usage} uses</p>
                        <Badge variant="outline" className="text-xs">{file.type}</Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Storage Overview</h4>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Used Storage</span>
                          <span>2.4 GB / 10 GB</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '24%' }} />
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div className="text-center">
                            <p className="text-lg font-semibold">1,247</p>
                            <p className="text-xs text-muted-foreground">Images</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-semibold">89</p>
                            <p className="text-xs text-muted-foreground">Videos</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Content Categories</CardTitle>
                  <CardDescription>Organize content with categories and tags</CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{category.name}</h4>
                        <Badge variant="secondary">{category.count}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Themes Tab */}
        <TabsContent value="themes" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Theme Management</CardTitle>
                  <CardDescription>Manage website themes and customization</CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Install Theme
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {themes.map((theme) => (
                  <Card key={theme.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{theme.name}</h4>
                          <p className="text-sm text-muted-foreground">Version {theme.version}</p>
                        </div>
                        <Badge variant={theme.status === 'active' ? 'default' : 'secondary'}>
                          {theme.status}
                        </Badge>
                      </div>
                      
                      <div className="h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-4 flex items-center justify-center">
                        <Layout className="w-8 h-8 text-muted-foreground" />
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-muted-foreground">{theme.installations} installations</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="w-3 h-3 mr-1" />
                          Preview
                        </Button>
                        <Button 
                          variant={theme.status === 'active' ? 'secondary' : 'default'} 
                          size="sm" 
                          className="flex-1"
                        >
                          {theme.status === 'active' ? 'Customize' : 'Activate'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}