import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonSpinner, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Course from './pages/Course';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { getCurrentUser } from './config/firebaseConfig';
import { peopleOutline, peopleSharp, personOutline, personSharp, homeOutline, homeSharp, searchOutline, searchSharp } from 'ionicons/icons';

const Routing: React.FC = (props) => {
  const [user, setUser] = useState<any>(props)

  return (
    <IonRouterOutlet>
      <Route path="/" render={() => <Redirect to="/home" />} exact={true} />            
      <Route path="/login" component={Login} exact />
      <Route path="/courses/:id" component={Course} exact />
      <Route path="/register" component={Register} exact />
      <Route path="/settings" component={Settings} exact />
      <Route path='/profile' render={() => (<Profile {...user} />)} exact />
      <Route path='/home' render={() => (<Home {...user} />)} exact />
    </IonRouterOutlet>
  )
}

const App: React.FC = () => {
  const [busy, setBusy] = useState<boolean>(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    getCurrentUser().then(user => {
      //console.log(user)
      if (user) {
        setUser(user)
        //window.history.replaceState({}, '', '/')
      } else {
        window.history.replaceState({}, '', '/login')
      }
      setBusy(false)
    })
  })

  return (
    <IonApp>
      {busy ? <IonSpinner /> :
        <IonReactRouter>
          {user ?
            <IonTabs>
              <IonRouterOutlet>              
                <Routing {...user} />
              </IonRouterOutlet>
              <IonTabBar slot="bottom">
                <IonTabButton tab="home" href="/home">
                  <IonIcon ios={homeOutline} md={homeSharp}/>
                  <IonLabel>Dashboard</IonLabel>
                </IonTabButton>
                <IonTabButton tab="search" href="/search">
                  <IonIcon ios={searchOutline} md={searchSharp} />
                  <IonLabel>Search</IonLabel>
                </IonTabButton>
                <IonTabButton tab="community" href="/community">
                  <IonIcon ios={peopleOutline} md={peopleSharp} />
                  <IonLabel>Community</IonLabel>
                </IonTabButton>
                <IonTabButton tab="profile" href="/profile">
                  <IonIcon ios={personOutline} md={personSharp} />
                  <IonLabel>Profile</IonLabel>
                </IonTabButton>
              </IonTabBar>
            </IonTabs> : <Routing {...user} />
          }
        </IonReactRouter>
      }
    </IonApp>
)};

export default App;
