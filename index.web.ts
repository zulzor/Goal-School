import { AppRegistry } from 'react-native';
import App from './App.web';

AppRegistry.registerComponent('GoalSchoolApp', () => App);
AppRegistry.runApplication('GoalSchoolApp', {
  rootTag: document.getElementById('root'),
});
