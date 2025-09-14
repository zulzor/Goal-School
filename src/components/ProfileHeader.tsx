import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar, IconButton, Chip } from 'react-native-paper';
import { COLORS, USER_ROLES } from '../constants';
import { UserRole } from '../types';

interface ProfileHeaderProps {
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  role?: UserRole;
  onEdit?: () => void;
  isEditing?: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  email,
  phone,
  dateOfBirth,
  role,
  onEdit,
  isEditing,
}) => {
  const getRoleIcon = () => {
    switch (role) {
      case UserRole.CHILD:
        return 'account-child';
      case UserRole.PARENT:
        return 'account-multiple';
      case UserRole.COACH:
        return 'whistle';
      case UserRole.MANAGER:
        return 'account-tie';
      case UserRole.SMM_MANAGER:
        return 'account-group';
      default:
        return 'account';
    }
  };

  const getRoleColor = () => {
    switch (role) {
      case UserRole.CHILD:
        return '#4CAF50'; // Зеленый
      case UserRole.PARENT:
        return '#2196F3'; // Синий
      case UserRole.COACH:
        return '#9C27B0'; // Фиолетовый
      case UserRole.MANAGER:
        return '#FF9800'; // Оранжевый
      case UserRole.SMM_MANAGER:
        return '#E91E63'; // Розовый
      default:
        return COLORS.primary;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Avatar.Text size={80} label={name.charAt(0).toUpperCase()} style={styles.avatar} />
        {onEdit && (
          <IconButton
            icon={isEditing ? 'content-save' : 'account-edit'}
            size={24}
            onPress={onEdit}
            style={styles.editButton}
          />
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
        {role && (
          <Chip
            icon={getRoleIcon()}
            style={[styles.roleChip, { backgroundColor: getRoleColor() }]}
            textStyle={styles.roleText}>
            {USER_ROLES[role]}
          </Chip>
        )}
        {phone && (
          <View style={styles.infoRow}>
            <IconButton icon="phone" size={16} iconColor={COLORS.textSecondary} />
            <Text style={styles.infoText}>{phone}</Text>
          </View>
        )}
        {dateOfBirth && (
          <View style={styles.infoRow}>
            <IconButton icon="cake-variant" size={16} iconColor={COLORS.textSecondary} />
            <Text style={styles.infoText}>{new Date(dateOfBirth).toLocaleDateString('ru-RU')}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    backgroundColor: COLORS.primary,
  },
  editButton: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  roleChip: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  roleText: {
    color: 'white',
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});
