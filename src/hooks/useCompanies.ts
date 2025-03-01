
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

// This is a mock function. In a real app, you'd connect to your backend API
const fetchCompanies = async (token: string): Promise<Company[]> => {
  // For now we're mocking, but this would be a real API call
  console.log("Fetching companies with token:", token);
  
  // This would be replaced with a real API call
  // return fetch(`${API_URL}/companies`, {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // }).then((res) => res.json());
  
  // Mock response for development
  return Promise.resolve([]);
};

// Mock function for creating a company
const createCompanyAPI = async (company: CreateCompanyData, token: string): Promise<Company> => {
  console.log("Creating company with data:", company);
  console.log("Using token:", token);
  
  // This would be replaced with a real API call
  // return fetch(`${API_URL}/companies`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${token}`,
  //   },
  //   body: JSON.stringify(company),
  // }).then((res) => res.json());
  
  // Mock response for development
  return Promise.resolve({
    id: "mock-id-" + Date.now(),
    ...company,
    created_at: new Date().toISOString(),
  });
};

export const useCompanies = () => {
  const { user, isAuthenticated } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  
  // In a real app, you'd get the token from Cognito
  // We're using a mock token for now
  user?.getSession((err: any, session: any) => {
    if (session) {
      setToken(session.getIdToken().getJwtToken());
    }
  });
  
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["companies"],
    queryFn: () => fetchCompanies(token || ""),
    enabled: !!token && isAuthenticated,
  });
  
  return {
    companies: data,
    isLoading,
    error,
  };
};

export const useCreateCompany = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  
  // In a real app, you'd get the token from Cognito
  user?.getSession((err: any, session: any) => {
    if (session) {
      setToken(session.getIdToken().getJwtToken());
    }
  });
  
  return useMutation({
    mutationFn: (company: CreateCompanyData) => createCompanyAPI(company, token || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
};
