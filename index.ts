import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent вызывает AppRegistry.registerComponent('main', () => App);
// Это также гарантирует, что при загрузке приложения в Expo Go или в нативной сборке,
// среда будет настроена соответствующим образом
registerRootComponent(App);
