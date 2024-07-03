import {
    IonButton,
    IonContent,
    IonInput,
    IonItem,
    IonLabel,
    IonPage,
    IonToast,
    IonLoading,
    IonIcon,
  } from "@ionic/react";
  import { useState } from "react";
  import { sendPasswordResetEmail } from "firebase/auth";
  import { Link, useHistory } from "react-router-dom";
  import { auth } from "../firebaseConfig";
  import './ResetPassword.css';
import { notificationsCircleOutline } from "ionicons/icons";
  
  const ResetPassword: React.FC = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const history = useHistory();
  
    const handleResetPassword = async () => {
      setLoading(true);
      try {
        await sendPasswordResetEmail(auth, email);
        setEmail("");
        setToastMessage("Email đặt lại mật khẩu đã được gửi thành công.");
        history.push("/login");

      } catch (error) {
        setToastMessage("Không gửi được email đặt lại mật khẩu.");
      }
      setShowToast(true);
      setLoading(false);
    };
  
    return (
      <IonPage>
        <IonContent>
          <div className="reset-password-container">
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
            <IonLabel className="reset-password-text">Reset Password</IonLabel>
            <IonItem className="reset-password-item">
              <IonInput
                type="email"
                placeholder="Enter your email"
                onIonChange={(e) => setEmail(e.detail.value!)}
              />
            </IonItem>
            <IonButton
              className="reset-password-button"
              expand="block"
              onClick={handleResetPassword}
            >
              Send Reset Email
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
            <Link to="/login" style={{ textDecoration: "none"}}>Đăng Nhập</Link>
            &nbsp; &nbsp;
            {/* <Link to="/register">Đăng ký</Link> */}
          </div>
          </div>
        </IonContent>
      </IonPage>
    );
  };
  
  export default ResetPassword;
  