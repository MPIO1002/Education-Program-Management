import { BrowserRouter, useLocation } from 'react-router-dom';
import Layout from './modules/admin/index';
import Navigate from './modules/admin/navigate/navigate';

const AppContent = () => {
  const location = useLocation();

  // Kiểm tra nếu đang ở trang login
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="font-family">
      {isLoginPage ? <Navigate /> : <Layout><Navigate /></Layout>}
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;