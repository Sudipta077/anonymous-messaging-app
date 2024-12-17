import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Message from './pages/Message';
import Register from './pages/Register';
import {BrowserRouter, Routes,Route} from 'react-router-dom';

function App() {


  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/send/:username' element={<Message/>}/>



      </Routes>
    </BrowserRouter>
  );
}

export default App;
