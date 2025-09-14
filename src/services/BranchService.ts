import AsyncStorage from '@react-native-async-storage/async-storage';
import { Branch } from '../types';

const BRANCHES_STORAGE_KEY = 'app_branches';

// Получение списка филиалов
export const getBranches = async (): Promise<Branch[]> => {
  try {
    const branchesData = await AsyncStorage.getItem(BRANCHES_STORAGE_KEY);
    const branches = branchesData ? JSON.parse(branchesData) : [];

    // Если нет филиалов, создаем стандартные
    if (branches.length === 0) {
      const defaultBranches = await createDefaultBranches();
      return defaultBranches;
    }

    return branches;
  } catch (error) {
    console.error('Ошибка получения филиалов:', error);
    return [];
  }
};

// Создание филиала
export const createBranch = async (
  branchData: Omit<Branch, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Branch> => {
  try {
    const branches = await getBranches();

    const newBranch: Branch = {
      id: `branch_${Date.now()}`,
      ...branchData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedBranches = [...branches, newBranch];
    await AsyncStorage.setItem(BRANCHES_STORAGE_KEY, JSON.stringify(updatedBranches));

    return newBranch;
  } catch (error) {
    console.error('Ошибка создания филиала:', error);
    throw error;
  }
};

// Обновление филиала
export const updateBranch = async (
  id: string,
  branchData: Partial<Branch>
): Promise<Branch | null> => {
  try {
    const branches = await getBranches();
    const branchIndex = branches.findIndex(branch => branch.id === id);

    if (branchIndex === -1) {
      return null;
    }

    const updatedBranch = {
      ...branches[branchIndex],
      ...branchData,
      updatedAt: new Date().toISOString(),
    };

    branches[branchIndex] = updatedBranch;
    await AsyncStorage.setItem(BRANCHES_STORAGE_KEY, JSON.stringify(branches));

    return updatedBranch;
  } catch (error) {
    console.error('Ошибка обновления филиала:', error);
    throw error;
  }
};

// Удаление филиала
export const deleteBranch = async (id: string): Promise<boolean> => {
  try {
    const branches = await getBranches();
    const updatedBranches = branches.filter(branch => branch.id !== id);

    await AsyncStorage.setItem(BRANCHES_STORAGE_KEY, JSON.stringify(updatedBranches));
    return true;
  } catch (error) {
    console.error('Ошибка удаления филиала:', error);
    return false;
  }
};

// Получение филиала по ID
export const getBranchById = async (id: string): Promise<Branch | null> => {
  try {
    const branches = await getBranches();
    const branch = branches.find(b => b.id === id);
    return branch || null;
  } catch (error) {
    console.error('Ошибка получения филиала по ID:', error);
    return null;
  }
};

// Создание стандартных филиалов
const createDefaultBranches = async (): Promise<Branch[]> => {
  const defaultBranches: Branch[] = [
    {
      id: 'branch_1',
      name: 'Футбольная школа "Арсенал" Жулебино',
      address: 'г. Москва, район Жулебино',
      phone: '+7 (495) 123-45-67',
      email: 'zhulebino@arsenal-school.ru',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'branch_2',
      name: 'Футбольная школа "Арсенал" Дмитриевское',
      address: 'г. Москва, район Дмитриевское',
      phone: '+7 (495) 234-56-78',
      email: 'dmitrievskoe@arsenal-school.ru',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  await AsyncStorage.setItem(BRANCHES_STORAGE_KEY, JSON.stringify(defaultBranches));
  return defaultBranches;
};
