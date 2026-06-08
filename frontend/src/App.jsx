import { ThemeProvider } from './context/ThemeContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<div className="container" style={{paddingTop:'40px'}}>Trang Sản phẩm (Coming soon)</div>} />
            <Route path="cart" element={<div className="container" style={{paddingTop:'40px'}}>Trang Giỏ hàng (Coming soon)</div>} />
            <Route path="login" element={<div className="container" style={{paddingTop:'40px'}}>Trang Đăng nhập (Coming soon)</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
