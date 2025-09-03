/**
 * Payment Related Types
 * E-commerce and payment processing types
 */

import { TelegramUser } from './core.types.js';
import { Chat } from './chat.types.js';

/**
 * Shipping address
 */
export interface ShippingAddress {
  country_code: string;
  state: string;
  city: string;
  street_line1: string;
  street_line2: string;
  post_code: string;
}

/**
 * Order information
 */
export interface OrderInfo {
  name?: string;
  phone_number?: string;
  email?: string;
  shipping_address?: ShippingAddress;
}

/**
 * Shipping query for e-commerce
 */
export interface ShippingQuery {
  id: string;
  from: TelegramUser;
  invoice_payload: string;
  shipping_address: ShippingAddress;
}

/**
 * Pre-checkout query before payment
 */
export interface PreCheckoutQuery {
  id: string;
  from: TelegramUser;
  currency: string;
  total_amount: number;
  invoice_payload: string;
  shipping_option_id?: string;
  order_info?: OrderInfo;
}

/**
 * Paid media purchase confirmation
 */
export interface PaidMediaPurchased {
  user: TelegramUser;
  chat: Chat;
  message_id: number;
  invoice_payload: string;
}
