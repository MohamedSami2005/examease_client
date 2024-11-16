import React from 'react';
// import Layout from './components/shared/Layout';
import Login from './components/login/login';
import Layout from './components/shared/layout';
import Exam from './components/exam/exam';
import Upload from './components/admin/uploadfiles/upload';
import Control from './components/admin/controls/controls';
import Students from './components/admin/student/student';
import Dashboard from './components/admin/dashboard/dashboard';
import Pass from './components/admin/pass/pass';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/student/:regNo/*' element={<Layout />} >
            <Route path='test' element={<Exam />} />
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='upload' element={<Upload />} />
            <Route path='controls' element={<Control />} />
            <Route path='students' element={<Students />} />
            <Route path='password' element={<Pass />} />
          </Route>
        </Routes>
      </Router>

    </div>
  );
}

export default App;
