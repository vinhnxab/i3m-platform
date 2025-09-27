import { useState } from 'react';
import { 
  mockCMSStats, 
  mockArticles, 
  mockCategories, 
  mockMediaFiles, 
  mockThemes 
} from '../../../../mock-data/cms';

export const useCMS = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contentStats = mockCMSStats;
  const articles = mockArticles;
  const categories = mockCategories;
  const mediaFiles = mockMediaFiles;
  const themes = mockThemes;

  const handleNewContent = () => {
    console.log('Create new content');
  };

  const handleUploadMedia = () => {
    console.log('Upload media');
  };

  const handleEditArticle = (article: any) => {
    console.log('Edit article:', article.id);
  };

  const handleDeleteArticle = (article: any) => {
    console.log('Delete article:', article.id);
  };

  const handleViewArticle = (article: any) => {
    console.log('View article:', article.id);
  };

  const handleEditCategory = (category: any) => {
    console.log('Edit category:', category.id);
  };

  const handleDeleteCategory = (category: any) => {
    console.log('Delete category:', category.id);
  };

  const handleAddCategory = () => {
    console.log('Add new category');
  };

  const handleViewMedia = (file: any) => {
    console.log('View media:', file.id);
  };

  const handleDownloadMedia = (file: any) => {
    console.log('Download media:', file.id);
  };

  const handleDeleteMedia = (file: any) => {
    console.log('Delete media:', file.id);
  };

  const handlePreviewTheme = (theme: any) => {
    console.log('Preview theme:', theme.id);
  };

  const handleActivateTheme = (theme: any) => {
    console.log('Activate theme:', theme.id);
  };

  const handleDownloadTheme = (theme: any) => {
    console.log('Download theme:', theme.id);
  };

  return {
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
  };
};
