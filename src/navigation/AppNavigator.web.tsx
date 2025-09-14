import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppIcon } from '../components/AppIcon';
import { COLORS } from '../constants';

// Import screens
import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen.web'; // Используем веб-версию
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
import { SMManagerScreen } from '../screens/SMManagerScreen';

// Тестовые пользователи для веб-версии
const TEST_USERS = [
  { id: '1', name: 'Иванов Иван', role: 'student', email: 'ivanov@example.com' },
  { id: '2', name: 'Петров Петр', role: 'coach', email: 'petrov@example.com' },
  { id: '3', name: 'Сидоров Сидор', role: 'parent', email: 'sidorov@example.com' },
  { id: '4', name: 'Администратор', role: 'admin', email: 'admin@example.com' },
];

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main tab navigator for authenticated users
const MainTabs: React.FC<{ user: any }> = ({ user }) => {
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
            iconName = focused ? 'home' : 'homeOutline';
          } else if (route.name === 'CoachAssignment') {
            iconName = focused ? 'account' : 'accountOutline';
          } else if (route.name === 'SMManager') {
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
            name="TrainingResults"
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
            name="Branches"
            component={BranchManagementScreen}
            options={{ title: 'Филиалы' }}
          />
          <Tab.Screen
            name="CoachAssignment"
            component={CoachAssignmentScreen}
            options={{ title: 'Назначение тренеров' }}
          />
          <Tab.Screen
            name="Database"
            component={DatabaseSettingsScreen}
            options={{ title: 'База данных' }}
          />
          <Tab.Screen
            name="SMManager"
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

// Main stack navigator для веб-версии
export const AppNavigator: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showLogin, setShowLogin] = useState<boolean>(true);

  // Функция для входа с тестовым пользователем
  const handleTestLogin = (testUser: any) => {
    setUser(testUser);
    setShowLogin(false);
  };

  // Функция для выхода
  const handleLogout = () => {
    setUser(null);
    setShowLogin(true);
  };

  // Добавляем глобальную функцию для выхода, чтобы можно было использовать в компонентах
  useEffect(() => {
    (window as any).handleLogout = handleLogout;

    // Очищаем при размонтировании
    return () => {
      delete (window as any).handleLogout;
    };
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="MainTabs">{() => <MainTabs user={user} />}</Stack.Screen>
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
      ) : showLogin ? (
        <>
          <Stack.Screen name="Login">
            {() => <LoginScreen onTestLogin={handleTestLogin} testUsers={TEST_USERS} />}
          </Stack.Screen>
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs">{() => <MainTabs user={user} />}</Stack.Screen>
        </>
      )}
    </Stack.Navigator>
  );
};
