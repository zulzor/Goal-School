import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Title } from 'react-native-paper';
import { UserRole } from '../types';
import { COLORS } from '../constants';

interface RoleSelectorProps {
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  title?: string;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onSelectRole,
  title = 'Выберите роль',
}) => {
  const roles = [
    { key: UserRole.CHILD, name: 'Ребенок', icon: '👶', description: 'Зарегистрировать ученика' },
    {
      key: UserRole.PARENT,
      name: 'Родитель',
      icon: '👨‍👩‍👧‍👦',
      description: 'Зарегистрировать родителя',
    },
    { key: UserRole.COACH, name: 'Тренер', icon: '🧑‍🏫', description: 'Зарегистрировать тренера' },
  ];

  return (
    <View style={styles.container}>
      <Title style={styles.title}>{title}</Title>
      <View style={styles.rolesContainer}>
        {roles.map(role => (
          <TouchableOpacity
            key={role.key}
            onPress={() => onSelectRole(role.key)}
            style={[styles.roleCard, selectedRole === role.key && styles.selectedRoleCard]}>
            <Text style={styles.roleIcon}>{role.icon}</Text>
            <Text style={[styles.roleName, selectedRole === role.key && styles.selectedRoleName]}>
              {role.name}
            </Text>
            <Text style={styles.roleDescription}>{role.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    marginBottom: 12,
    textAlign: 'left',
  },
  rolesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  roleCard: {
    width: '30%',
    minWidth: 100,
    padding: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedRoleCard: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface, // Используем существующий цвет
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  roleIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  roleName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  selectedRoleName: {
    color: COLORS.primary,
  },
  roleDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
