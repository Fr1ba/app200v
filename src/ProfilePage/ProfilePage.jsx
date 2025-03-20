import React from "react";
import styles from "./ProfilePage.module.css";
import { CiMail } from "react-icons/ci";
import { LuPhone } from "react-icons/lu"; // kjør npm install react-icons
/*<LuPhone /> 
<CiMail />
*/

function ProfilePage() {
  return (
    <>
      <h1 className={styles.title}>Profil</h1>
      <div className={styles.wrapper}>
        <form>
          <label className={styles.inputlabel}>
            Epost
            <div className={styles.inputField}>
              <input type="text" placeholder="gbergheyghre@mail.com" />
              <CiMail className={styles.icon} />
            </div>
          </label>
          <label className={styles.inputLabel}>
            Mobil
            <div className={styles.inputField}>
              <input type="text" placeholder="+47 93145789" />
              <LuPhone className={styles.icon} />
            </div>
          </label>
          <input
            type="submit"
            className={styles.buttons}
            value="Lagre endringer"
          ></input>
          <input
            type="button"
            className={styles.buttons}
            value="Logg ut"
          ></input>
        </form>
      </div>
    </>
  );
}

export default ProfilePage();
