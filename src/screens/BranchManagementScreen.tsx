import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { Card, Title, Paragraph, TextInput, HelperText } from 'react-native-paper';
import { useBranch } from '../context/BranchContext';
import { ArsenalButton } from '../components/ArsenalButton';
import { COLORS } from '../constants';

export const BranchManagementScreen: React.FC = () => {
  const { branches, createBranch, updateBranch, deleteBranch } = useBranch();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreateBranch = async () => {
    if (!name.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, введите название филиала');
      return;
    }

    setLoading(true);
    try {
      await createBranch({ name, address, phone, email });
      resetForm();
      Alert.alert('Успех', 'Филиал успешно создан');
    } catch (error) {
      console.error('Ошибка создания филиала:', error);
      Alert.alert('Ошибка', 'Не удалось создать филиал');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBranch = async () => {
    if (!editingBranchId) {
      return;
    }
    if (!name.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, введите название филиала');
      return;
    }

    setLoading(true);
    try {
      const result = await updateBranch(editingBranchId, { name, address, phone, email });
      if (result) {
        resetForm();
        Alert.alert('Успех', 'Филиал успешно обновлен');
      } else {
        Alert.alert('Ошибка', 'Не удалось обновить филиал');
      }
    } catch (error) {
      console.error('Ошибка обновления филиала:', error);
      Alert.alert('Ошибка', 'Не удалось обновить филиал');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBranch = async (id: string, name: string) => {
    Alert.alert('Подтверждение удаления', `Вы уверены, что хотите удалить филиал "${name}"?`, [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          try {
            const result = await deleteBranch(id);
            if (result) {
              Alert.alert('Успех', 'Филиал успешно удален');
            } else {
              Alert.alert('Ошибка', 'Не удалось удалить филиал');
            }
          } catch (error) {
            console.error('Ошибка удаления филиала:', error);
            Alert.alert('Ошибка', 'Не удалось удалить филиал');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const startEditing = (branch: any) => {
    setName(branch.name);
    setAddress(branch.address || '');
    setPhone(branch.phone || '');
    setEmail(branch.email || '');
    setEditingBranchId(branch.id);
  };

  const resetForm = () => {
    setName('');
    setAddress('');
    setPhone('');
    setEmail('');
    setEditingBranchId(null);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>
            {editingBranchId ? 'Редактирование филиала' : 'Создание нового филиала'}
          </Title>

          <TextInput
            label="Название филиала *"
            value={name}
            onChangeText={setName}
            style={styles.input}
            mode="outlined"
          />
          <HelperText type="info" visible={!name.trim()}>
            Название филиала обязательно
          </HelperText>

          <TextInput
            label="Адрес"
            value={address}
            onChangeText={setAddress}
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="Телефон"
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            mode="outlined"
            keyboardType="phone-pad"
          />

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.buttonContainer}>
            {editingBranchId ? (
              <>
                <ArsenalButton
                  title="Обновить филиал"
                  variant="primary"
                  onPress={handleUpdateBranch}
                  loading={loading}
                  disabled={loading}
                  style={styles.button}
                />
                <ArsenalButton
                  title="Отмена"
                  variant="outline"
                  onPress={resetForm}
                  style={[styles.button, styles.cancelButton]}
                />
              </>
            ) : (
              <ArsenalButton
                title="Создать филиал"
                variant="primary"
                onPress={handleCreateBranch}
                loading={loading}
                disabled={loading}
                style={styles.button}
              />
            )}
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Список филиалов</Title>
          {branches.length === 0 ? (
            <Paragraph>Филиалы не найдены</Paragraph>
          ) : (
            branches.map(branch => (
              <Card key={branch.id} style={styles.branchCard}>
                <Card.Content>
                  <Title style={styles.branchTitle}>{branch.name}</Title>
                  {branch.address && (
                    <Paragraph style={styles.branchInfo}>
                      <Text style={styles.label}>Адрес:</Text> {branch.address}
                    </Paragraph>
                  )}
                  {branch.phone && (
                    <Paragraph style={styles.branchInfo}>
                      <Text style={styles.label}>Телефон:</Text> {branch.phone}
                    </Paragraph>
                  )}
                  {branch.email && (
                    <Paragraph style={styles.branchInfo}>
                      <Text style={styles.label}>Email:</Text> {branch.email}
                    </Paragraph>
                  )}
                  <View style={styles.branchActions}>
                    <ArsenalButton
                      title="Редактировать"
                      variant="outline"
                      onPress={() => startEditing(branch)}
                      style={styles.actionButton}
                    />
                    <ArsenalButton
                      title="Удалить"
                      variant="outline"
                      onPress={() => handleDeleteBranch(branch.id, branch.name)}
                      style={[styles.actionButton, styles.deleteButton]}
                    />
                  </View>
                </Card.Content>
              </Card>
            ))
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.background,
  },
  card: {
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  button: {
    margin: 8,
    minWidth: 150,
  },
  cancelButton: {
    borderColor: COLORS.warning,
  },
  branchCard: {
    marginBottom: 12,
    backgroundColor: COLORS.surface,
  },
  branchTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  branchInfo: {
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
  },
  branchActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    flexWrap: 'wrap',
  },
  actionButton: {
    margin: 4,
    minWidth: 120,
  },
  deleteButton: {
    borderColor: COLORS.error,
  },
});
