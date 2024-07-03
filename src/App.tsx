import { Redirect, Route, useLocation } from "react-router-dom";
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
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import {
  logInOutline,
  homeOutline,
  listCircleOutline,
  search,
} from "ionicons/icons";
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

const MainApp: React.FC = () => {
  const location = useLocation();

  return (
    <>
    <IonMenu side="end" contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu Content</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">This is the menu content.</IonContent>
      </IonMenu>
      <IonRouterOutlet>
        <Route path="/login" component={Login} exact={true} />
        <Route path="/register" component={Register} exact={true} />
        <Route path="/home" component={Home} exact={true} />
        <Route exact path="/" render={() => <Redirect to="/login" />} />
        <Route exact path="/forgot-password" component={ResetPassword} />
      </IonRouterOutlet>

      {location.pathname !== "/login" && location.pathname !== "/register" && location.pathname !== "/forgot-password" && (
        <IonTabs>
          <IonRouterOutlet>
            <Redirect exact path="/" to="/login" />
            <Route path="/home" render={() => <Home />} exact={true} />
            <Route
              path="/listRecodings"
              render={() => <ListRecodings />}
              exact={true}
            />
            <Route
              path="/search"
              render={() => <div>Search Page</div>}
              exact={true}
            />
          </IonRouterOutlet>

          <IonTabBar slot="bottom">
            {/* <IonTabButton tab="home" href="/home">
              <IonIcon icon={homeOutline} />
              <IonLabel>Home</IonLabel>
            </IonTabButton> */}

            <IonTabButton tab="ListRecodings" href="/listRecodings">
              <IonIcon icon={listCircleOutline} />
              <IonLabel>List Recordings</IonLabel>
            </IonTabButton>

            {/* <IonTabButton tab="search" href="/search">
              <IonIcon icon={search} />
              <IonLabel>Search</IonLabel>
            </IonTabButton> */}

            <IonTabButton tab="logout" href="/login">
              <IonIcon icon={logInOutline} />
              <IonLabel>Logout</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      )}
    </>
  );
};

export default App;
