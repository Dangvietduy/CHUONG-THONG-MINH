import { useState } from "react";
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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Link, useHistory } from "react-router-dom";
import "./Register.css";
import { eye, eyeOff, notificationsCircleOutline } from "ionicons/icons";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const history = useHistory();
  const [isTouched, setIsTouched] = useState(false);
  const [isValid, setIsValid] = useState<boolean>();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleRegister = async () => {
    // Check if passwords match
    if (password !== confirmPassword) {
      setToastMessage("Mật khẩu nhập lại không khớp.");
      setShowToast(true);
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      history.push("/login");
      setToastMessage("Đăng ký tài khoản thành công.");
    } catch (error) {
      setToastMessage(
        "Kiểm tra lại thông tin hoặc tài khoảng đã tồn tại. Vui lòng thử lại."
      );
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
        <div className="register-container">
          <div className="text-login">
            <IonLabel className="login-text">CHUÔNG THÔNG MINH</IonLabel>
            <br />
            <br />
            <br />
            <br />
            <IonIcon
              className="login-icon"
              icon={notificationsCircleOutline}
            ></IonIcon>
          </div>
          <br />
          <IonItem className="register-item">
            <IonInput
              className={`${isValid && "ion-valid"} ${
                isValid === false && "ion-invalid"
              } ${isTouched && "ion-touched"}`}
              type="email"
              label="Email"
              labelPlacement="floating"
              onIonInput={(event) => validate(event)}
              onIonBlur={() => markTouched()}
            ></IonInput>
          </IonItem>

          <IonItem className="register-item">
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

          <IonItem className="register-item">
            <IonInput
              type="password"
              value={confirmPassword}
              labelPlacement="floating"
              label="Confirm Password"
              onIonChange={(e) => setConfirmPassword(e.detail.value!)}
            ></IonInput>
            <IonIcon
              className="icon-eye"
              slot="end"
              icon={passwordShown ? eyeOff : eye}
              onClick={togglePasswordVisibility}
            />
          </IonItem>

          <IonButton
            className="register-button"
            expand="block"
            onClick={handleRegister}
          >
            Đăng ký
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
            <a href="/login">
              <IonLabel>Đăng nhập</IonLabel>
            </a>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Register;
