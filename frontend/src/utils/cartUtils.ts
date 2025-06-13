import { CartItem, CartState, DateGroup } from '../types/CartTypes';

/**
 * Format a date string into a user-friendly format (Weekday, Month Day)
 */
export const formatDateHeader = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
};

/**
 * Check if a date is today
 */
export const isToday = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

/**
 * Check if a date is tomorrow
 */
export const isTomorrow = (dateString: string): boolean => {
  const date = new Date(dateString);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return date.toDateString() === tomorrow.toDateString();
};

/**
 * Get a friendly date label
 */
export const getDateLabel = (dateString: string): string => {
  if (isToday(dateString)) return 'Today';
  if (isTomorrow(dateString)) return 'Tomorrow';
  return formatDateHeader(dateString);
};

/**
 * Calculate subtotal for a specific date group
 */
export const calculateDateGroupSubtotal = (dateGroup: DateGroup): number => {
  return dateGroup.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

/**
 * Calculate total items in a date group
 */
export const calculateDateGroupItemCount = (dateGroup: DateGroup): number => {
  return dateGroup.items.reduce((sum, item) => sum + item.quantity, 0);
};

/**
 * Calculate cart total across all date groups
 */
export const calculateCartTotal = (cart: CartState): number => {
  return Object.values(cart.dateGroups).reduce(
    (sum, dateGroup) => sum + calculateDateGroupSubtotal(dateGroup), 
    0
  );
};

/**
 * Calculate total item count across all date groups
 */
export const calculateTotalItemCount = (cart: CartState): number => {
  return Object.values(cart.dateGroups).reduce(
    (sum, dateGroup) => sum + calculateDateGroupItemCount(dateGroup), 
    0
  );
};

/**
 * Get available delivery time slots
 */
export const getDeliveryTimeSlots = (dateString: string): string[] => {
  // This could be dynamic based on the restaurant's hours, distance, etc.
  return [
    '11:00 - 11:30',
    '11:30 - 12:00',
    '12:00 - 12:30', 
    '12:30 - 13:00',
    '13:00 - 13:30',
    '18:00 - 18:30',
    '18:30 - 19:00',
    '19:00 - 19:30',
    '19:30 - 20:00',
    '20:00 - 20:30'
  ];
};

/**
 * Get default delivery time based on date
 */
export const getDefaultDeliveryTime = (dateString: string): string => {
  const slots = getDeliveryTimeSlots(dateString);
  return slots[0]; // Default to first available
};
