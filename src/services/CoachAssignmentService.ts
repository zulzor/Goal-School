import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Branch, UserRole } from '../types';
import { UserService } from './UserService';
import * as BranchService from './BranchService';

// Интерфейс для назначения тренера филиалу
export interface CoachBranchAssignment {
  id: string;
  coachId: string;
  branchId: string;
  assignedAt: string;
  assignedBy: string; // ID пользователя, который назначил
}

const COACH_ASSIGNMENTS_KEY = 'coach_assignments';

// Получение всех назначений тренеров филиалам
export const getCoachAssignments = async (): Promise<CoachBranchAssignment[]> => {
  try {
    const assignmentsJson = await AsyncStorage.getItem(COACH_ASSIGNMENTS_KEY);
    return assignmentsJson ? JSON.parse(assignmentsJson) : [];
  } catch (error) {
    console.error('Ошибка получения назначений тренеров:', error);
    return [];
  }
};

// Назначение тренера филиалу
export const assignCoachToBranch = async (
  coachId: string,
  branchId: string,
  assignedBy: string
): Promise<CoachBranchAssignment> => {
  try {
    const assignments = await getCoachAssignments();

    // Проверяем, существует ли уже такое назначение
    const existingAssignment = assignments.find(
      (a: CoachBranchAssignment) => a.coachId === coachId && a.branchId === branchId
    );

    if (existingAssignment) {
      throw new Error('Тренер уже назначен этому филиалу');
    }

    const newAssignment: CoachBranchAssignment = {
      id: `assignment_${Date.now()}`,
      coachId,
      branchId,
      assignedAt: new Date().toISOString(),
      assignedBy,
    };

    const updatedAssignments = [...assignments, newAssignment];
    await AsyncStorage.setItem(COACH_ASSIGNMENTS_KEY, JSON.stringify(updatedAssignments));

    return newAssignment;
  } catch (error) {
    console.error('Ошибка назначения тренера филиалу:', error);
    throw error;
  }
};

// Отмена назначения тренера филиалу
export const removeCoachFromBranch = async (
  coachId: string,
  branchId: string
): Promise<boolean> => {
  try {
    const assignments = await getCoachAssignments();
    const updatedAssignments = assignments.filter(
      (a: CoachBranchAssignment) => !(a.coachId === coachId && a.branchId === branchId)
    );

    await AsyncStorage.setItem(COACH_ASSIGNMENTS_KEY, JSON.stringify(updatedAssignments));
    return true;
  } catch (error) {
    console.error('Ошибка отмены назначения тренера:', error);
    return false;
  }
};

// Получение филиалов, назначенных тренеру
export const getBranchesForCoach = async (coachId: string): Promise<Branch[]> => {
  try {
    const assignments = await getCoachAssignments();
    const branchIds = assignments
      .filter((a: CoachBranchAssignment) => a.coachId === coachId)
      .map((a: CoachBranchAssignment) => a.branchId);

    const branches = await BranchService.getBranches();
    return branches.filter(branch => branchIds.includes(branch.id));
  } catch (error) {
    console.error('Ошибка получения филиалов для тренера:', error);
    return [];
  }
};

// Получение тренеров, назначенных филиалу
export const getCoachesForBranch = async (branchId: string): Promise<User[]> => {
  try {
    const assignments = await getCoachAssignments();
    const coachIds = assignments
      .filter((a: CoachBranchAssignment) => a.branchId === branchId)
      .map((a: CoachBranchAssignment) => a.coachId);

    // Получаем информацию о тренерах
    const allUsers = await UserService.getAllUsers();
    return allUsers.filter(user => user.role === UserRole.COACH && coachIds.includes(user.id));
  } catch (error) {
    console.error('Ошибка получения тренеров для филиала:', error);
    return [];
  }
};

// Получение всех назначений с полной информацией
export const getAssignmentsWithDetails = async () => {
  try {
    const assignments = await getCoachAssignments();
    const branches = await BranchService.getBranches();
    const users = await UserService.getAllUsers();

    return assignments.map((assignment: CoachBranchAssignment) => {
      const branch = branches.find(b => b.id === assignment.branchId);
      const coach = users.find(u => u.id === assignment.coachId);
      const assignedByUser = users.find(u => u.id === assignment.assignedBy);

      return {
        ...assignment,
        branchName: branch?.name || 'Неизвестный филиал',
        coachName: coach?.name || 'Неизвестный тренер',
        assignedByName: assignedByUser?.name || 'Неизвестный пользователь',
      };
    });
  } catch (error) {
    console.error('Ошибка получения деталей назначений:', error);
    return [];
  }
};
