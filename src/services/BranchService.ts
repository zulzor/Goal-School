import AsyncStorage from '@react-native-async-storage/async-storage';
import { Branch } from '../types';
import { apiRequest } from './api';

const API_BASE_URL = '/api/branches';

// Получение списка филиалов
export const getBranches = async (): Promise<Branch[]> => {
  try {
    const response = await apiRequest<Branch[]>(API_BASE_URL, {
      method: 'GET',
    });
    return response;
  } catch (error) {
    console.error('Ошибка получения филиалов:', error);
    throw error;
  }
};

// Создание филиала
export const createBranch = async (
  branchData: Omit<Branch, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Branch> => {
  try {
    const response = await apiRequest<Branch>(API_BASE_URL, {
      method: 'POST',
      body: JSON.stringify(branchData),
    });
    return response;
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
    const response = await apiRequest<Branch>(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(branchData),
    });
    return response;
  } catch (error) {
    console.error('Ошибка обновления филиала:', error);
    throw error;
  }
};

// Удаление филиала
export const deleteBranch = async (id: string): Promise<boolean> => {
  try {
    await apiRequest(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error('Ошибка удаления филиала:', error);
    throw error;
  }
};

// Получение филиала по ID
export const getBranchById = async (id: string): Promise<Branch | null> => {
  try {
    const response = await apiRequest<Branch>(`${API_BASE_URL}/${id}`, {
      method: 'GET',
    });
    return response;
  } catch (error) {
    console.error('Ошибка получения филиала по ID:', error);
    throw error;
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
