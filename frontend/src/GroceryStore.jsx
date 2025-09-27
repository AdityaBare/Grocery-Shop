import React, { useState, useEffect } from 'react';

const GroceryStore = () => {
  // State management
  // Derived values from cart
  

  const [currentPage, setCurrentPage] = useState('home');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [view, setView] = useState("shop");
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '', email: '', password: '', phone: '', address: ''
  });
const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  // API Base URL
  const API_BASE = 'http://localhost:5000/api';

  // Initialize app
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const savedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const savedToken = localStorage.getItem('token');
    
    setCart(savedCart);
    setCurrentUser(savedUser);
    setToken(savedToken);
    
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Failed to load products');
        // Fallback to sample data if API fails
        setProducts([
          { _id: '1', name: 'Fresh Apples', description: 'Crisp and sweet red apples', price: 120, category: 'fruits', stock: 50, unit: 'kg' },
          { _id: '2', name: 'Organic Bananas', description: 'Ripe yellow bananas', price: 60, category: 'fruits', stock: 30, unit: 'dozen' },
          { _id: '3', name: 'Fresh Carrots', description: 'Crunchy orange carrots', price: 40, category: 'vegetables', stock: 25, unit: 'kg' },
          { _id: '4', name: 'Fresh Milk', description: 'Full cream milk', price: 55, category: 'dairy', stock: 20, unit: 'liter' },
          { _id: '5', name: 'Chicken Breast', description: 'Fresh chicken breast', price: 280, category: 'meat', stock: 15, unit: 'kg' },
          { _id: '6', name: 'Basmati Rice', description: 'Premium quality basmati rice', price: 85, category: 'grains', stock: 40, unit: 'kg' }
        ]);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      // Fallback to sample data if API fails
      setProducts([
        { _id: '1', name: 'Fresh Apples', description: 'Crisp and sweet red apples', price: 120, category: 'fruits', stock: 50, unit: 'kg' },
        { _id: '2', name: 'Organic Bananas', description: 'Ripe yellow bananas', price: 60, category: 'fruits', stock: 30, unit: 'dozen' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getProductIcon = (category) => {
    const icons = {
      fruits: 'apple-alt',
      vegetables: 'carrot',
      dairy: 'cheese',
      meat: 'drumstick-bite',
      grains: 'seedling',
      beverages: 'coffee',
      snacks: 'cookie'
    };
    return icons[category] || 'shopping-bag';
  };

  const addToCart = (productId, quantity = 1) => {
    const product = products.find(p => p._id === productId);
    
    if (!product || quantity <= 0 || quantity > product.stock) {
      alert('Invalid quantity');
      return;
    }
    
    const existingItem = cart.find(item => item.productId === productId);
    let newCart;
    
    if (existingItem) {
      newCart = cart.map(item => 
        item.productId === productId 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newCart = [...cart, {
        productId: productId,
        name: product.name,
        price: product.price,
        quantity: quantity,
        unit: product.unit
      }];
    }
    
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    alert(`${product.name} added to cart!`);
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter(item => item.productId !== productId);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_BASE}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentUser(data.user);
        setToken(data.token);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        setCurrentPage('home');
        alert('Login successful!');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Network error. Please try again.');
    }
    
    setLoginData({ email: '', password: '' });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_BASE}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData)
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration successful! Please login.');
        setCurrentPage('login');
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Network error. Please try again.');
    }
    
    setRegisterData({ name: '', email: '', password: '', phone: '', address: '' });
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    setCurrentPage('home');
  };

  const checkout = async () => {
    if (!currentUser) {
      alert('Please login to place an order');
      setCurrentPage('login');
      return;
    }
    
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }
    
    const deliveryAddress = prompt('Enter delivery address:');
    if (!deliveryAddress) return;
    
    try {
      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          })),
          deliveryAddress: { street: deliveryAddress }
        })
      });

      const data = await response.json();

      if (response.ok) {
        setCart([]);
        localStorage.setItem('cart', JSON.stringify([]));
        alert('Order placed successfully!');
        setCurrentPage('orders');
        loadUserOrders(); // Refresh orders
      } else {
        alert(data.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Network error. Please try again.');
    }
  };

  const loadUserOrders = async () => {
    if (!token) return;
    
    try {
      const response = await fetch(`${API_BASE}/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error('Failed to load orders');
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Load orders when user goes to orders page
  useEffect(() => {
    if (currentPage === 'orders' && currentUser && token) {
      loadUserOrders();
    }
  }, [currentPage, currentUser, token]);

  const ProductCard = ({ product }) => {
    const [quantity, setQuantity] = useState(1);
    
    return (
      <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
        <div className="bg-gradient-to-br from-green-400 to-green-600 h-48 flex items-center justify-center text-white text-6xl">
          <i className={`fas fa-${getProductIcon(product.category)}`}></i>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 text-gray-800">{product.name}</h3>
          <p className="text-gray-600 mb-3 text-sm">{product.description}</p>
          <p className="text-2xl font-bold text-green-500 mb-2">₹{product.price}/{product.unit}</p>
          <p className="text-sm text-gray-500 mb-4">Stock: {product.stock} {product.unit}</p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-16 px-2 py-1 border-2 border-gray-300 rounded text-center"
            />
            <button
              onClick={() => addToCart(product._id, quantity)}
              disabled={product.stock === 0}
              className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300 disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              <i className="fas fa-cart-plus"></i> Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg">
        <nav className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap justify-between items-center">
          <div className="text-2xl font-bold flex items-center gap-2">
            <i className="fas fa-shopping-basket"></i>
            OM SAIRAM
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <button 
              onClick={() => setCurrentPage('home')}
              className="px-3 py-2 bg-transparent border-2 border-white rounded-full hover:bg-white hover:text-green-500 transition-all duration-300 flex items-center gap-1 text-sm md:text-base"
            >
              <i className="fas fa-home"></i> Home
            </button>
            <button 
              onClick={() => setCurrentPage('cart')}
              className="px-3 py-2 bg-transparent border-2 border-white rounded-full hover:bg-white hover:text-green-500 transition-all duration-300 flex items-center gap-1 relative text-sm md:text-base"
            >
              <i className="fas fa-shopping-cart"></i> Cart
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
            
            {!currentUser ? (
              <>
                <button 
                  onClick={() => setCurrentPage('login')}
                  className="px-3 py-2 bg-transparent border-2 border-white rounded-full hover:bg-white hover:text-green-500 transition-all duration-300 text-sm md:text-base"
                >
                  Login
                </button>
                <button 
                  onClick={() => setCurrentPage('register')}
                  className="px-3 py-2 bg-white text-green-500 rounded-full hover:bg-green-100 transition-all duration-300 text-sm md:text-base"
                >
                  Register
                </button>
              </>
            ) : (
              <>
                <span className="text-green-100 text-sm">Hello, {currentUser.name}</span>
                <button 
                  onClick={() => setCurrentPage('orders')}
                  className="px-3 py-2 bg-transparent border-2 border-white rounded-full hover:bg-white hover:text-green-500 transition-all duration-300 text-sm md:text-base"
                >
                  Orders
                </button>
                {currentUser.role === 'admin' && (
                  <button 
                    onClick={() => setCurrentPage('admin')}
                    className="px-3 py-2 bg-transparent border-2 border-white rounded-full hover:bg-white hover:text-green-500 transition-all duration-300 text-sm md:text-base"
                  >
                    Admin
                  </button>
                )}
                <button 
                  onClick={logout}
                  className="px-3 py-2 bg-white text-green-500 rounded-full hover:bg-green-100 transition-all duration-300 text-sm md:text-base"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Home Page */}
        {currentPage === 'home' && (
          <div>
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-8 md:p-12 text-center mb-8 shadow-lg">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">Fresh Groceries, Ready When You Are</h1>
              <p className="text-lg md:text-xl mb-8 text-green-100">Skip the wait — order online and pick up from home or store</p>
              <button 
                onClick={() => document.getElementById('searchBox')?.focus()}
                className="bg-white text-green-500 px-6 md:px-8 py-3 rounded-full font-semibold hover:bg-green-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <i className="fas fa-search mr-2"></i> Shop Now
              </button>
            </div>

            {/* Search and Filter */}
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-md mb-8 flex flex-col md:flex-row gap-4">
              <input
                id="searchBox"
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-full focus:border-green-500 focus:outline-none"
              />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-full focus:border-green-500 focus:outline-none"
              >
                <option value="">All Categories</option>
                <option value="fruits">Fruits</option>
                <option value="vegetables">Vegetables</option>
                <option value="dairy">Dairy</option>
                <option value="meat">Meat</option>
                <option value="grains">Grains</option>
                <option value="beverages">Beverages</option>
                <option value="snacks">Snacks</option>
              </select>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Cart Page */}
        {currentPage === 'cart' && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Shopping Cart</h2>
            <div className="bg-white rounded-xl shadow-md p-6">
              {cart.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Your cart is empty</p>
              ) : (
                <>
                  {cart.map(item => (
                    <div key={item.productId} className="flex items-center justify-between py-4 border-b border-gray-200">
                      <div>
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-green-500 font-semibold">
                          ₹{item.price}/{item.unit} × {item.quantity} = ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition-colors duration-300"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  ))}
                  <div className="text-right pt-4">
                    <p className="text-2xl font-bold text-green-500 mb-4">Total: ₹{cartTotal.toFixed(2)}</p>
                    <button
                      onClick={checkout}
                      className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors duration-300 font-semibold"
                    >
                      <i className="fas fa-credit-card mr-2"></i> Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Login Page */}
        {currentPage === 'login' && (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
              <div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                    placeholder="admin@test.com for admin access"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">Password</label>
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                    placeholder="admin123 for admin access"
                  />
                </div>
                <button
                  onClick={handleLogin}
                  className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors duration-300 font-semibold"
                >
                  <i className="fas fa-sign-in-alt mr-2"></i> Login
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Register Page */}
        {currentPage === 'register' && (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-6 text-center">Register</h2>
              <div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                  <input
                    type="text"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">Password</label>
                  <input
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                  <input
                    type="tel"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">Address</label>
                  <textarea
                    rows={3}
                    value={registerData.address}
                    onChange={(e) => setRegisterData({...registerData, address: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleRegister}
                  className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors duration-300 font-semibold"
                >
                  <i className="fas fa-user-plus mr-2"></i> Register
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Orders Page */}
        {currentPage === 'orders' && (
          <div>
            <h2 className="text-3xl font-bold mb-6">My Orders</h2>
            {orders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <p className="text-gray-500">No orders found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order._id} className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold">Order #{order._id.slice(-6)}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        order.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                        order.status === 'confirmed' ? 'bg-green-200 text-green-800' :
                        order.status === 'shipped' ? 'bg-blue-200 text-blue-800' :
                        'bg-gray-200 text-gray-800'
                      }`}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                      {order.items.map(item => (
                        <div key={item.productId}>
                          {item.name} × {item.quantity} = ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <div className="text-2xl font-bold text-green-500">Total: ₹{order.totalAmount.toFixed(2)}</div>
                      <div className="text-gray-500">Ordered on: {new Date(order.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Admin Page */}
        {currentPage === 'admin' && currentUser?.role === 'admin' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Admin Panel</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <div className="text-3xl font-bold text-green-500 mb-2">{products.length}</div>
                <div className="text-gray-600">Total Products</div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <div className="text-3xl font-bold text-green-500 mb-2">{orders.length}</div>
                <div className="text-gray-600">Total Orders</div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <div className="text-3xl font-bold text-green-500 mb-2">
                  {orders.filter(order => order.status === 'pending').length}
                </div>
                <div className="text-gray-600">Pending Orders</div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <div className="text-3xl font-bold text-green-500 mb-2">
                  ₹{orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}
                </div>
                <div className="text-gray-600">Total Revenue</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
              {orders.length === 0 ? (
                <p className="text-gray-500">No orders found</p>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 5).map(order => (
                    <div key={order._id} className="border-b border-gray-200 pb-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">Order #{order._id.slice(-6)}</h4>
                        <span className={`px-2 py-1 rounded text-sm ${
                          order.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                          order.status === 'confirmed' ? 'bg-green-200 text-green-800' :
                          'bg-blue-200 text-blue-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>Total: ₹{order.totalAmount.toFixed(2)}</div>
                        <div>Date: {new Date(order.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default GroceryStore;