import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
//port Login from './Login/Login.jsx/';
import Header from "./Header/header.jsx";
import CaseList from "./CaseList/CaseList.jsx";
import CreateCase from "./CreateCase/CreateCase.jsx";
import ProfilePage from "./ProfilePage/ProfilePage.jsx";
import NotificationBell from "./Notification/NotificationBell.jsx";
import APITest from "./APITest.jsx";

function App() {
  // return(
  //   <Router>
  //     <Header />
  //     <Routes>
  //       <Route path="/CaseList" element={<CaseList />} />
  //       <Route path="/CreateCase" element={<CreateCase />} />
  //       <Route path="/ProfilePage" element={<ProfilePage />} />
  //     </Routes>
  //   </Router>
  //     <></>
  // );

  return <APITest />;
}

export default App;
