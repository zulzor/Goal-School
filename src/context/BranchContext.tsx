import React, { createContext, useContext, useState, useEffect } from 'react';
import { Branch } from '../types';
import * as BranchService from '../services/BranchService';

interface BranchContextType {
  branches: Branch[];
  isLoading: boolean;
  error: string | null;
  loadBranches: () => Promise<void>;
  createBranch: (branchData: Omit<Branch, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Branch>;
  updateBranch: (id: string, branchData: Partial<Branch>) => Promise<Branch | null>;
  deleteBranch: (id: string) => Promise<boolean>;
  getBranchById: (id: string) => Promise<Branch | null>;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export const useBranch = () => {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error('useBranch должен использоваться внутри BranchProvider');
  }
  return context;
};

interface BranchProviderProps {
  children: React.ReactNode;
}

export const BranchProvider: React.FC<BranchProviderProps> = ({ children }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка филиалов при инициализации
  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedBranches = await BranchService.getBranches();
      setBranches(loadedBranches);
    } catch (err) {
      setError('Ошибка загрузки филиалов');
      console.error('Ошибка загрузки филиалов:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createBranch = async (branchData: Omit<Branch, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true);
      setError(null);
      const newBranch = await BranchService.createBranch(branchData);
      setBranches(prev => [...prev, newBranch]);
      return newBranch;
    } catch (err) {
      setError('Ошибка создания филиала');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateBranch = async (id: string, branchData: Partial<Branch>) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedBranch = await BranchService.updateBranch(id, branchData);
      if (updatedBranch) {
        setBranches(prev => prev.map(branch => (branch.id === id ? updatedBranch : branch)));
      }
      return updatedBranch;
    } catch (err) {
      setError('Ошибка обновления филиала');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBranch = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await BranchService.deleteBranch(id);
      if (result) {
        setBranches(prev => prev.filter(branch => branch.id !== id));
      }
      return result;
    } catch (err) {
      setError('Ошибка удаления филиала');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getBranchById = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const branch = await BranchService.getBranchById(id);
      return branch;
    } catch (err) {
      setError('Ошибка получения филиала');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value: BranchContextType = {
    branches,
    isLoading,
    error,
    loadBranches,
    createBranch,
    updateBranch,
    deleteBranch,
    getBranchById,
  };

  return <BranchContext.Provider value={value}>{children}</BranchContext.Provider>;
};
