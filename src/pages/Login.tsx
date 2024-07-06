import React, { useState } from "react";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonLoading,
  IonPage,
  IonToast,
} from "@ionic/react";
import { useHistory, Link } from "react-router-dom";
import firebase from "firebase/compat/app"; // Import firebase compat version
import "firebase/compat/auth"; // Import compat version of authentication module from Firebase
import { notificationsCircleOutline, eye, eyeOff } from "ionicons/icons";
import "./Login.css";
import { auth } from "../firebaseConfig";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isTouched, setIsTouched] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [error, setError] = useState("");

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await firebase.auth().signInWithEmailAndPassword(email, password);

      if (response.user) {
        localStorage.setItem("token", "yourAuthToken");
        setEmail("");
        setPassword("");
        history.push("/home");
      } else {
        setToastMessage("Authentication failed");
        setShowToast(true);
      }
    } catch (error) {
      console.error("Login error: ", error);
      setToastMessage("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
      setPassword("");

      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const validate = (event: any) => {
    const value = event.target.value;
    setIsValid(validateEmail(value));
    setEmail(value);
  };

  const markTouched = () => {
    setIsTouched(true);
  };

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <>
      <IonPage>
        <IonContent>
          <div className="login-container">
            <div className="text-login">
              <IonLabel className="login-text">CHUÔNG THÔNG MINH</IonLabel>
              <br />
            </div>

            <br />
            <IonItem className="login-item">
              <IonInput
                className={`${isValid && "ion-valid"} ${
                  isValid === false && "ion-invalid"
                } ${isTouched && "ion-touched"}`}
                type="email"
                value={email}
                label="Email"
                labelPlacement="floating"
                onIonInput={(event) => validate(event)}
                onIonBlur={() => markTouched()}
              ></IonInput>
            </IonItem>

            <IonItem className="login-item">
              <IonInput
                type={passwordShown ? "text" : "password"}
                value={password}
                label="Password"
                labelPlacement="floating"
                onIonChange={(e) => setPassword(e.detail.value!)}
                onIonBlur={() => markTouched()}
              ></IonInput>
              <IonIcon
                className="icon-eye"
                slot="end"
                icon={passwordShown ? eyeOff : eye}
                onClick={togglePasswordVisibility}
              />
            </IonItem>

            <IonButton
              className="login-button"
              expand="block"
              onClick={handleLogin}
            >
              Đăng nhập
            </IonButton>
            <IonLoading isOpen={loading} message={"Đang xử lí..."} />
            <IonToast
              isOpen={showToast}
              message={toastMessage}
              duration={2000}
              onDidDismiss={() => setShowToast(false)}
            />
            <br />
            <div className="login-links">
              <Link to="/forgot-password" style={{ textDecoration: "none" }}>Quên mật khẩu?</Link>
            </div>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Login;
