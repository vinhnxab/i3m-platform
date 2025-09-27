import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui';
import { mockEcommerceStats, mockProducts, mockOrders, mockPayments, mockSalesChannels } from '../../mock-data/ecommerce';
import { 
  Package, 
  ShoppingCart, 
  CreditCard, 
  TrendingUp,
  DollarSign,
  Users,
  Globe,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

export function EcommerceManagement() {
  const [activeTab, setActiveTab] = useState('products');

  const ecommerceStats = mockEcommerceStats;

  const products = mockProducts;

  const orders = mockOrders;

  const payments = mockPayments;

  const salesChannels = mockSalesChannels;

  return (
    <div className="w-full px-4 lg:px-6 py-4 lg:py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">E-commerce Management</h1>
          <p className="text-muted-foreground">Multi-channel commerce dashboard</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
          <Button>
            <TrendingUp className="w-4 h-4 mr-2" />
            View Analytics
          </Button>
        </div>
      </div>

      {/* E-commerce Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {ecommerceStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className="stat-icon-container">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* E-commerce Modules */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="channels">Sales Channels</TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Product Catalog</CardTitle>
                  <CardDescription>Manage your product inventory and pricing</CardDescription>
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
                {products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{product.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>SKU: {product.sku}</span>
                          <span>Category: {product.category}</span>
                          <span>Sales: {product.sales}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium">{product.price}</p>
                        <p className="text-sm text-muted-foreground">
                          Stock: {product.stock}
                        </p>
                      </div>
                      <Badge variant={
                        product.status === 'active' ? 'default' :
                        product.status === 'out-of-stock' ? 'destructive' : 'secondary'
                      }>
                        {product.status}
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

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Low Stock Alert</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Premium Theme Bundle', stock: 0 },
                    { name: 'Analytics Dashboard', stock: 25 },
                    { name: 'Mobile App License', stock: 15 },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{item.name}</span>
                      <Badge variant={item.stock === 0 ? 'destructive' : 'secondary'}>
                        {item.stock} left
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Sellers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Enterprise License', sales: 234 },
                    { name: 'Premium Theme Bundle', sales: 156 },
                    { name: 'Professional Support', sales: 89 },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{item.name}</span>
                      <span className="text-sm font-medium">{item.sales} sales</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Licenses', count: 45 },
                    { name: 'Templates', count: 67 },
                    { name: 'Services', count: 23 },
                    { name: 'Add-ons', count: 34 },
                  ].map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{category.name}</span>
                      <Badge variant="outline">{category.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
              <CardDescription>Track and manage customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{order.id}</h4>
                          <Badge variant="outline">{order.items} items</Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{order.customer}</span>
                          <span>{order.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium">{order.total}</p>
                        <Badge variant={
                          order.paymentStatus === 'paid' ? 'default' : 
                          order.paymentStatus === 'pending' ? 'secondary' : 'destructive'
                        } className="text-xs">
                          {order.paymentStatus}
                        </Badge>
                      </div>
                      <Badge variant={
                        order.status === 'completed' ? 'default' :
                        order.status === 'processing' ? 'secondary' :
                        order.status === 'shipped' ? 'outline' : 'secondary'
                      }>
                        {order.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Transactions</CardTitle>
              <CardDescription>Monitor payment processing and fees</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{payment.id}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Order: {payment.order}</span>
                          <span>{payment.method}</span>
                          <span>{payment.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium">{payment.amount}</p>
                        <p className="text-xs text-muted-foreground">Fee: {payment.fees}</p>
                      </div>
                      <Badge variant={payment.status === 'success' ? 'default' : 'secondary'}>
                        {payment.status === 'success' ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sales Channels Tab */}
        <TabsContent value="channels" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales Channel Performance</CardTitle>
              <CardDescription>Multi-channel sales analytics and management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {salesChannels.map((channel, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <Globe className="w-5 h-5 text-primary" />
                          <h4 className="font-medium">{channel.name}</h4>
                        </div>
                        <Badge variant="outline">{channel.growth}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Revenue</span>
                          <span className="font-medium">{channel.revenue}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Orders</span>
                          <span className="font-medium">{channel.orders}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Channel Integration</CardTitle>
                <CardDescription>Manage marketplace connections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Amazon Marketplace', status: 'connected', products: 1247 },
                    { name: 'eBay Store', status: 'connected', products: 892 },
                    { name: 'Shopify', status: 'pending', products: 0 },
                    { name: 'WooCommerce', status: 'disconnected', products: 0 },
                  ].map((integration, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{integration.name}</p>
                        <p className="text-xs text-muted-foreground">{integration.products} products</p>
                      </div>
                      <Badge variant={
                        integration.status === 'connected' ? 'default' :
                        integration.status === 'pending' ? 'secondary' : 'outline'
                      }>
                        {integration.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Accepted payment options</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { method: 'Credit/Debit Cards', enabled: true, fee: '2.9%' },
                    { method: 'PayPal', enabled: true, fee: '3.5%' },
                    { method: 'Bank Transfer', enabled: true, fee: '0%' },
                    { method: 'Cryptocurrency', enabled: false, fee: '1.5%' },
                  ].map((method, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{method.method}</p>
                        <p className="text-xs text-muted-foreground">Fee: {method.fee}</p>
                      </div>
                      <Badge variant={method.enabled ? 'default' : 'outline'}>
                        {method.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}