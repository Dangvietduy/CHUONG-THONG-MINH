import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonLabel,
} from "@ionic/react";
import { notificationsCircleOutline } from "ionicons/icons";
import "./Home.css";

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Trang Chủ</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="home-container">
          <div>
            <IonIcon icon={notificationsCircleOutline} className="bell-icon" />
          </div>
          
          <div>
            <IonLabel className="bell-title">Chuông Thông Minh</IonLabel>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
