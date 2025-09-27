import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui';
import { useCMS } from '@/features/cms/hooks/useCMS';
import {
  CMSHeader,
  CMSStats,
  ArticlesList,
  CategoriesList,
  MediaLibrary,
  ThemesList
} from '@/features/cms';

export function CMSManagement() {
  const [activeTab, setActiveTab] = useState('content');
  const {
    contentStats,
    articles,
    categories,
    mediaFiles,
    themes,
    isLoading,
    error,
    handleNewContent,
    handleUploadMedia,
    handleEditArticle,
    handleDeleteArticle,
    handleViewArticle,
    handleEditCategory,
    handleDeleteCategory,
    handleAddCategory,
    handleViewMedia,
    handleDownloadMedia,
    handleDeleteMedia,
    handlePreviewTheme,
    handleActivateTheme,
    handleDownloadTheme
  } = useCMS();

  if (isLoading) {
    return (
      <div className="w-full px-4 lg:px-6 py-4 lg:py-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading CMS data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 lg:px-6 py-4 lg:py-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 lg:px-6 py-4 lg:py-6 space-y-6">
      {/* Header */}
      <CMSHeader
        onNewContent={handleNewContent}
        onUploadMedia={handleUploadMedia}
      />

      {/* Stats */}
      <CMSStats stats={contentStats} />

      {/* CMS Modules */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="themes">Themes</TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <ArticlesList
            articles={articles}
            onEdit={handleEditArticle}
            onDelete={handleDeleteArticle}
            onView={handleViewArticle}
          />
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <CategoriesList
            categories={categories}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
            onAdd={handleAddCategory}
          />
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media" className="space-y-6">
          <MediaLibrary
            files={mediaFiles}
            onView={handleViewMedia}
            onDownload={handleDownloadMedia}
            onDelete={handleDeleteMedia}
          />
        </TabsContent>

        {/* Themes Tab */}
        <TabsContent value="themes" className="space-y-6">
          <ThemesList
            themes={themes}
            onPreview={handlePreviewTheme}
            onActivate={handleActivateTheme}
            onDownload={handleDownloadTheme}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
