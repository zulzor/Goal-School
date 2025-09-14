import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Title } from 'react-native-paper';
import { Branch } from '../types';
import { COLORS } from '../constants';

interface BranchSelectorProps {
  branches: Branch[];
  selectedBranchId: string | null;
  onSelectBranch: (branchId: string) => void;
  title?: string;
}

export const BranchSelector: React.FC<BranchSelectorProps> = ({
  branches,
  selectedBranchId,
  onSelectBranch,
  title = 'Выберите филиал',
}) => {
  return (
    <View style={styles.container}>
      <Title style={styles.title}>{title}</Title>
      {branches.length === 0 ? (
        <Text style={styles.noBranches}>Филиалы не найдены</Text>
      ) : (
        branches.map(branch => (
          <TouchableOpacity
            key={branch.id}
            onPress={() => onSelectBranch(branch.id)}
            style={[
              styles.branchCard,
              selectedBranchId === branch.id && styles.selectedBranchCard,
            ]}>
            <Card>
              <Card.Content>
                <Text
                  style={[
                    styles.branchName,
                    selectedBranchId === branch.id && styles.selectedBranchName,
                  ]}>
                  {branch.name}
                </Text>
                {branch.address && <Text style={styles.branchInfo}>{branch.address}</Text>}
                {branch.phone && <Text style={styles.branchInfo}>Тел: {branch.phone}</Text>}
                {branch.email && <Text style={styles.branchInfo}>Email: {branch.email}</Text>}
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))
      )}
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
  noBranches: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  branchCard: {
    marginBottom: 12,
  },
  selectedBranchCard: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  branchName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  selectedBranchName: {
    color: COLORS.primary,
  },
  branchInfo: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});
