import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, Card, Title, Paragraph, TextInput, List, Divider } from 'react-native-paper';
import { useMySQLAuth } from '../context/MySQLAuthContext';

interface Subscription {
  id: string;
  name: string;
  description: string;
  price: number;
  num_trainings: number;
  validity_period: number;
  is_active: boolean;
}

interface SubscriptionPurchase {
  id: string;
  child_id: string;
  subscription_id: string;
  manager_id: string;
  purchase_date: string;
  start_date: string;
  end_date: string;
  num_trainings: number;
  remaining_trainings: number;
  total_cost: number;
}

export default function SubscriptionManagementScreen() {
  const { user, isDatabaseAvailable } = useMySQLAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [purchases, setPurchases] = useState<SubscriptionPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSubscription, setNewSubscription] = useState({
    name: '',
    description: '',
    price: '',
    num_trainings: '',
    validity_period: '',
  });

  // Load subscriptions and purchases
  useEffect(() => {
    loadSubscriptions();
    loadPurchases();
  }, []);

  const loadSubscriptions = async () => {
    try {
      // In a real implementation, this would fetch from the API
      // For now, we'll use mock data
      const mockSubscriptions: Subscription[] = [
        {
          id: '1',
          name: 'Месячный абонемент',
          description: 'Абонемент на 8 тренировок в месяц',
          price: 5000,
          num_trainings: 8,
          validity_period: 30,
          is_active: true,
        },
        {
          id: '2',
          name: 'Квартальный абонемент',
          description: 'Абонемент на 24 тренировки в квартал',
          price: 14000,
          num_trainings: 24,
          validity_period: 90,
          is_active: true,
        },
      ];
      setSubscriptions(mockSubscriptions);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить абонементы');
    } finally {
      setLoading(false);
    }
  };

  const loadPurchases = async () => {
    try {
      // In a real implementation, this would fetch from the API
      // For now, we'll use mock data
      const mockPurchases: SubscriptionPurchase[] = [
        {
          id: '1',
          child_id: '1',
          subscription_id: '1',
          manager_id: '1',
          purchase_date: new Date().toISOString(),
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          num_trainings: 8,
          remaining_trainings: 5,
          total_cost: 5000,
        },
      ];
      setPurchases(mockPurchases);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить покупки абонементов');
    }
  };

  const handleCreateSubscription = async () => {
    if (!newSubscription.name || !newSubscription.price || !newSubscription.num_trainings || !newSubscription.validity_period) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все обязательные поля');
      return;
    }

    try {
      // In a real implementation, this would send to the API
      const newSub: Subscription = {
        id: (subscriptions.length + 1).toString(),
        name: newSubscription.name,
        description: newSubscription.description,
        price: parseFloat(newSubscription.price),
        num_trainings: parseInt(newSubscription.num_trainings),
        validity_period: parseInt(newSubscription.validity_period),
        is_active: true,
      };

      setSubscriptions([...subscriptions, newSub]);
      setNewSubscription({
        name: '',
        description: '',
        price: '',
        num_trainings: '',
        validity_period: '',
      });
      Alert.alert('Успех', 'Абонемент успешно создан');
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось создать абонемент');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Загрузка...</Text>
      </View>
    );
  }

  if (!isDatabaseAvailable) {
    return (
      <View style={styles.center}>
        <Text>Нет подключения к базе данных</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Управление абонементами</Title>
      
      {/* Create Subscription Form */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Создать новый абонемент</Title>
          <TextInput
            label="Название *"
            value={newSubscription.name}
            onChangeText={(text) => setNewSubscription({...newSubscription, name: text})}
            style={styles.input}
          />
          <TextInput
            label="Описание"
            value={newSubscription.description}
            onChangeText={(text) => setNewSubscription({...newSubscription, description: text})}
            style={styles.input}
            multiline
            numberOfLines={3}
          />
          <TextInput
            label="Цена *"
            value={newSubscription.price}
            onChangeText={(text) => setNewSubscription({...newSubscription, price: text})}
            style={styles.input}
            keyboardType="numeric"
          />
          <TextInput
            label="Количество тренировок *"
            value={newSubscription.num_trainings}
            onChangeText={(text) => setNewSubscription({...newSubscription, num_trainings: text})}
            style={styles.input}
            keyboardType="numeric"
          />
          <TextInput
            label="Срок действия (дней) *"
            value={newSubscription.validity_period}
            onChangeText={(text) => setNewSubscription({...newSubscription, validity_period: text})}
            style={styles.input}
            keyboardType="numeric"
          />
          <Button 
            mode="contained" 
            onPress={handleCreateSubscription}
            style={styles.button}
          >
            Создать абонемент
          </Button>
        </Card.Content>
      </Card>

      <Divider style={styles.divider} />

      {/* Subscriptions List */}
      <Title style={styles.title}>Существующие абонементы</Title>
      {subscriptions.map((subscription) => (
        <Card key={subscription.id} style={styles.card}>
          <Card.Content>
            <Title>{subscription.name}</Title>
            <Paragraph>{subscription.description}</Paragraph>
            <Paragraph>Цена: {subscription.price} руб.</Paragraph>
            <Paragraph>Тренировок: {subscription.num_trainings}</Paragraph>
            <Paragraph>Срок действия: {subscription.validity_period} дней</Paragraph>
            <Paragraph>Статус: {subscription.is_active ? 'Активен' : 'Неактивен'}</Paragraph>
          </Card.Content>
        </Card>
      ))}

      <Divider style={styles.divider} />

      {/* Purchases List */}
      <Title style={styles.title}>Покупки абонементов</Title>
      {purchases.map((purchase) => (
        <Card key={purchase.id} style={styles.card}>
          <Card.Content>
            <Title>Покупка #{purchase.id}</Title>
            <Paragraph>Ребенок ID: {purchase.child_id}</Paragraph>
            <Paragraph>Абонемент ID: {purchase.subscription_id}</Paragraph>
            <Paragraph>Дата покупки: {new Date(purchase.purchase_date).toLocaleDateString()}</Paragraph>
            <Paragraph>Период действия: {new Date(purchase.start_date).toLocaleDateString()} - {new Date(purchase.end_date).toLocaleDateString()}</Paragraph>
            <Paragraph>Тренировок всего: {purchase.num_trainings}</Paragraph>
            <Paragraph>Осталось тренировок: {purchase.remaining_trainings}</Paragraph>
            <Paragraph>Стоимость: {purchase.total_cost} руб.</Paragraph>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 16,
  },
  card: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 16,
  },
  divider: {
    marginVertical: 16,
  },
});