import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, Card, Title, Paragraph, TextInput, List } from 'react-native-paper';
import { useMySQLAuth } from '../context/MySQLAuthContext';

interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  manager_id: string;
  is_active: boolean;
}

interface FamilyTransfer {
  id: string;
  family_id: string;
  from_branch_id: string;
  to_branch_id: string;
  initiated_by: string;
  reason: string;
  status: string;
  approved_by: string;
  approved_at: string;
  transfer_date: string;
}

export default function BranchTransferScreen() {
  const { user, isDatabaseAvailable } = useMySQLAuth();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [transfers, setTransfers] = useState<FamilyTransfer[]>([]);
  const [loading, setLoading] = useState(false);
  const [transferRequest, setTransferRequest] = useState({
    family_id: '',
    to_branch_id: '',
    reason: '',
  });

  // In a real implementation, these would be loaded from the API
  React.useEffect(() => {
    // Mock data
    const mockBranches: Branch[] = [
      {
        id: '1',
        name: 'Филиал 1',
        address: 'ул. Спортивная, 1',
        phone: '+7 (123) 456-78-90',
        email: 'branch1@test.com',
        manager_id: '1',
        is_active: true,
      },
      {
        id: '2',
        name: 'Филиал 2',
        address: 'ул. Футбольная, 5',
        phone: '+7 (123) 456-78-91',
        email: 'branch2@test.com',
        manager_id: '2',
        is_active: true,
      },
    ];

    const mockTransfers: FamilyTransfer[] = [
      {
        id: '1',
        family_id: '1',
        from_branch_id: '1',
        to_branch_id: '2',
        initiated_by: '1',
        reason: 'Переезд',
        status: 'approved',
        approved_by: '1',
        approved_at: new Date().toISOString(),
        transfer_date: new Date().toISOString(),
      },
    ];

    setBranches(mockBranches);
    setTransfers(mockTransfers);
  }, []);

  const handleCreateTransfer = async () => {
    if (!transferRequest.family_id || !transferRequest.to_branch_id) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все обязательные поля');
      return;
    }

    try {
      // In a real implementation, this would send to the API
      const newTransfer: FamilyTransfer = {
        id: (transfers.length + 1).toString(),
        family_id: transferRequest.family_id,
        from_branch_id: '1', // Would be determined from current family branch
        to_branch_id: transferRequest.to_branch_id,
        initiated_by: user?.id || '',
        reason: transferRequest.reason,
        status: 'pending',
        approved_by: '',
        approved_at: '',
        transfer_date: new Date().toISOString(),
      };

      setTransfers([...transfers, newTransfer]);
      setTransferRequest({
        family_id: '',
        to_branch_id: '',
        reason: '',
      });
      Alert.alert('Успех', 'Запрос на перевод семьи создан');
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось создать запрос на перевод');
    }
  };

  if (!isDatabaseAvailable) {
    return (
      <View style={styles.center}>
        <Text>Нет подключения к базе данных</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Управление филиалами и переводами</Title>
      
      {/* Branch List */}
      <Title style={styles.title}>Филиалы</Title>
      {branches.map((branch) => (
        <Card key={branch.id} style={styles.card}>
          <Card.Content>
            <Title>{branch.name}</Title>
            <Paragraph>Адрес: {branch.address}</Paragraph>
            <Paragraph>Телефон: {branch.phone}</Paragraph>
            <Paragraph>Email: {branch.email}</Paragraph>
            <Paragraph>Статус: {branch.is_active ? 'Активен' : 'Неактивен'}</Paragraph>
          </Card.Content>
        </Card>
      ))}

      <Divider style={styles.divider} />

      {/* Transfer Request Form */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Запрос на перевод семьи</Title>
          <TextInput
            label="ID семьи *"
            value={transferRequest.family_id}
            onChangeText={(text) => setTransferRequest({...transferRequest, family_id: text})}
            style={styles.input}
          />
          <List.Section>
            <List.Subheader>Выберите филиал для перевода</List.Subheader>
            {branches.map((branch) => (
              <List.Item
                key={branch.id}
                title={branch.name}
                description={branch.address}
                onPress={() => setTransferRequest({...transferRequest, to_branch_id: branch.id})}
                left={props => <List.Icon {...props} icon={transferRequest.to_branch_id === branch.id ? "radiobox-marked" : "radiobox-blank"} />}
              />
            ))}
          </List.Section>
          <TextInput
            label="Причина перевода"
            value={transferRequest.reason}
            onChangeText={(text) => setTransferRequest({...transferRequest, reason: text})}
            style={styles.input}
            multiline
            numberOfLines={3}
          />
          <Button 
            mode="contained" 
            onPress={handleCreateTransfer}
            style={styles.button}
          >
            Создать запрос на перевод
          </Button>
        </Card.Content>
      </Card>

      <Divider style={styles.divider} />

      {/* Transfer Requests List */}
      <Title style={styles.title}>Запросы на перевод</Title>
      {transfers.map((transfer) => (
        <Card key={transfer.id} style={styles.card}>
          <Card.Content>
            <Title>Запрос #{transfer.id}</Title>
            <Paragraph>Семья ID: {transfer.family_id}</Paragraph>
            <Paragraph>Из филиала ID: {transfer.from_branch_id}</Paragraph>
            <Paragraph>В филиал ID: {transfer.to_branch_id}</Paragraph>
            <Paragraph>Причина: {transfer.reason}</Paragraph>
            <Paragraph>Статус: {transfer.status}</Paragraph>
            {transfer.approved_at && (
              <Paragraph>Утвержден: {new Date(transfer.approved_at).toLocaleString()}</Paragraph>
            )}
            <Paragraph>Дата перевода: {new Date(transfer.transfer_date).toLocaleDateString()}</Paragraph>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}

const Divider = ({ style }: { style?: any }) => (
  <View style={[styles.divider, style]} />
);

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
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
});