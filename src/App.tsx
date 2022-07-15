import './App.css';
import CartProvider from './context/CartContext';
import Cart from './containers/Cart';

function App() {
  return (
    <CartProvider>
      <main className='App'>
        <h1>Checkout Service</h1>
        <Cart />
      </main>
    </CartProvider>
  )
}

export default App;
