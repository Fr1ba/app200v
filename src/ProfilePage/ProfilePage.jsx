import React from "react";
import "./ProfilePage.css";
import { CiMail } from "react-icons/ci";
import { LuPhone } from "react-icons/lu"; // kjør npm install react-icons
/*<LuPhone /> 
<CiMail />
*/

export default function ProfilePage() {
  return (
    <>
      <h1>Profil</h1>
      <div className="wrapper">
        <form>
          <label className="inputLabel">
            Epost
            <div className="inputField">
              <input type="text" placeholder="gbergheyghre@mail.com" />
              <CiMail className="icon" />
            </div>
          </label>
          <label className="inputLabel">
            Mobil
            <div className="inputField">
              <input type="text" placeholder="+47 93145789" />
              <LuPhone className="icon" />
            </div>
          </label>
          <input
            type="submit"
            className="buttons"
            value="Lagre endringer"
          ></input>
          <input type="button" className="buttons" value="Logg ut"></input>
        </form>
      </div>
    </>
  );
}
