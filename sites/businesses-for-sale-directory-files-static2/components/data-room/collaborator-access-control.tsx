import React, { useState } from 'react';

interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: 'Advisor' | 'Legal Counsel' | 'Lender/Underwriter' | 'Buyer' | 'Seller';
  organization: string;
  clearanceLevel: 'Admin' | 'Read/Write' | 'Read-Only' | 'Watermarked' | 'Revoked';
  status: 'Active' | 'Idle' | 'Offline';
  activeSessions: number;
  lastActive: string;
  keyFingerprint: string;
  assignedFolders: {
    financials: boolean;
    legal: boolean;
    operations: boolean;
    equipment: boolean;
  };
}

interface AuditLog {
  id: string;
  timestamp: string;
  collaboratorName: string;
  action: string;
  document: string;
  ipAddress: string;
  status: 'GRANTED' | 'WARNING' | 'REVOKED';
}

export default function CollaboratorAccessControl() {
  // Mock Initial States
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    {
      id: 'col-1',
      name: 'Sarah Jenkins',
      email: 's.jenkins@vanguard-acquisitions.com',
      role: 'Buyer',
      organization: 'Vanguard Holdings LLC',
      clearanceLevel: 'Admin',
      status: 'Active',
      activeSessions: 2,
      lastActive: 'Just now',
      keyFingerprint: 'SHA256:8f:9a:bc:22:11:e3',
      assignedFolders: { financials: true, legal: true, operations: true, equipment: true }
    },
    {
      id: 'col-2',
      name: 'Marcus Vance',
      email: 'marcus.vance@moonshinecap.com',
      role: 'Advisor',
      organization: 'Moonshine Capital Brokerage',
      clearanceLevel: 'Read/Write',
      status: 'Active',
      activeSessions: 1,
      lastActive: '14 mins ago',
      keyFingerprint: 'SHA256:4a:2e:ff:39:10:a1',
      assignedFolders: { financials: true, legal: true, operations: true, equipment: true }
    },
    {
      id: 'col-3',
      name: 'Elena Rostova',
      email: 'e.rostova@rostovalaw.com',
      role: 'Legal Counsel',
      organization: 'Rostova M&A Partners',
      clearanceLevel: 'Read-Only',
      status: 'Idle',
      activeSessions: 0,
      lastActive: '2 hrs ago',
      keyFingerprint: 'SHA256:92:d4:ee:11:7b:55',
      assignedFolders: { financials: false, legal: true, operations: false, equipment: false }
    },
    {
      id: 'col-4',
      name: 'David Chen',
      email: 'dchen@sbalendingpartners.com',
      role: 'Lender/Underwriter',
      organization: 'SBA Preferred Bank Trust',
      clearanceLevel: 'Watermarked',
      status: 'Offline',
      activeSessions: 0,
      lastActive: '1 day ago',
      keyFingerprint: 'SHA256:bb:10:77:c9:e2:20',
      assignedFolders: { financials: true, legal: false, operations: false, equipment: true }
    }
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'log-1',
      timestamp: '2026-03-30 14:32:01',
      collaboratorName: 'Sarah Jenkins',
      action: 'Decrypted & Viewed PDF',
      document: 'FY23-FY25 Tax Returns.pdf',
      ipAddress: '198.162.1.84',
      status: 'GRANTED'
    },
    {
      id: 'log-2',
      timestamp: '2026-03-30 14:15:12',
      collaboratorName: 'Marcus Vance',
      action: 'Uploaded Document',
      document: 'Updated Equipment Registry (LTM).xlsx',
      ipAddress: '72.190.22.115',
      status: 'GRANTED'
    },
    {
      id: 'log-3',
      timestamp: '2026-03-30 13:02:44',
      collaboratorName: 'Elena Rostova',
      action: 'Attempted Root Folder Access',
      document: 'Seller Core Diligence Keys (Unmasked)',
      ipAddress: '185.22.17.4',
      status: 'WARNING'
    },
    {
      id: 'log-4',
      timestamp: '2026-03-30 11:45:10',
      collaboratorName: 'David Chen',
      action: 'Downloaded Watermarked Copy',
      document: 'LTM Margin Analysis Breakdown.pdf',
      ipAddress: '12.42.204.18',
      status: 'GRANTED'
    }
  ]);

  // UI State Controls
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollabId, setSelectedCollabId] = useState<string>('col-1');
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  // Invite Form States
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Advisor' | 'Legal Counsel' | 'Lender/Underwriter' | 'Buyer' | 'Seller'>('Legal Counsel');
  const [inviteClearance, setInviteClearance] = useState<Collaborator['clearanceLevel']>('Read-Only');

  // Computed Values
  const selectedCollaborator = collaborators.find(c => c.id === selectedCollabId) || collaborators[0];

  const handleClearanceChange = (collabId: string, level: Collaborator['clearanceLevel']) => {
    setCollaborators(prev =>
      prev.map(c => {
        if (c.id === collabId) {
          // Log permission mutation
          const newLog: AuditLog = {
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            collaboratorName: 'SYSTEM ADMIN',
            action: `Set Clearance Level of ${c.name} to ${level}`,
            document: 'VDR Access Rules Configuration',
            ipAddress: '127.0.0.1',
            status: level === 'Revoked' ? 'REVOKED' : 'GRANTED'
          };
          setAuditLogs(logs => [newLog, ...logs]);
          return { ...c, clearanceLevel: level };
        }
        return c;
      })
    );
  };

  const handleFolderToggle = (collabId: string, folder: keyof Collaborator['assignedFolders']) => {
    setCollaborators(prev =>
      prev.map(c => {
        if (c.id === collabId) {
          const updatedFolders = { ...c.assignedFolders, [folder]: !c.assignedFolders[folder] };
          // Log access modification
          const newLog: AuditLog = {
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            collaboratorName: 'SYSTEM ADMIN',
            action: `${updatedFolders[folder] ? 'GRANTED' : 'REVOKED'} folder Access: [${folder.toUpperCase()}] for ${c.name}`,
            document: 'Directory Policy',
            ipAddress: '127.0.0.1',
            status: 'GRANTED'
          };
          setAuditLogs(logs => [newLog, ...logs]);
          return { ...c, assignedFolders: updatedFolders };
        }
        return c;
      })
    );
  };

  const handleRevokeAll = (collabId: string) => {
    setCollaborators(prev =>
      prev.map(c => {
        if (c.id === collabId) {
          const newLog: AuditLog = {
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            collaboratorName: 'SYSTEM ADMIN - PANIC TRIGGER',
            action: `IMMEDIATE TOTAL REVOCATION OF ${c.name.toUpperCase()}`,
            document: 'ALL SECURE SECTOR CHANNELS',
            ipAddress: '127.0.0.1',
            status: 'REVOKED'
          };
          setAuditLogs(logs => [newLog, ...logs]);
          return {
            ...c,
            clearanceLevel: 'Revoked',
            status: 'Offline',
            activeSessions: 0,
            assignedFolders: { financials: false, legal: false, operations: false, equipment: false }
          };
        }
        return c;
      })
    );
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) return;

    const newCollab: Collaborator = {
      id: `col-${Date.now()}`,
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      organization: 'External Verifier (Awaiting Handshake)',
      clearanceLevel: inviteClearance,
      status: 'Offline',
      activeSessions: 0,
      lastActive: 'Never',
      keyFingerprint: `SHA256:pending:${Math.random().toString(16).substring(2, 8)}`,
      assignedFolders: { financials: false, legal: false, operations: false, equipment: false }
    };

    setCollaborators(prev => [...prev, newCollab]);

    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      collaboratorName: 'SECURE HANDSHAKE ENGINE',
      action: `Dispatched Encrypted Invite Token to ${inviteEmail}`,
      document: `Secure VDR Handshake Channel`,
      ipAddress: '127.0.0.1',
      status: 'GRANTED'
    };
    setAuditLogs(logs => [newLog, ...logs]);

    // Reset Form
    setInviteName('');
    setInviteEmail('');
    setIsInviteOpen(false);
  };

  // Filter Collaborators
  const filteredCollaborators = collaborators.filter(
    c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full bg-[#050505] text-[#F9F9F9] border border-[#222222] font-sans flex flex-col glow-copper overflow-hidden">
      {/* Dynamic Header */}
      <div className="bg-[#090909] border-b border-[#222222] p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="font-mono text-[9px] text-[#0EA5E9] tracking-widest uppercase block mb-1">
            SECURE ACCESS INTERFACE // LOI STAGE
          </span>
          <h2 className="text-lg font-bold font-mono tracking-tight flex items-center space-x-2">
            <span>SECURE COLLABORATOR & VDR MATRIX</span>
            <span className="inline-block w-2 h-2 rounded-full bg-[#00FF66] animate-pulse"></span>
          </h2>
          <p className="text-xs text-[#666] font-mono mt-1">
            Cryptographically signed tunnel control for diligence, P&L, legal documents, and asset inventories.
          </p>
        </div>

        {/* System Stats Indicators */}
        <div className="flex gap-4">
          <div className="bg-black p-3 border border-[#1a1a1a] min-w-[120px]">
            <span className="font-mono text-[8px] text-[#666] block">ACTIVE TUNNELS</span>
            <span className="font-mono text-sm font-bold text-[#00FF66]">
              {collaborators.filter(c => c.status === 'Active').length} SESSIONS
            </span>
          </div>
          <div className="bg-black p-3 border border-[#1a1a1a] min-w-[120px]">
            <span className="font-mono text-[8px] text-[#666] block">IP SHIELD RATING</span>
            <span className="font-mono text-sm font-bold text-[#0EA5E9]">AES-256</span>
          </div>
        </div>
      </div>

      {/* Main Structural Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px] border-b border-[#222222]">
        {/* Left Side: Collaborator Directory Pane (5 Columns) */}
        <div className="lg:col-span-5 border-r border-[#222222] bg-[#070707] p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#1a1a1a]">
              <span className="font-mono text-[10px] uppercase text-[#888] tracking-widest">
                01 / COLLABORATOR INSTANCES
              </span>
              <button
                onClick={() => setIsInviteOpen(true)}
                className="font-mono text-[9px] text-[#00FF66] hover:underline flex items-center space-x-1"
              >
                <span>[ + SPAWN TUNNEL ]</span>
              </button>
            </div>

            {/* Live Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Query name, entity, or role..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full h-10 bg-black border border-[#222] rounded-none px-3 text-xs font-mono text-[#F9F9F9] placeholder-[#444] focus:outline-none focus:border-[#0EA5E9]"
              />
              <span className="absolute right-3 top-3 text-[#444] text-[9px] font-mono">LIST: {filteredCollaborators.length}</span>
            </div>

            {/* List Array */}
            <div className="space-y-2 overflow-y-auto max-h-[420px]">
              {filteredCollaborators.map(c => {
                const isSelected = c.id === selectedCollabId;
                let statusColor = 'bg-[#444]';
                if (c.status === 'Active') statusColor = 'bg-[#00FF66]';
                if (c.status === 'Idle') statusColor = 'bg-[#0EA5E9]';
                if (c.clearanceLevel === 'Revoked') statusColor = 'bg-[#FF3333]';

                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCollabId(c.id)}
                    className={`p-3.5 border transition-all cursor-pointer flex justify-between items-center ${
                      isSelected
                        ? 'border-[#0EA5E9] bg-gradient-to-r from-[#0d151c] to-black shadow-inner'
                        : 'border-[#1a1a1a] bg-black/50 hover:border-[#333] hover:bg-black'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className={`w-1.5 h-1.5 ${statusColor}`}></span>
                        <span className="text-xs font-bold tracking-tight text-[#F9F9F9]">{c.name}</span>
                        <span className="font-mono text-[8px] px-1.5 py-0.25 bg-[#222] text-[#888] rounded-xs uppercase">
                          {c.role}
                        </span>
                      </div>
                      <p className="font-mono text-[9px] text-[#666] leading-none truncate max-w-[200px] md:max-w-xs">
                        {c.organization}
                      </p>
                    </div>

                    <div className="text-right space-y-1">
                      <span
                        className={`font-mono text-[9px] tracking-widest font-bold uppercase ${
                          c.clearanceLevel === 'Admin'
                            ? 'text-[#00FF66]'
                            : c.clearanceLevel === 'Revoked'
                            ? 'text-[#FF3333]'
                            : 'text-[#0EA5E9]'
                        }`}
                      >
                        {c.clearanceLevel}
                      </span>
                      <p className="font-mono text-[8px] text-[#444]">
                        Sessions: <span className="text-[#888]">{c.activeSessions}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Core Emergency Panic Hook */}
          <div className="border-t border-[#1a1a1a] pt-4 mt-6">
            <button
              onClick={() => handleRevokeAll(selectedCollabId)}
              className="w-full h-11 border border-[#FF3333]/40 text-[#FF3333] hover:bg-[#FF3333] hover:text-black font-mono text-[10px] tracking-widest font-bold uppercase transition-all duration-300 hover:shadow-[0_0_12px_rgba(255,51,51,0.2)]"
            >
              ⚠ INITIATE PANIC BLOCK ON SELECTED INSTANCE
            </button>
          </div>
        </div>

        {/* Right Side: Permission Matrix & Audit Viewport (7 Columns) */}
        <div className="lg:col-span-7 bg-black p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Context Breadcrumb */}
            <div className="flex justify-between items-center border-b border-[#1a1a1a] pb-3">
              <span className="font-mono text-[10px] uppercase text-[#888] tracking-widest">
                02 / TUNNEL SECURITY DESK
              </span>
              <span className="font-mono text-[9px] text-[#666]">
                FINGERPRINT: <span className="text-white font-bold">{selectedCollaborator.keyFingerprint}</span>
              </span>
            </div>

            {/* Profile Overview Card */}
            <div className="bg-[#090909] border border-[#222] p-4 flex flex-col sm:flex-row justify-between gap-4">
              <div className="space-y-1">
                <span className="font-mono text-[9px] text-[#0EA5E9] uppercase tracking-wider">
                  TARGET CREDENTIAL DETAILS
                </span>
                <h3 className="text-base font-bold text-[#F9F9F9]">{selectedCollaborator.name}</h3>
                <p className="font-mono text-xs text-[#888]">{selectedCollaborator.email}</p>
                <p className="font-mono text-[10px] text-[#555] italic">Last connection: {selectedCollaborator.lastActive}</p>
              </div>

              {/* Clearance Matrix Dropdown */}
              <div className="bg-black border border-[#1a1a1a] p-3 flex flex-col justify-center space-y-1 sm:min-w-[180px]">
                <label className="font-mono text-[8px] text-[#666] uppercase block">CLEARANCE RULES</label>
                <select
                  value={selectedCollaborator.clearanceLevel}
                  onChange={e =>
                    handleClearanceChange(selectedCollaborator.id, e.target.value as Collaborator['clearanceLevel'])
                  }
                  className="bg-black text-[#00FF66] border border-[#222] px-2 py-1 text-xs font-mono focus:outline-none focus:border-[#0EA5E9]"
                >
                  <option value="Admin">Admin (All Sectors)</option>
                  <option value="Read/Write">Read/Write Access</option>
                  <option value="Read-Only">Read-Only Secure</option>
                  <option value="Watermarked">Watermarked PDF Only</option>
                  <option value="Revoked">Revoked / Suspended</option>
                </select>
              </div>
            </div>

            {/* Structured VDR Matrix (Folder Checklists) */}
            <div className="space-y-3">
              <h4 className="font-mono text-[10px] text-[#888] uppercase tracking-widest">
                03 / DIRECTORY POLICY ACCESS MATRIX
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Financial Folder Block */}
                <div
                  onClick={() => handleFolderToggle(selectedCollaborator.id, 'financials')}
                  className={`border p-4.5 cursor-pointer flex justify-between items-center transition-all ${
                    selectedCollaborator.assignedFolders.financials
                      ? 'border-[#00FF66]/40 bg-[#00FF66]/5 text-[#F9F9F9]'
                      : 'border-[#1a1a1a] bg-[#070707] text-[#555]'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="font-mono text-[9px] text-[#666] uppercase block">DIRECTORY SECTOR</span>
                    <span className="font-mono text-xs font-bold tracking-tight">
                      FINANCIALS / TAX RETURNS / P&L
                    </span>
                  </div>
                  <span
                    className={`font-mono text-[11px] font-bold ${
                      selectedCollaborator.assignedFolders.financials ? 'text-[#00FF66]' : 'text-[#444]'
                    }`}
                  >
                    {selectedCollaborator.assignedFolders.financials ? 'ACTIVE' : 'LOCKED'}
                  </span>
                </div>

                {/* Legal Block */}
                <div
                  onClick={() => handleFolderToggle(selectedCollaborator.id, 'legal')}
                  className={`border p-4.5 cursor-pointer flex justify-between items-center transition-all ${
                    selectedCollaborator.assignedFolders.legal
                      ? 'border-[#00FF66]/40 bg-[#00FF66]/5 text-[#F9F9F9]'
                      : 'border-[#1a1a1a] bg-[#070707] text-[#555]'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="font-mono text-[9px] text-[#666] uppercase block">DIRECTORY SECTOR</span>
                    <span className="font-mono text-xs font-bold tracking-tight">
                      LEGAL & LOI AGREEMENTS
                    </span>
                  </div>
                  <span
                    className={`font-mono text-[11px] font-bold ${
                      selectedCollaborator.assignedFolders.legal ? 'text-[#00FF66]' : 'text-[#444]'
                    }`}
                  >
                    {selectedCollaborator.assignedFolders.legal ? 'ACTIVE' : 'LOCKED'}
                  </span>
                </div>

                {/* Operations Block */}
                <div
                  onClick={() => handleFolderToggle(selectedCollaborator.id, 'operations')}
                  className={`border p-4.5 cursor-pointer flex justify-between items-center transition-all ${
                    selectedCollaborator.assignedFolders.operations
                      ? 'border-[#00FF66]/40 bg-[#00FF66]/5 text-[#F9F9F9]'
                      : 'border-[#1a1a1a] bg-[#070707] text-[#555]'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="font-mono text-[9px] text-[#666] uppercase block">DIRECTORY SECTOR</span>
                    <span className="font-mono text-xs font-bold tracking-tight">
                      OPERATIONS & SUPPLIER CONTRACTS
                    </span>
                  </div>
                  <span
                    className={`font-mono text-[11px] font-bold ${
                      selectedCollaborator.assignedFolders.operations ? 'text-[#00FF66]' : 'text-[#444]'
                    }`}
                  >
                    {selectedCollaborator.assignedFolders.operations ? 'ACTIVE' : 'LOCKED'}
                  </span>
                </div>

                {/* Equipment Block */}
                <div
                  onClick={() => handleFolderToggle(selectedCollaborator.id, 'equipment')}
                  className={`border p-4.5 cursor-pointer flex justify-between items-center transition-all ${
                    selectedCollaborator.assignedFolders.equipment
                      ? 'border-[#00FF66]/40 bg-[#00FF66]/5 text-[#F9F9F9]'
                      : 'border-[#1a1a1a] bg-[#070707] text-[#555]'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="font-mono text-[9px] text-[#666] uppercase block">DIRECTORY SECTOR</span>
                    <span className="font-mono text-xs font-bold tracking-tight">
                      EQUIPMENT & LAND REGISTRY
                    </span>
                  </div>
                  <span
                    className={`font-mono text-[11px] font-bold ${
                      selectedCollaborator.assignedFolders.equipment ? 'text-[#00FF66]' : 'text-[#444]'
                    }`}
                  >
                    {selectedCollaborator.assignedFolders.equipment ? 'ACTIVE' : 'LOCKED'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Logs Audit Ledger Viewport */}
          <div className="border-t border-[#1a1a1a] pt-5 mt-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] uppercase text-[#888] tracking-widest">
                04 / ENCRYPTED LEDGER AUDIT LOGS
              </span>
              <span className="text-[9px] font-mono text-[#444]">CRYPTO STAMP INTEGRITY OK</span>
            </div>

            <div className="space-y-1.5 font-mono text-[10px] overflow-y-auto max-h-[140px] bg-black border border-[#151515] p-3">
              {auditLogs.map(log => {
                let statusBadge = 'text-[#00FF66]';
                if (log.status === 'WARNING') statusBadge = 'text-[#FF3333] font-bold animate-pulse';
                if (log.status === 'REVOKED') statusBadge = 'text-[#FF3333] font-black underline';

                return (
                  <div key={log.id} className="flex flex-col sm:flex-row sm:justify-between border-b border-[#111] pb-1.5 mb-1.5 last:border-0 last:pb-0 last:mb-0">
                    <div className="space-x-1">
                      <span className="text-[#555]">{log.timestamp}</span>
                      <span className="text-[#0EA5E9] font-bold">[{log.collaboratorName.substring(0, 16)}]</span>
                      <span className="text-[#888]">{log.action}:</span>
                      <span className="text-[#F9F9F9] text-[9px] bg-[#111] px-1 py-0.25">{log.document}</span>
                    </div>
                    <div className="flex justify-between sm:justify-end sm:space-x-3 text-[9px]">
                      <span className="text-[#444]">{log.ipAddress}</span>
                      <span className={statusBadge}>{log.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Spawning Invitation Modal (React Dialog simulation) */}
      {isInviteOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="w-full max-w-[500px] bg-[#090909] border border-[#222222] text-[#F9F9F9] flex flex-col relative glow-copper p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-[#222222] pb-3">
              <h3 className="font-mono text-xs uppercase tracking-widest text-[#F9F9F9]">
                SPAWN CRYPTOGRAPHIC HANDSHAKE INVITATION
              </h3>
              <button
                onClick={() => setIsInviteOpen(false)}
                className="text-xs font-mono text-[#666] hover:text-[#FF3333]"
              >
                [ CLOSE ]
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="font-mono text-[9px] uppercase text-[#888] tracking-wider">01 / RECIPIENT FULL NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Robert Kowalski"
                  value={inviteName}
                  onChange={e => setInviteName(e.target.value)}
                  className="w-full h-10 bg-black border border-[#222] rounded-none px-3 text-xs font-mono text-[#F9F9F9] focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[9px] uppercase text-[#888] tracking-wider">02 / SECURE EMAIL ROUTE</label>
                <input
                  type="email"
                  required
                  placeholder="robert.k@kowalskilaw.com"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  className="w-full h-10 bg-black border border-[#222] rounded-none px-3 text-xs font-mono text-[#F9F9F9] focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase text-[#888] tracking-wider">03 / TEAM ROLE</label>
                  <select
                    value={inviteRole}
                    onChange={e => setInviteRole(e.target.value as any)}
                    className="w-full h-10 bg-black text-xs font-mono border border-[#222] rounded-none px-2 focus:outline-none"
                  >
                    <option value="Advisor">Advisor</option>
                    <option value="Legal Counsel">Legal Counsel</option>
                    <option value="Lender/Underwriter">Lender/Underwriter</option>
                    <option value="Buyer">Buyer Team</option>
                    <option value="Seller">Seller Owner</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase text-[#888] tracking-wider">04 / CLEARANCE RULES</label>
                  <select
                    value={inviteClearance}
                    onChange={e => setInviteClearance(e.target.value as any)}
                    className="w-full h-10 bg-black text-xs font-mono border border-[#222] rounded-none px-2 focus:outline-none"
                  >
                    <option value="Read-Only">Read-Only Secure</option>
                    <option value="Watermarked">Watermarked PDF</option>
                    <option value="Read/Write">Read / Write Access</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-11 bg-transparent border border-[#00FF66] text-[#00FF66] hover:bg-[#00FF66] hover:text-black font-mono text-[10px] font-bold tracking-widest uppercase transition-colors"
                >
                  DISPATCH SECURE HANDSHAKE PIPELINE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}