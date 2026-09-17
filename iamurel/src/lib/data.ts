import { isSupabaseConfigured, supabase } from './supabase';
import { mockSettings, mockServices, mockPackages, mockLeads, mockShowcases, mockFaq } from './mockData';
import { SiteSettings, Service, Package, Lead, Showcase, FAQ } from '../types';

// In a real scenario, this would be a class or a set of functions with full CRUD.
// We implement a hybrid that reads from mock if Supabase is disconnected.

export const dataLayer = {
  getSettings: async (): Promise<SiteSettings> => {
    if (isSupabaseConfigured) {
      const { data } = await supabase.from('iamurel_site_settings').select('*').single();
      if (data) return data;
    }
    return mockSettings;
  },

  getServices: async (): Promise<Service[]> => {
    if (isSupabaseConfigured) {
      const { data } = await supabase.from('iamurel_services').select('*').order('order_index');
      if (data) return data;
    }
    return mockServices;
  },

  getPackages: async (): Promise<Package[]> => {
    if (isSupabaseConfigured) {
      const { data } = await supabase.from('iamurel_packages').select('*, items:iamurel_package_items(*)').order('order_index');
      if (data) return data;
    }
    return mockPackages;
  },

  getShowcases: async (): Promise<Showcase[]> => {
    if (isSupabaseConfigured) {
      const { data } = await supabase.from('iamurel_showcases').select('*').order('order_index');
      if (data) return data;
    }
    return mockShowcases;
  },

  getFaq: async (): Promise<FAQ[]> => {
    if (isSupabaseConfigured) {
      const { data } = await supabase.from('iamurel_faq').select('*').order('order_index');
      if (data) return data;
    }
    return mockFaq;
  },

  submitLead: async (leadData: Partial<Lead>): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('iamurel_leads').insert([leadData]);
      if (error) return { success: false, error: error.message };
      return { success: true };
    }
    
    // Mock simulation
    console.log('Mock: Lead submitted:', leadData);
    mockLeads.push({
      ...leadData,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      status: 'novo',
      tags: [],
    } as Lead);
    
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 800));
  },

  getLeads: async (): Promise<Lead[]> => {
    if (isSupabaseConfigured) {
      const { data } = await supabase.from('iamurel_leads').select('*').order('created_at', { ascending: false });
      if (data) return data;
    }
    return mockLeads;
  },
  
  updateLeadStatus: async (leadId: string, status: string): Promise<boolean> => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('iamurel_leads').update({ status }).eq('id', leadId);
      return !error;
    }
    
    const lead = mockLeads.find(l => l.id === leadId);
    if (lead) lead.status = status as any;
    return true;
  }
};
