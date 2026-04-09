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

export const routes: Routes = [
  { path: '', component: Homepage },
  { path: 'products', component: ProductList },
  { path: 'products/:id', component: ProductDetail },
  { path: 'cart', component: CartPage },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { path: 'contact', component: ContactPage },
  { path: 'checkout', component: CheckoutPage },
  { path: 'about', component: AboutPage },
  { path: '**', component: NotFound }
];