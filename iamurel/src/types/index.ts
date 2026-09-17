export interface SiteSettings {
  id: string;
  name: string;
  description: string;
  hero_title: string;
  hero_subtitle: string;
  primary_cta_text: string;
  secondary_cta_text: string;
  contact_email: string;
}

export interface Section {
  id: string;
  section_key: string;
  title: string;
  content: string;
  is_published: boolean;
  order_index: number;
}

export interface Service {
  id: string;
  title: string;
  problem_solved: string;
  deliverables: string;
  target_audience: string;
  not_included: string;
  timeframe: string;
  investment_range: string | null;
  image_url: string | null;
  order_index: number;
  status: 'active' | 'archived';
}

export interface Package {
  id: string;
  level: 'Essencial' | 'Recomendado' | 'Profissional' | 'Ultra';
  commercial_role: string;
  description: string;
  price: number | null;
  price_type: 'fixed' | 'starting_at' | 'on_request' | 'hidden';
  revisions: string;
  timeframe: string;
  is_highlighted: boolean;
  order_index: number;
  status: 'active' | 'archived';
  items?: PackageItem[];
}

export interface PackageItem {
  id: string;
  package_id: string;
  title: string;
  quantity: string | null;
  order_index: number;
}

export interface Showcase {
  id: string;
  title: string;
  label: 'demonstration' | 'author_study' | 'process_example';
  context: string;
  decision: string;
  deliverable: string;
  image_url: string | null;
  order_index: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order_index: number;
}

export type LeadStatus = 'novo' | 'em_analise' | 'contatado' | 'proposta_enviada' | 'ganho' | 'perdido' | 'arquivado';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  business_name: string;
  need: string;
  objective: string;
  timeframe: string;
  investment_range: string | null;
  preferred_channel: string;
  message: string | null;
  origin: string | null;
  consent: boolean;
  status: LeadStatus;
  priority: 'low' | 'medium' | 'high';
  service_interest: string | null;
  package_interest: string | null;
  last_contact_at: string | null;
  next_follow_up_at: string | null;
  assigned_to: string | null;
  tags: string[];
  created_at: string;
}

export interface LeadNote {
  id: string;
  lead_id: string;
  content: string;
  created_by: string;
  created_at: string;
}

export interface Task {
  id: string;
  lead_id: string;
  title: string;
  due_date: string;
  status: 'pending' | 'completed';
  created_at: string;
}
