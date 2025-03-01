
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

const API_URL = "https://api.your-backend-url.com"; // Replace with your actual API URL

export interface Company {
  id: string;
  name: string;
  nit: string;
  email: string;
  phone: string;
  address: string;
  description?: string;
  created_at: string;
}

export interface CreateCompanyData {
  name: string;
  nit: string;
  email: string;
  phone: string;
  address: string;
  description?: string;
}

// Mock companies for development
const MOCK_COMPANIES: Company[] = [];

// This is a mock function. In a real app, you'd connect to your backend API
const fetchCompanies = async (token: string): Promise<Company[]> => {
  // For now we're mocking, but this would be a real API call
  console.log("Fetching companies with token:", token);
  
  // Mock response for development
  return Promise.resolve(MOCK_COMPANIES);
};

// Mock function for creating a company
const createCompanyAPI = async (company: CreateCompanyData, token: string): Promise<Company> => {
  console.log("Creating company with data:", company);
  console.log("Using token:", token);
  
  // Create a new mock company
  const newCompany: Company = {
    id: "mock-id-" + Date.now(),
    ...company,
    created_at: new Date().toISOString(),
  };
  
  // Add to our mock database
  MOCK_COMPANIES.push(newCompany);
  
  return Promise.resolve(newCompany);
};

export const useCompanies = () => {
  const { user, isAuthenticated } = useAuth();
  const mockToken = "mock-token";
  
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["companies"],
    queryFn: () => fetchCompanies(mockToken),
    enabled: isAuthenticated,
  });
  
  return {
    companies: data,
    isLoading,
    error,
  };
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  const mockToken = "mock-token";
  
  return useMutation({
    mutationFn: (company: CreateCompanyData) => createCompanyAPI(company, mockToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
};
