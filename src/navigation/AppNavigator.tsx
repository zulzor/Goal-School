import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/LocalStorageAuthContext';
import { useMySQLAuth } from '../context/MySQLAuthContext';
import { useDatabase } from '../context/DatabaseContext';
import { useCoachNotifications } from '../hooks/useCoachNotifications';
import { useCustomNotifications } from '../hooks/useCustomNotifications'; // Хук для пользовательских уведомлений
import { AppIcon } from '../components/AppIcon';
import { COLORS } from '../constants';

// Import screens
import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { NewsScreen } from '../screens/NewsScreen';
import { ScheduleScreen } from '../screens/ScheduleScreen';
import { NutritionScreen } from '../screens/NutritionScreen';
import AttendanceManagementScreen from '../screens/AttendanceManagementScreen';
import StudentProgressScreen from '../screens/StudentProgressScreen';
import { AdminPanel } from '../screens/AdminPanel';
import { AttendanceAnalyticsScreen } from '../screens/AttendanceAnalyticsScreen';
import { UserManagementScreen } from '../screens/UserManagementScreen';
import { DisciplineResultsScreen } from '../screens/DisciplineResultsScreen';
import { SkillsManagementScreen } from '../screens/SkillsManagementScreen';
import { AchievementsScreen } from '../screens/AchievementsScreen';
import AnimationsDemoScreen from '../screens/AnimationsDemoScreen';
import { DatabaseSettingsScreen } from '../screens/DatabaseSettingsScreen';
import { BranchManagementScreen } from '../screens/BranchManagementScreen';
import { CoachAssignmentScreen } from '../screens/CoachAssignmentScreen';
import { TrainingResultsScreen } from '../screens/TrainingResultsScreen';
import { SMManagerScreen } from '../screens/SMManagerScreen'; // Добавляем импорт нового экрана

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main tab navigator for authenticated users
const MainTabs: React.FC = () => {
  const { databaseType } = useDatabase();

  // Используем соответствующий контекст в зависимости от типа базы данных
  const localStorageAuth = useAuth();
  const mySQLAuth = useMySQLAuth();

  const { user } = databaseType === 'mysql' ? mySQLAuth : localStorageAuth;

  // Добавляем хук для уведомлений тренеров
  useCoachNotifications();

  // Добавляем хук для пользовательских уведомлений
  useCustomNotifications();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'homeOutline';
          } else if (route.name === 'News') {
            iconName = focused ? 'news' : 'newsOutline';
          } else if (route.name === 'Schedule') {
            iconName = focused ? 'schedule' : 'scheduleOutline';
          } else if (route.name === 'Nutrition') {
            iconName = focused ? 'nutrition' : 'nutritionOutline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'profile' : 'profileOutline';
          } else if (route.name === 'Admin') {
            iconName = focused ? 'admin' : 'adminOutline';
          } else if (route.name === 'Coach') {
            iconName = focused ? 'coach' : 'coachOutline';
          } else if (route.name === 'Parent') {
            iconName = focused ? 'parent' : 'parentOutline';
          } else if (route.name === 'Achievements') {
            iconName = focused ? 'trophy' : 'trophy';
          } else if (route.name === 'Branches') {
            // Добавляем иконку для филиалов
            iconName = focused ? 'home' : 'homeOutline';
          } else if (route.name === 'CoachAssignment') {
            // Добавляем иконку для назначения тренеров
            iconName = focused ? 'account' : 'accountOutline';
          } else if (route.name === 'SMManager') {
            // Добавляем иконку для СММ-менеджера
            iconName = focused ? 'news' : 'newsOutline';
          }

          return <AppIcon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        headerShown: false,
      })}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Главная' }} />
      <Tab.Screen name="News" component={NewsScreen} options={{ title: 'Новости' }} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} options={{ title: 'Расписание' }} />
      <Tab.Screen name="Nutrition" component={NutritionScreen} options={{ title: 'Питание' }} />

      {user?.role === 'student' && (
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Профиль' }} />
      )}

      {user?.role === 'coach' && (
        <>
          <Tab.Screen
            name="Coach"
            component={AttendanceManagementScreen}
            options={{ title: 'Посещаемость' }}
          />
          <Tab.Screen
            name="Students"
            component={StudentProgressScreen}
            options={{ title: 'Прогресс' }}
          />
          <Tab.Screen
            name="TrainingResults" // Добавляем экран результатов тренировок
            component={TrainingResultsScreen}
            options={{ title: 'Результаты' }}
          />
        </>
      )}

      {user?.role === 'parent' && (
        <>
          <Tab.Screen name="News" component={NewsScreen} options={{ title: 'Новости' }} />
          <Tab.Screen
            name="Schedule"
            component={ScheduleScreen}
            options={{ title: 'Расписание' }}
          />
          <Tab.Screen name="Nutrition" component={NutritionScreen} options={{ title: 'Питание' }} />
          <Tab.Screen
            name="Parent"
            component={StudentProgressScreen}
            options={{ title: 'Прогресс ребенка' }}
          />
        </>
      )}

      {(user?.role === 'manager' || user?.role === 'admin') && (
        <>
          <Tab.Screen name="Admin" component={AdminPanel} options={{ title: 'Админ-панель' }} />
          <Tab.Screen
            name="Analytics"
            component={AttendanceAnalyticsScreen}
            options={{ title: 'Аналитика' }}
          />
          <Tab.Screen
            name="Users"
            component={UserManagementScreen}
            options={{ title: 'Пользователи' }}
          />
          <Tab.Screen
            name="Skills"
            component={SkillsManagementScreen}
            options={{ title: 'Навыки' }}
          />
          <Tab.Screen
            name="Branches" // Добавляем экран управления филиалами
            component={BranchManagementScreen}
            options={{ title: 'Филиалы' }}
          />
          <Tab.Screen
            name="CoachAssignment" // Добавляем экран назначения тренеров
            component={CoachAssignmentScreen}
            options={{ title: 'Назначение тренеров' }}
          />
          <Tab.Screen
            name="Database"
            component={DatabaseSettingsScreen}
            options={{ title: 'База данных' }}
          />
          <Tab.Screen
            name="SMManager" // Добавляем экран для СММ-менеджера
            component={SMManagerScreen}
            options={{ title: 'Новости СММ' }}
          />
        </>
      )}

      <Tab.Screen
        name="Achievements"
        component={AchievementsScreen}
        options={{ title: 'Достижения' }}
      />
    </Tab.Navigator>
  );
};

// Main stack navigator
export const AppNavigator: React.FC = () => {
  const { databaseType } = useDatabase();

  // Используем соответствующий контекст в зависимости от типа базы данных
  const localStorageAuth = useAuth();
  const mySQLAuth = useMySQLAuth();

  const { user, isLoading } = databaseType === 'mysql' ? mySQLAuth : localStorageAuth;

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen
            name="DisciplineResults"
            component={DisciplineResultsScreen}
            options={{ title: 'Результаты по дисциплинам' }}
          />
          <Stack.Screen
            name="AnimationsDemo"
            component={AnimationsDemoScreen}
            options={{ title: 'Демонстрация анимаций' }}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};
