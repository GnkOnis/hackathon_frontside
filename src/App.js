import { useState } from 'react';
import './App.css';
import { onAuthStateChanged } from 'firebase/auth';
import { fireAuth } from "./firebase.ts";
import { Table } from "./Table.jsx";
import { Top } from "./Toppage.jsx";
import { SignUpPage } from "./SignUpPage.jsx";
import { Element } from "./pages/Element.jsx";
import { 
  BrowserRouter as Router,
  Routes,
  Route,
 } from 'react-router-dom';

function App():JSX.Element{
  // stateとしてログイン状態を管理する。ログインしていないときはnullになる。
  const [loginUser,setLoginUser] = useState(fireAuth.currentUser);

  // ログイン状態を監視して、stateをリアルタイムで更新する
  onAuthStateChanged(fireAuth,user => {
    setLoginUser(user);
  })

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Top />} />
          <Route path='/main' element={<Table />} />
          <Route path='/signup' element={<SignUpPage/>}/>
          <Route path='/main/element' element={<Element/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
