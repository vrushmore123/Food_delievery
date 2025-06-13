export interface FoodItem {
  id: string | number;
  name: string;
  price: number;
  imageUrl: string;
  restaurant: string;
  description?: string;
}

export interface CartItem extends FoodItem {
  quantity: number;
  specialInstructions?: string;
}

export interface DateGroup {
  date: string; // format: ISO string
  items: CartItem[];
  deliveryTime: string;
  isExpanded: boolean;
}

export interface CartState {
  dateGroups: Record<string, DateGroup>;
  isRecurring: boolean;
  recurringFrequency?: 'weekly' | 'bi-weekly' | 'monthly';
}
