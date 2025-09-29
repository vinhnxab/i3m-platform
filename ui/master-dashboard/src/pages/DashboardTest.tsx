import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Separator } from '@/shared/components/ui/separator';
import { RefreshCw, Copy, Trash2, Download, Eye, EyeOff } from 'lucide-react';
import { authService } from '@/services/authService';

interface LocalStorageData {
  authToken?: string;
  refreshToken?: string;
  tenantToken?: string;
  userData?: any;
  currentTenant?: string;
  language?: string;
  [key: string]: any;
}

export default function DashboardTest() {
  const [localStorageData, setLocalStorageData] = useState<LocalStorageData>({});
  const [showTokens, setShowTokens] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load localStorage data
  const loadLocalStorageData = () => {
    setIsRefreshing(true);
    
    const data: LocalStorageData = {};
    
    // Get all localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            // Try to parse as JSON, fallback to string
            try {
              data[key] = JSON.parse(value);
            } catch {
              data[key] = value;
            }
          }
        } catch (error) {
          console.error(`Error reading localStorage key ${key}:`, error);
          data[key] = `Error reading: ${error}`;
        }
      }
    }
    
    setLocalStorageData(data);
    setIsRefreshing(false);
  };

  // Load data on component mount
  useEffect(() => {
    loadLocalStorageData();
  }, []);

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Download as JSON
  const downloadAsJSON = () => {
    const dataStr = JSON.stringify(localStorageData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'localStorage-data.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Clear all localStorage
  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all localStorage data? This will log you out.')) {
      authService.clearAuth();
      loadLocalStorageData();
    }
  };

  // Format token for display
  const formatToken = (token: string) => {
    if (!showTokens) {
      return `${token.substring(0, 20)}...${token.substring(token.length - 20)}`;
    }
    return token;
  };

  // Get token info (decode JWT header and payload)
  const getTokenInfo = (token: string) => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      
      return {
        header,
        payload,
        expiresAt: new Date(payload.exp * 1000).toLocaleString(),
        issuedAt: new Date(payload.iat * 1000).toLocaleString(),
        issuer: payload.iss,
        subject: payload.sub
      };
    } catch (error) {
      return null;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Test - LocalStorage Data</h1>
          <p className="text-muted-foreground">
            View and manage all data stored in localStorage
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={loadLocalStorageData}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={() => setShowTokens(!showTokens)}
            variant="outline"
            size="sm"
          >
            {showTokens ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showTokens ? 'Hide' : 'Show'} Tokens
          </Button>
          <Button
            onClick={downloadAsJSON}
            variant="outline"
            size="sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Download JSON
          </Button>
          <Button
            onClick={clearAllData}
            variant="destructive"
            size="sm"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Keys</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(localStorageData).length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Auth Token</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {localStorageData.authToken ? '✅' : '❌'}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Tenant Token</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {localStorageData.tenantToken ? '✅' : '❌'}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">User Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {localStorageData.userData ? '✅' : '❌'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Authentication Tokens */}
        <Card>
          <CardHeader>
            <CardTitle>Authentication Tokens</CardTitle>
            <CardDescription>JWT tokens and authentication data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Auth Token */}
            {localStorageData.authToken && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="default">Access Token</Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(localStorageData.authToken!)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <div className="p-3 bg-muted rounded-md font-mono text-sm break-all">
                  {formatToken(localStorageData.authToken)}
                </div>
                {getTokenInfo(localStorageData.authToken) && (
                  <div className="text-xs text-muted-foreground">
                    <div>Expires: {getTokenInfo(localStorageData.authToken)?.expiresAt}</div>
                    <div>Issued: {getTokenInfo(localStorageData.authToken)?.issuedAt}</div>
                    <div>Issuer: {getTokenInfo(localStorageData.authToken)?.issuer}</div>
                  </div>
                )}
              </div>
            )}

            {/* Refresh Token */}
            {localStorageData.refreshToken && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Refresh Token</Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(localStorageData.refreshToken!)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <div className="p-3 bg-muted rounded-md font-mono text-sm break-all">
                  {formatToken(localStorageData.refreshToken)}
                </div>
              </div>
            )}

            {/* Tenant Token */}
            {localStorageData.tenantToken && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Tenant Token</Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(localStorageData.tenantToken!)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <div className="p-3 bg-muted rounded-md font-mono text-sm break-all">
                  {formatToken(localStorageData.tenantToken)}
                </div>
                {getTokenInfo(localStorageData.tenantToken) && (
                  <div className="text-xs text-muted-foreground">
                    <div>Expires: {getTokenInfo(localStorageData.tenantToken)?.expiresAt}</div>
                    <div>Issued: {getTokenInfo(localStorageData.tenantToken)?.issuedAt}</div>
                    <div>Issuer: {getTokenInfo(localStorageData.tenantToken)?.issuer}</div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Data */}
        <Card>
          <CardHeader>
            <CardTitle>User Data</CardTitle>
            <CardDescription>User information and groups</CardDescription>
          </CardHeader>
          <CardContent>
            {localStorageData.userData ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>ID:</strong> {localStorageData.userData.id}
                  </div>
                  <div>
                    <strong>Email:</strong> {localStorageData.userData.email}
                  </div>
                  <div>
                    <strong>Name:</strong> {localStorageData.userData.name}
                  </div>
                  <div>
                    <strong>Role:</strong> {localStorageData.userData.role}
                  </div>
                  <div>
                    <strong>Primary Role:</strong> {localStorageData.userData.primaryRole || 'None'}
                  </div>
                  <div>
                    <strong>Tenant ID:</strong> {localStorageData.userData.tenantId || 'None'}
                  </div>
                </div>

                {/* User Groups */}
                {localStorageData.userData.userGroups && localStorageData.userData.userGroups.length > 0 && (
                  <div>
                    <Separator className="my-4" />
                    <h4 className="font-semibold mb-2">User Groups</h4>
                    <div className="space-y-2">
                      {localStorageData.userData.userGroups.map((group: any, index: number) => (
                        <div key={index} className="p-3 bg-muted rounded-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{group.groupName}</div>
                              <div className="text-sm text-muted-foreground">
                                Role: {group.role} | ID: {group.groupId}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Assigned: {new Date(group.assignedAt).toLocaleString()}
                              </div>
                            </div>
                            <Badge variant="outline">{group.role}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Primary Group */}
                {localStorageData.userData.primaryGroup && (
                  <div>
                    <Separator className="my-4" />
                    <h4 className="font-semibold mb-2">Primary Group</h4>
                    <div className="p-3 bg-blue-50 rounded-md">
                      <div className="font-medium">{localStorageData.userData.primaryGroup.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Role: {localStorageData.userData.primaryGroup.role} | ID: {localStorageData.userData.primaryGroup.id}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Priority: {localStorageData.userData.primaryGroup.priority}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-muted-foreground">No user data found</div>
            )}
          </CardContent>
        </Card>

        {/* Other LocalStorage Data */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>All LocalStorage Data</CardTitle>
            <CardDescription>Complete localStorage contents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(localStorageData).map(([key, value]) => (
                <div key={key} className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{key}</h4>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(JSON.stringify(value, null, 2))}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="bg-muted p-3 rounded-md">
                    <pre className="text-sm overflow-auto max-h-40">
                      {typeof value === 'object' 
                        ? JSON.stringify(value, null, 2)
                        : String(value)
                      }
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
