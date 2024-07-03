import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
  IonToast,
} from "@ionic/react";
import { eyeOff, eye, logoIonic, notificationsCircleOutline } from "ionicons/icons";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useHistory, Link } from "react-router-dom"; // Thêm Link từ react-router-dom
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const history = useHistory();
  const [isTouched, setIsTouched] = useState(false);
  const [isValid, setIsValid] = useState<boolean>();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
      history.push("/home");
    } catch (error) {
      setToastMessage("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
      setShowToast(true);
    }
    setLoading(false);
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
    <IonPage>
      <IonContent>
        <div className="login-container">
          <div className="text-login">
            <IonLabel className="login-text">CHUÔNG THÔNG MINH</IonLabel>
            <br /><br /><br /><br />
            <IonIcon
              className="login-icon"
              icon={notificationsCircleOutline}
            ></IonIcon>
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
          <IonLoading isOpen={loading} message={"Please wait..."} />
          <IonToast
            isOpen={showToast}
            message={toastMessage}
            duration={2000}
            onDidDismiss={() => setShowToast(false)}
          />
          <br />
          {/* Thêm các liên kết */}
          <div className="login-links">
            <Link to="/forgot-password" style={{ textDecoration: "none"}}>Quên mật khẩu?</Link>
            &nbsp; &nbsp;
            {/* <Link to="/register">Đăng ký</Link> */}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
