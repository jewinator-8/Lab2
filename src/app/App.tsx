import { useState } from 'react';

type DoughType = 'normal' | 'integral' | 'glutenFree';
type Filling = 'chocolate' | 'vanilla' | 'caramel' | 'strawberry' | 'nutella';
type Topping = 'banana' | 'strawberries' | 'blueberries' | 'nuts' | 'chocolateChips' | 'whippedCream';

interface Pancake {
  id: string;
  dough: DoughType;
  filling: Filling;
  toppings: Topping[];
  quantity: number;
  price: number;
}

interface User {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface Order {
  id: string;
  items: Pancake[];
  total: number;
  date: string;
  status: string;
}

type Page = 'home' | 'design' | 'cart' | 'profile' | 'login' | 'register';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [cart, setCart] = useState<Pancake[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  // Design pancake state
  const [selectedDough, setSelectedDough] = useState<DoughType>('normal');
  const [selectedFilling, setSelectedFilling] = useState<Filling>('chocolate');
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
  const [quantity, setQuantity] = useState(1);

  const doughPrices = { normal: 50, integral: 70, glutenFree: 90 };
  const fillingPrices = { chocolate: 30, vanilla: 30, caramel: 35, strawberry: 35, nutella: 40 };
  const toppingPrices = { banana: 15, strawberries: 20, blueberries: 25, nuts: 20, chocolateChips: 15, whippedCream: 10 };

  const doughLabels = { normal: 'Нормално', integral: 'Интегрално', glutenFree: 'Безглутенско' };
  const fillingLabels = { chocolate: 'Чоколадо', vanilla: 'Ванила', caramel: 'Карамела', strawberry: 'Јагода', nutella: 'Нутела' };
  const toppingLabels = { banana: 'Банана', strawberries: 'Јагоди', blueberries: 'Боровинки', nuts: 'Јатки', chocolateChips: 'Чоколадни парчиња', whippedCream: 'Шлаг' };

  const calculatePrice = () => {
    let price = doughPrices[selectedDough] + fillingPrices[selectedFilling];
    selectedToppings.forEach(topping => {
      price += toppingPrices[topping];
    });
    return price;
  };

  const toggleTopping = (topping: Topping) => {
    if (selectedToppings.includes(topping)) {
      setSelectedToppings(selectedToppings.filter(t => t !== topping));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const addToCart = () => {
    const pancake: Pancake = {
      id: Date.now().toString(),
      dough: selectedDough,
      filling: selectedFilling,
      toppings: [...selectedToppings],
      quantity: quantity,
      price: calculatePrice()
    };
    setCart([...cart, pancake]);
    setSelectedDough('normal');
    setSelectedFilling('chocolate');
    setSelectedToppings([]);
    setQuantity(1);
    setCurrentPage('cart');
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart(cart.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const completeOrder = () => {
    if (cart.length === 0) return;

    const order: Order = {
      id: Date.now().toString(),
      items: [...cart],
      total: getCartTotal(),
      date: new Date().toLocaleDateString('mk-MK'),
      status: 'Завршена'
    };

    setOrders([...orders, order]);
    setCart([]);
    alert('Нарачката е успешно завршена!');
    setCurrentPage('profile');
  };

  const handleLogin = (email: string, password: string) => {
    setUser({
      name: 'Корисник',
      email: email,
      phone: '+389 70 123 456',
      address: 'ул. Македонија бр. 1, Скопје'
    });
    setCurrentPage('home');
  };

  const handleRegister = (name: string, email: string, password: string, phone: string) => {
    setUser({
      name: name,
      email: email,
      phone: phone,
      address: ''
    });
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setUser(null);
    setOrders([]);
    setCurrentPage('home');
  };

  return (
    <div style={{ backgroundColor: '#f0f0f0', minHeight: '100vh', padding: '10px' }}>
      {/* Navigation */}
      <div style={{ backgroundColor: 'white', border: '1px solid black', padding: '10px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0 }}>ПАЛАМАКС - Нарачка на палачинки</h1>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setCurrentPage('home')}
              style={{ padding: '5px 10px', cursor: 'pointer' }}
            >
              Дома
            </button>
            <button
              onClick={() => setCurrentPage('cart')}
              style={{ padding: '5px 10px', cursor: 'pointer' }}
            >
              Корпа ({cart.length})
            </button>
            {user ? (
              <button
                onClick={() => setCurrentPage('profile')}
                style={{ padding: '5px 10px', cursor: 'pointer' }}
              >
                Профил ({user.name})
              </button>
            ) : (
              <button
                onClick={() => setCurrentPage('login')}
                style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: '#ddd' }}
              >
                Најава
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {currentPage === 'home' && (
          <div>
            <h2>Добредојдовте!</h2>
            <p>Нарачај палачинки онлајн</p>
            <br />
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ backgroundColor: 'white', border: '1px solid black', padding: '20px', flex: 1 }}>
                <h3>Дизајнирај палачинка</h3>
                <p>Избери тесто, фил и додатоци</p>
                <button
                  onClick={() => setCurrentPage('design')}
                  style={{ padding: '10px 20px', cursor: 'pointer', marginTop: '10px' }}
                >
                  Започни
                </button>
              </div>
              <div style={{ backgroundColor: 'white', border: '1px solid black', padding: '20px', flex: 1 }}>
                <h3>Твоите нарачки</h3>
                <p>Погледни ги претходните нарачки</p>
                <button
                  onClick={() => user ? setCurrentPage('profile') : setCurrentPage('login')}
                  style={{ padding: '10px 20px', cursor: 'pointer', marginTop: '10px' }}
                >
                  {user ? 'Профил' : 'Најави се'}
                </button>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'design' && (
          <div>
            <h2>Дизајнирај палачинка</h2>
            <div style={{ backgroundColor: 'white', border: '1px solid black', padding: '20px' }}>

              <div style={{ marginBottom: '20px' }}>
                <h3>1. Избери тесто:</h3>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  {(Object.keys(doughPrices) as DoughType[]).map(dough => (
                    <button
                      key={dough}
                      onClick={() => setSelectedDough(dough)}
                      style={{
                        padding: '10px',
                        border: selectedDough === dough ? '3px solid black' : '1px solid gray',
                        backgroundColor: selectedDough === dough ? '#ffff99' : 'white',
                        cursor: 'pointer'
                      }}
                    >
                      {doughLabels[dough]}<br />
                      {doughPrices[dough]} ден
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3>2. Избери фил:</h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                  {(Object.keys(fillingPrices) as Filling[]).map(filling => (
                    <button
                      key={filling}
                      onClick={() => setSelectedFilling(filling)}
                      style={{
                        padding: '10px',
                        border: selectedFilling === filling ? '3px solid black' : '1px solid gray',
                        backgroundColor: selectedFilling === filling ? '#ffff99' : 'white',
                        cursor: 'pointer'
                      }}
                    >
                      {fillingLabels[filling]}<br />
                      {fillingPrices[filling]} ден
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3>3. Избери додатоци (можеш да избереш повеќе):</h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                  {(Object.keys(toppingPrices) as Topping[]).map(topping => (
                    <button
                      key={topping}
                      onClick={() => toggleTopping(topping)}
                      style={{
                        padding: '10px',
                        border: selectedToppings.includes(topping) ? '3px solid black' : '1px solid gray',
                        backgroundColor: selectedToppings.includes(topping) ? '#ffff99' : 'white',
                        cursor: 'pointer'
                      }}
                    >
                      {toppingLabels[topping]}<br />
                      {toppingPrices[topping]} ден
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3>4. Количина:</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ padding: '5px 15px', cursor: 'pointer' }}
                  >
                    -
                  </button>
                  <span style={{ fontSize: '20px' }}>{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    style={{ padding: '5px 15px', cursor: 'pointer' }}
                  >
                    +
                  </button>
                </div>
              </div>

              <hr />
              <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div>
                    <div>Цена по парче:</div>
                    <div style={{ fontSize: '20px' }}><b>{calculatePrice()} ден</b></div>
                  </div>
                  <div>
                    <div>Вкупно:</div>
                    <div style={{ fontSize: '20px' }}><b>{calculatePrice() * quantity} ден</b></div>
                  </div>
                </div>
                <button
                  onClick={addToCart}
                  style={{ width: '100%', padding: '15px', cursor: 'pointer', backgroundColor: '#90EE90', fontSize: '16px' }}
                >
                  Додај во корпа
                </button>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'cart' && (
          <div>
            <h2>Корпа за нарачки</h2>
            {cart.length === 0 ? (
              <div style={{ backgroundColor: 'white', border: '1px solid black', padding: '40px', textAlign: 'center' }}>
                <p>Вашата корпа е празна</p>
                <button
                  onClick={() => setCurrentPage('design')}
                  style={{ padding: '10px 20px', cursor: 'pointer', marginTop: '20px' }}
                >
                  Дизајнирај палачинка
                </button>
              </div>
            ) : (
              <div style={{ backgroundColor: 'white', border: '1px solid black', padding: '20px' }}>
                <div>
                  {cart.map(item => (
                    <div key={item.id} style={{ border: '1px solid gray', padding: '15px', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          <h3><b>Палачинка #{item.id.slice(-4)}</b></h3>
                          <div style={{ marginTop: '10px' }}>
                            <div>Тесто: {doughLabels[item.dough]}</div>
                            <div>Фил: {fillingLabels[item.filling]}</div>
                            {item.toppings.length > 0 && (
                              <div>Додатоци: {item.toppings.map(t => toppingLabels[t]).join(', ')}</div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: '#ffcccc' }}
                        >
                          Избриши
                        </button>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            style={{ padding: '5px 10px', cursor: 'pointer' }}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            style={{ padding: '5px 10px', cursor: 'pointer' }}
                          >
                            +
                          </button>
                        </div>
                        <div>
                          <b>{item.price * item.quantity} ден</b>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <hr />
                <div style={{ marginTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <span><b>Вкупно:</b></span>
                    <span style={{ fontSize: '24px' }}><b>{getCartTotal()} ден</b></span>
                  </div>
                  <button
                    onClick={completeOrder}
                    style={{ width: '100%', padding: '15px', cursor: 'pointer', backgroundColor: '#90EE90', marginBottom: '10px', fontSize: '16px' }}
                  >
                    Заврши нарачка
                  </button>
                  <button
                    onClick={() => setCurrentPage('design')}
                    style={{ width: '100%', padding: '10px', cursor: 'pointer', backgroundColor: '#ddd' }}
                  >
                    Додај уште палачинки
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {currentPage === 'login' && (
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div style={{ backgroundColor: 'white', border: '1px solid black', padding: '20px' }}>
              <h2>Најава</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleLogin(
                  formData.get('email') as string,
                  formData.get('password') as string
                );
              }}>
                <div style={{ marginBottom: '15px' }}>
                  <label>Email:</label>
                  <br />
                  <input
                    type="email"
                    name="email"
                    required
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    placeholder="vashemail@primer.com"
                  />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label>Лозинка:</label>
                  <br />
                  <input
                    type="password"
                    name="password"
                    required
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  />
                </div>
                <button
                  type="submit"
                  style={{ width: '100%', padding: '10px', cursor: 'pointer', backgroundColor: '#90EE90', marginBottom: '15px' }}
                >
                  Најави се
                </button>
              </form>
              <div>
                Немате профил?
                <button
                  onClick={() => setCurrentPage('register')}
                  style={{ marginLeft: '5px', textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none', color: 'blue' }}
                >
                  Регистрирајте се
                </button>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'register' && (
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div style={{ backgroundColor: 'white', border: '1px solid black', padding: '20px' }}>
              <h2>Регистрација</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleRegister(
                  formData.get('name') as string,
                  formData.get('email') as string,
                  formData.get('password') as string,
                  formData.get('phone') as string
                );
              }}>
                <div style={{ marginBottom: '15px' }}>
                  <label>Име и презиме:</label>
                  <br />
                  <input
                    type="text"
                    name="name"
                    required
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    placeholder="Вашето име"
                  />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label>Email:</label>
                  <br />
                  <input
                    type="email"
                    name="email"
                    required
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    placeholder="vashemail@primer.com"
                  />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label>Телефон:</label>
                  <br />
                  <input
                    type="tel"
                    name="phone"
                    required
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    placeholder="+389 70 123 456"
                  />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label>Лозинка:</label>
                  <br />
                  <input
                    type="password"
                    name="password"
                    required
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  />
                </div>
                <button
                  type="submit"
                  style={{ width: '100%', padding: '10px', cursor: 'pointer', backgroundColor: '#90EE90', marginBottom: '15px' }}
                >
                  Регистрирај се
                </button>
              </form>
              <div>
                Веќе имате профил?
                <button
                  onClick={() => setCurrentPage('login')}
                  style={{ marginLeft: '5px', textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none', color: 'blue' }}
                >
                  Најави се
                </button>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'profile' && (
          <div>
            <div style={{ backgroundColor: 'white', border: '1px solid black', padding: '20px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h2>Кориснички профил</h2>
                  {user && (
                    <div style={{ marginTop: '15px' }}>
                      <div><b>Име:</b> {user.name}</div>
                      <div><b>Email:</b> {user.email}</div>
                      <div><b>Телефон:</b> {user.phone}</div>
                      {user.address && <div><b>Адреса:</b> {user.address}</div>}
                    </div>
                  )}
                </div>
                {user && (
                  <button
                    onClick={handleLogout}
                    style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#ffcccc', height: 'fit-content' }}
                  >
                    Одјави се
                  </button>
                )}
              </div>
            </div>

            <div style={{ backgroundColor: 'white', border: '1px solid black', padding: '20px' }}>
              <h3>Претходни нарачки</h3>
              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px' }}>
                  <p>Немате претходни нарачки</p>
                  <button
                    onClick={() => setCurrentPage('design')}
                    style={{ padding: '10px 20px', cursor: 'pointer', marginTop: '20px', backgroundColor: '#90EE90' }}
                  >
                    Нарачај сега
                  </button>
                </div>
              ) : (
                <div style={{ marginTop: '20px' }}>
                  {orders.map(order => (
                    <div key={order.id} style={{ border: '1px solid gray', padding: '15px', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div>
                          <h4><b>Нарачка #{order.id.slice(-4)}</b></h4>
                          <div>Датум: {order.date}</div>
                        </div>
                        <span style={{ backgroundColor: '#ccffcc', padding: '5px 10px' }}>
                          {order.status}
                        </span>
                      </div>
                      <div style={{ marginBottom: '10px' }}>
                        {order.items.map((item, idx) => (
                          <div key={idx}>
                            {item.quantity}x {fillingLabels[item.filling]} палачинка - {item.price * item.quantity} ден
                          </div>
                        ))}
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <b>Вкупно: {order.total} ден</b>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
