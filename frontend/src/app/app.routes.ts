import { Routes } from '@angular/router';
import { Homepage } from './pages/homepage/homepage';
import { ProductList } from './pages/product-list/product-list';
import { ProductDetail } from './pages/product-detail/product-detail';
import { CartPage } from './pages/cart-page/cart-page';
import { LoginPage } from './pages/login-page/login-page';
import { RegisterPage } from './pages/register-page/register-page';
import { ContactPage } from './pages/contact-page/contact-page';
import { CheckoutPage } from './pages/checkout-page/checkout-page';
import { NotFound } from './pages/not-found/not-found';
import { AboutPage } from './pages/about-page/about-page';
import { ProfilePage } from './pages/profile-page/profile-page';
import { WishlistPage } from './pages/wishlist-page/wishlist-page';
import { OrderHistoryPage } from './pages/order-history-page/order-history-page';
import { OrderDetailPage } from './pages/order-detail-page/order-detail-page';
import { authGuard } from './auth.guard';

import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { AdminAddProduct } from './pages/admin-add-product/admin-add-product';
import { AdminCustomers } from './pages/admin-customers/admin-customers';
import { AdminSettings } from './pages/admin-settings/admin-settings';
import { AdminOrders } from './pages/admin-orders/admin-orders';
import { AdminStats } from './pages/admin-stats/admin-stats';
import { AdminCoupons } from './pages/admin-coupons/admin-coupons';
import { AdminNotifications } from './pages/admin-notifications/admin-notifications';
import { AdminAudit } from './pages/admin-audit/admin-audit';
import { AdminCategories } from './pages/admin-categories/admin-categories';

export const routes: Routes = [
  { path: '', component: Homepage },
  { 
    path: 'orders', 
    canActivate: [authGuard],
    children: [
      { path: '', component: OrderHistoryPage, pathMatch: 'full' },
      { path: ':id', component: OrderDetailPage }
    ]
  },
  { path: 'products', component: ProductList },
  { path: 'products/:id', component: ProductDetail },
  { path: 'cart', component: CartPage },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { path: 'contact', component: ContactPage },
  { path: 'checkout', component: CheckoutPage },
  { path: 'about', component: AboutPage },
  { path: 'profile', component: ProfilePage, canActivate: [authGuard] },
  { path: 'wishlist', component: WishlistPage, canActivate: [authGuard] },

  // ADMIN
  { path: 'admin', component: AdminDashboard },
  { path: 'admin/products', component: AdminDashboard },
  { path: 'admin/categories', component: AdminCategories },
  { path: 'admin/add-product', component: AdminAddProduct },
  { path: 'admin/edit-product/:id', component: AdminAddProduct },
  { path: 'admin/customers', component: AdminCustomers },
  { path: 'admin/orders', component: AdminOrders },
  { path: 'admin/stats', component: AdminStats },
  { path: 'admin/settings', component: AdminSettings },
  { path: 'admin/coupons', component: AdminCoupons },
  { path: 'admin/notifications', component: AdminNotifications },
  { path: 'admin/logs', component: AdminAudit },

  { path: '**', component: NotFound }
];