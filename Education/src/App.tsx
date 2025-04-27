import { BrowserRouter } from 'react-router-dom';
import Layout from './modules/admin/index';
import Navigate from './modules/admin/navigate/navigate';

const App = () => {
  return (
    <BrowserRouter>
      <div className="font-family">
        <Layout>
          <Navigate />
        </Layout>
      </div>
    </BrowserRouter>
  );
};

export default App;