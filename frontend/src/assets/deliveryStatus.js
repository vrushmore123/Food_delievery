export const deliveryStatus = [
  {
    id: 1,
    status: 'preparing',
    title: 'Preparing your order',
    description: 'The restaurant is preparing your food',
    icon: '👨‍🍳',
    time: '2:45 PM',
    active: true
  },
  {
    id: 2,
    status: 'ready',
    title: 'Order ready',
    description: 'Your order is packed and ready for delivery',
    icon: '📦',
    time: '3:00 PM',
    active: false
  },
  {
    id: 3,
    status: 'on-the-way',
    title: 'On the way',
    description: 'Your delivery partner is on the way',
    icon: '🚴',
    time: '3:15 PM',
    active: false
  },
  {
    id: 4,
    status: 'delivered',
    title: 'Delivered',
    description: 'Enjoy your meal!',
    icon: '🎉',
    time: '3:30 PM',
    active: false
  }
];