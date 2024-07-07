import React, { useState } from "react";
import { Redirect, Route, useLocation, useHistory } from "react-router-dom";
import {
  IonApp,
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  setupIonicReact,
  IonMenu,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonAlert,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { logInOutline, listCircleOutline, homeOutline } from "ionicons/icons";
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/palettes/dark.system.css";
import "./theme/variables.css";
import ListRecodings from "./pages/ListRecoredings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ResetPassword from "./pages/ResetPassword";

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <MainApp />
      </IonReactRouter>
    </IonApp>
  );
};

// PrivateRoute component to protect routes
const PrivateRoute: React.FC<any> = ({ component: Component, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem("token");
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

const MainApp: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    history.push("/login");
    history.go(0); // Reload the page to reset the navigation stack
  };

  return (
    <>
      <IonMenu side="end" contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu Content</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          This is the menu content.
        </IonContent>
      </IonMenu>
      <IonRouterOutlet id="main-content">
        <Route path="/login" component={Login} exact={true} />
        <Route path="/register" component={Register} exact={true} />
        <Route path="/forgot-password" component={ResetPassword} exact={true} />
        <PrivateRoute path="/home" component={Home} exact={true} />
        <PrivateRoute
          path="/listRecodings"
          component={ListRecodings}
          exact={true}
        />
        <PrivateRoute
          path="/search"
          component={() => <div>Search Page</div>}
          exact={true}
        />
        <Redirect exact path="/" to="/login" />
      </IonRouterOutlet>

      {location.pathname !== "/login" &&
        location.pathname !== "/register" &&
        location.pathname !== "/forgot-password" && (
          <IonTabs>
            <IonRouterOutlet>
              <Redirect exact path="/" to="/login" />
              <PrivateRoute path="/home" component={Home} exact={true} />
              <PrivateRoute
                path="/listRecodings"
                component={ListRecodings}
                exact={true}
              />
              <PrivateRoute
                path="/search"
                component={() => <div>Search Page</div>}
                exact={true}
              />
            </IonRouterOutlet>

            <IonTabBar slot="bottom">
              <IonTabButton tab="home" href="/home">
                <IonIcon icon={homeOutline} />
                <IonLabel>Trang Chủ</IonLabel>
              </IonTabButton>

              <IonTabButton tab="listRecodings" href="/listRecodings">
                <IonIcon icon={listCircleOutline} />
                <IonLabel>Danh Sách Ghi Âm</IonLabel>
              </IonTabButton>

              <IonTabButton
                tab="logout"
                onClick={() => setShowLogoutAlert(true)}
              >
                <IonIcon icon={logInOutline} />
                <IonLabel>Đăng Xuất</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        )}

      <IonAlert
        isOpen={showLogoutAlert}
        onDidDismiss={() => setShowLogoutAlert(false)}
        header={"Xác Nhận"}
        message={"Bạn có chắc chắn muốn đăng xuất?"}
        buttons={[
          {
            text: "Hủy",
            role: "cancel",
            handler: () => {
              setShowLogoutAlert(false);
            },
          },
          {
            text: "Đăng Xuất",
            handler: () => {
              handleLogout();
            },
          },
        ]}
      />
    </>
  );
};

export default App;
