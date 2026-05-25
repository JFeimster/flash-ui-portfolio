import { useState, useMemo, useCallback } from 'react';

export type PartnerType = 'BRK' | 'REF' | 'AFF' | 'VND' | 'ALL';
export type PartnerStatus = 'ACTIVE' | 'PROVISIONED' | 'INACTIVE' | 'SUSPENDED' | 'ALL';

export interface Partner {
  id: string;
  fullName: string;
  company: string;
  email: string;
  partnerType: Exclude<PartnerType, 'ALL'>;
  regDate: string;
  status: Exclude<PartnerStatus, 'ALL'>;
  performanceScore: number;
  lastActivity: string;
  metadata: {
    nodeId: string;
    clearanceLevel: number;
    region: string;
    totalAllocated: string;
  };
}

export interface DirectoryFilters {
  type: PartnerType;
  status: PartnerStatus;
  year: string;
  search: string;
}

const MOCK_PARTNERS: Partner[] = [
  {
    id: 'MC-BRK-AT24',
    fullName: 'Alexander Thorne',
    company: 'Thorne Equities',
    email: 'a.thorne@thorne-eq.com',
    partnerType: 'BRK',
    regDate: '2024-05-12',
    status: 'ACTIVE',
    performanceScore: 94.2,
    lastActivity: '2024-05-20T14:22:00Z',
    metadata: { nodeId: 'LND-88', clearanceLevel: 4, region: 'North America', totalAllocated: '$2.4M' }
  },
  {
    id: 'MC-REF-SJ23',
    fullName: 'Sarah Jenkins',
    company: 'Direct Flow LLC',
    email: 'sjenks@dflow.io',
    partnerType: 'REF',
    regDate: '2023-11-20',
    status: 'ACTIVE',
    performanceScore: 88.5,
    lastActivity: '2024-05-19T09:15:00Z',
    metadata: { nodeId: 'LND-12', clearanceLevel: 2, region: 'Europe', totalAllocated: '$840K' }
  },
  {
    id: 'MC-AFF-MV24',
    fullName: 'Marcus Vane',
    company: 'Vane Global',
    email: 'm.vane@vaneglobal.net',
    partnerType: 'AFF',
    regDate: '2024-01-05',
    status: 'ACTIVE',
    performanceScore: 72.1,
    lastActivity: '2024-05-18T16:45:00Z',
    metadata: { nodeId: 'LND-44', clearanceLevel: 3, region: 'Asia Pacific', totalAllocated: '$1.1M' }
  },
  {
    id: 'MC-VND-ER24',
    fullName: 'Elena Rossi',
    company: 'Rossi Systems',
    email: 'erossi@rossi.sys',
    partnerType: 'VND',
    regDate: '2024-02-18',
    status: 'PROVISIONED',
    performanceScore: 0,
    lastActivity: '2024-02-18T11:00:00Z',
    metadata: { nodeId: 'LND-88', clearanceLevel: 1, region: 'Europe', totalAllocated: '$0' }
  },
  {
    id: 'MC-BRK-JC23',
    fullName: 'Julian Chen',
    company: 'Summit Capital',
    email: 'jchen@summit.cap',
    partnerType: 'BRK',
    regDate: '2023-09-30',
    status: 'ACTIVE',
    performanceScore: 91.8,
    lastActivity: '2024-05-20T08:00:00Z',
    metadata: { nodeId: 'LND-09', clearanceLevel: 4, region: 'Asia Pacific', totalAllocated: '$5.2M' }
  }
];

export const usePartnerDirectory = () => {
  const [partners, setPartners] = useState<Partner[]>(MOCK_PARTNERS);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [filters, setFilters] = useState<DirectoryFilters>({
    type: 'ALL',
    status: 'ALL',
    year: 'ALL',
    search: ''
  });

  const filteredPartners = useMemo(() => {
    return partners.filter(partner => {
      const matchesType = filters.type === 'ALL' || partner.partnerType === filters.type;
      const matchesStatus = filters.status === 'ALL' || partner.status === filters.status;
      const matchesYear = filters.year === 'ALL' || partner.regDate.startsWith(filters.year);
      const matchesSearch = 
        partner.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
        partner.company.toLowerCase().includes(filters.search.toLowerCase()) ||
        partner.id.toLowerCase().includes(filters.search.toLowerCase());

      return matchesType && matchesStatus && matchesYear && matchesSearch;
    }).sort((a, b) => new Date(b.regDate).getTime() - new Date(a.regDate).getTime());
  }, [partners, filters]);

  const selectedPartner = useMemo(() => 
    partners.find(p => p.id === selectedPartnerId) || null,
  [partners, selectedPartnerId]);

  const updateFilters = useCallback((update: Partial<DirectoryFilters>) => {
    setFilters(prev => ({ ...prev, ...update }));
  }, []);

  const selectPartner = useCallback((id: string | null) => {
    setSelectedPartnerId(id);
  }, []);

  const updatePartnerStatus = useCallback((id: string, newStatus: Exclude<PartnerStatus, 'ALL'>) => {
    setPartners(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
  }, []);

  const availableYears = useMemo(() => {
    const years = partners.map(p => p.regDate.split('-')[0]);
    return Array.from(new Set(years)).sort((a, b) => b.localeCompare(a));
  }, [partners]);

  return {
    partners: filteredPartners,
    selectedPartner,
    filters,
    availableYears,
    updateFilters,
    selectPartner,
    updatePartnerStatus,
    stats: {
      totalActive: partners.filter(p => p.status === 'ACTIVE').length,
      avgPerformance: partners.reduce((acc, curr) => acc + curr.performanceScore, 0) / partners.length,
      provisioningCount: partners.filter(p => p.status === 'PROVISIONED').length
    }
  };
};