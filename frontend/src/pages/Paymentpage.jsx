import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentPage = ({ cart, completeOrder, user }) => {
  const navigate = useNavigate();
  const [address, setAddress] = useState(user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [qrCodeShown, setQrCodeShown] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 29;
  const total = subtotal + deliveryFee;

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (paymentMethod === 'qr-code') {
      setQrCodeShown(true);
      setTimeout(() => {
        completeOrderAndNavigate();
      }, 3000);
    } else {
      completeOrderAndNavigate();
    }
  };

  const completeOrderAndNavigate = () => {
    completeOrder({
      total,
      address,
      paymentMethod,
      deliveryInstructions,
      cardDetails: paymentMethod === 'credit-card' ? cardDetails : null,
      status: 'preparing',
      deliveryStatus: [
        { id: 1, status: 'preparing', title: 'Preparing your order', description: 'The restaurant is preparing your food', icon: '👨‍🍳', time: new Date().toLocaleTimeString(), active: true },
        { id: 2, status: 'ready', title: 'Order ready', description: 'Your order is packed and ready for delivery', icon: '📦', time: '', active: false },
        { id: 3, status: 'on-the-way', title: 'On the way', description: 'Your delivery partner is on the way', icon: '🚴', time: '', active: false },
        { id: 4, status: 'delivered', title: 'Delivered', description: 'Enjoy your meal!', icon: '🎉', time: '', active: false }
      ]
    });
    setOrderCompleted(true);
  };

  if (orderCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h1 className="text-2xl font-bold mb-4">Order Confirmed!</h1>
          <p className="mb-6">Your food is being prepared and will arrive soon.</p>
          <button
            onClick={() => navigate('/restaurants')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Track Your Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-6">
              <h1 className="text-2xl font-bold mb-6">Complete Your Order</h1>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-3">Delivery Address</h2>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-3"
                    rows="4"
                    required
                    placeholder="Enter your full delivery address"
                  />
                </div>
                
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-3">Delivery Instructions</h2>
                  <textarea
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-3"
                    rows="2"
                    placeholder="Any special instructions for delivery?"
                  />
                </div>
                
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-3">Payment Method</h2>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credit-card"
                        checked={paymentMethod === 'credit-card'}
                        onChange={() => setPaymentMethod('credit-card')}
                        className="h-5 w-5"
                      />
                      <span>Credit/Debit Card</span>
                    </label>
                    
                    {paymentMethod === 'credit-card' && (
                      <div className="ml-8 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                          <input
                            type="text"
                            name="number"
                            value={cardDetails.number}
                            onChange={handleCardChange}
                            className="w-full border border-gray-300 rounded-md p-2"
                            placeholder="1234 5678 9012 3456"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                          <input
                            type="text"
                            name="name"
                            value={cardDetails.name}
                            onChange={handleCardChange}
                            className="w-full border border-gray-300 rounded-md p-2"
                            placeholder="John Doe"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                            <input
                              type="text"
                              name="expiry"
                              value={cardDetails.expiry}
                              onChange={handleCardChange}
                              className="w-full border border-gray-300 rounded-md p-2"
                              placeholder="MM/YY"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                            <input
                              type="text"
                              name="cvv"
                              value={cardDetails.cvv}
                              onChange={handleCardChange}
                              className="w-full border border-gray-300 rounded-md p-2"
                              placeholder="123"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="mobile-pay"
                        checked={paymentMethod === 'mobile-pay'}
                        onChange={() => setPaymentMethod('mobile-pay')}
                        className="h-5 w-5"
                      />
                      <span>MobilePay</span>
                    </label>
                    
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="qr-code"
                        checked={paymentMethod === 'qr-code'}
                        onChange={() => setPaymentMethod('qr-code')}
                        className="h-5 w-5"
                      />
                      <span>QR Code Payment</span>
                    </label>
                  </div>
                </div>
                
                {qrCodeShown && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-md text-center">
                    <div className="text-lg font-semibold mb-2">Scan QR Code to Pay</div>
                    <div className="flex justify-center">
                      <div className="w-48 h-48 bg-white border-2 border-gray-300 flex items-center justify-center">
                        <div className="text-4xl">🎯</div>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">Scan with your mobile banking app</div>
                  </div>
                )}
                
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 font-medium"
                >
                  Complete Order ({total} DKK)
                </button>
              </form>
            </div>
            
            <div className="md:w-1/2 bg-gray-50 p-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between border-b pb-4">
                    <div className="flex items-center">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-12 h-12 object-cover rounded mr-3" 
                      />
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-600">
                          {item.quantity} × {item.price} DKK
                        </p>
                      </div>
                    </div>
                    <div className="font-medium">
                      {item.quantity * item.price} DKK
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{subtotal} DKK</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery fee</span>
                  <span>{deliveryFee} DKK</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
                  <span>Total</span>
                  <span>{total} DKK</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;