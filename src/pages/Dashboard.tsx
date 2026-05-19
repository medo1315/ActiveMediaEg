import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import logo from '../assets/30db22424ddeca550d6f82028b6980b8e2ce95d6.png';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  Video, 
  Users, 
  Briefcase,
  Settings,
  LogOut,
  Mail,
  Check,
  Loader2,
  Languages,
  Menu,
  ChevronLeft,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';

type Category = string;

interface Client {
  id: string;
  name: string;
  logo_url: string;
  manager_name: string;
}

interface Project {
  id: string;
  category: Category;
  title: string;
  client_id: string | null;
  description: string;
  year: string;
  tags: string[];
  vimeo_id: string;
  image_urls: string[];
}

export default function AdminDashboard() {
  const { language, toggleLanguage } = useLanguage();
  const isAr = language === 'ar';
  const [activeTab, setActiveTab] = useState<'projects' | 'clients' | 'team' | 'messages' | 'settings' | 'roles'>('projects');
  const [messageFilter, setMessageFilter] = useState<'all' | 'unread'>('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [uploadedLogoUrl, setUploadedLogoUrl] = useState('');
  const [uploadedMemberUrl, setUploadedMemberUrl] = useState('');
  const [uploadedProjectUrls, setUploadedProjectUrls] = useState('');
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  
  // Admin permissions & users management
  const currentUser = JSON.parse(localStorage.getItem('sb_user') || '{}');
  const isSuperAdmin = currentUser?.role === 'SuperAdmin';
  
  const hasPermission = (permission: string) => {
    if (!currentUser?.permissions) return false;
    return currentUser.permissions.includes('all') || currentUser.permissions.includes(permission);
  };

  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<string>('Editor');
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  // Automatically select the first tab the user has permission to view
  useEffect(() => {
    const tabs = [
      { id: 'projects', perm: 'projects_view' },
      { id: 'clients', perm: 'clients_view' },
      { id: 'team', perm: 'team_view' },
      { id: 'messages', perm: 'messages_view' },
      { id: 'roles', perm: 'users_manage' },
      { id: 'settings', perm: 'settings_manage' },
    ];
    const allowed = tabs.filter(t => hasPermission(t.perm));
    if (allowed.length > 0 && !allowed.some(t => t.id === activeTab)) {
      setActiveTab(allowed[0].id as any);
    }
  }, [currentUser]);

  // Custom Roles & Permissions management
  const [roles, setRoles] = useState<any[]>([]);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isSavingRole, setIsSavingRole] = useState(false);

  const PERMISSION_MODULES = [
    {
      id: 'projects',
      label: isAr ? 'المشاريع' : 'Projects',
      perms: [
        { id: 'projects_view', label: isAr ? 'عرض المشاريع' : 'View Projects' },
        { id: 'projects_edit', label: isAr ? 'إضافة وتعديل المشاريع' : 'Add/Edit Projects' },
        { id: 'projects_delete', label: isAr ? 'حذف المشاريع' : 'Delete Projects' }
      ]
    },
    {
      id: 'clients',
      label: isAr ? 'العملاء' : 'Clients',
      perms: [
        { id: 'clients_view', label: isAr ? 'عرض العملاء' : 'View Clients' },
        { id: 'clients_edit', label: isAr ? 'إضافة وتعديل العملاء' : 'Add/Edit Clients' },
        { id: 'clients_delete', label: isAr ? 'حذف العملاء' : 'Delete Clients' }
      ]
    },
    {
      id: 'team',
      label: isAr ? 'الفريق' : 'Team',
      perms: [
        { id: 'team_view', label: isAr ? 'عرض الفريق' : 'View Team' },
        { id: 'team_edit', label: isAr ? 'إدارة الفريق' : 'Manage Team' }
      ]
    },
    {
      id: 'messages',
      label: isAr ? 'الرسائل' : 'Inquiries',
      perms: [
        { id: 'messages_view', label: isAr ? 'قراءة الرسائل' : 'Read Inquiries' },
        { id: 'messages_delete', label: isAr ? 'حذف الرسائل' : 'Delete Inquiries' }
      ]
    },
    {
      id: 'settings',
      label: isAr ? 'الإعدادات والمشرفين' : 'Admin & Settings',
      perms: [
        { id: 'settings_manage', label: isAr ? 'تعديل إعدادات الموقع' : 'Manage Site Settings' },
        { id: 'users_manage', label: isAr ? 'إدارة الصلاحيات والمستخدمين' : 'Manage Users & Roles' },
        { id: 'all', label: isAr ? 'صلاحيات كاملة (SuperAdmin)' : 'Full Access (SuperAdmin)' }
      ]
    }
  ];

  const mainContentRef = useRef<HTMLElement>(null);
  const [isTabTransitioning, setIsTabTransitioning] = useState(false);

  const handleTabChange = (tabId: any) => {
    if (activeTab === tabId) return;
    setIsTabTransitioning(true);
    setActiveTab(tabId);
    setIsSidebarOpen(false);
    
    // Smooth scroll to top of main content
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Premium transition animation timer
    setTimeout(() => {
      setIsTabTransitioning(false);
    }, 500);
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (isModalOpen) {
      if (editingItem) {
        setUploadedLogoUrl(editingItem.logo_url || '');
        setUploadedMemberUrl(editingItem.image_url || '');
        setUploadedProjectUrls(editingItem.image_urls?.join(', ') || '');
      } else {
        setUploadedLogoUrl('');
        setUploadedMemberUrl('');
        setUploadedProjectUrls('');
      }
    }
  }, [editingItem, isModalOpen]);

  const fetchAdminUsers = async () => {
    try {
      const token = localStorage.getItem('sb_token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAdminUsers(data);
      }
    } catch (err) {
      console.error('Error fetching admin users:', err);
    }
  };

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem('sb_token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/users/roles`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRoles(data);
      }
    } catch (err) {
      console.error('Error fetching roles:', err);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail || !newAdminPassword) return;
    setIsCreatingUser(true);
    try {
      const token = localStorage.getItem('sb_token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/users`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: newAdminEmail, password: newAdminPassword, role: newAdminRole })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create user');
      toast.success(isAr ? 'تم إنشاء حساب المسؤول بنجاح' : 'Admin user created successfully');
      setNewAdminEmail('');
      setNewAdminPassword('');
      fetchAdminUsers();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleDeleteAdmin = async (id: string, email: string) => {
    if (email === currentUser?.email) {
      toast.error(isAr ? 'لا يمكنك حذف حسابك الحالي' : 'Cannot delete your own account');
      return;
    }
    const result = await Swal.fire({
      title: isAr ? 'هل أنت متأكد من حذف المسؤول؟' : 'Delete admin user?',
      text: email,
      icon: 'warning',
      showCancelButton: true,
      background: '#111',
      color: '#fff',
      confirmButtonColor: '#d4183d',
      cancelButtonColor: '#333',
      confirmButtonText: isAr ? 'نعم، احذف' : 'Yes, delete',
      cancelButtonText: isAr ? 'إلغاء' : 'Cancel'
    });
    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem('sb_token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || 'Failed to delete user');
      }
      toast.success(isAr ? 'تم الحذف بنجاح' : 'User deleted successfully');
      fetchAdminUsers();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName) return;
    setIsSavingRole(true);
    try {
      const token = localStorage.getItem('sb_token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const url = editingRole ? `${apiUrl}/users/roles/${editingRole.id}` : `${apiUrl}/users/roles`;
      const method = editingRole ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          role_name: roleName,
          description: roleDescription,
          permissions: selectedPermissions
        })
      });
      const data = await res.json();
      let errorMessage = data.error;
      if (!errorMessage && data.errors) {
        errorMessage = Object.values(data.errors).flat().join(', ');
      }
      if (!res.ok) throw new Error(errorMessage || 'Failed to save role');
      toast.success(isAr ? 'تم حفظ الدور بنجاح' : 'Role saved successfully');
      setIsRoleModalOpen(false);
      setEditingRole(null);
      fetchRoles();
      fetchAdminUsers();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSavingRole(false);
    }
  };

  const handleDeleteRole = async (role: any) => {
    if (role.is_system) {
      toast.error(isAr ? 'لا يمكن حذف الأدوار الأساسية للنظام' : 'Cannot delete system roles');
      return;
    }
    const result = await Swal.fire({
      title: isAr ? 'هل أنت متأكد من حذف هذا الدور؟' : 'Delete role?',
      text: role.role_name,
      icon: 'warning',
      showCancelButton: true,
      background: '#111',
      color: '#fff',
      confirmButtonColor: '#d4183d',
      cancelButtonColor: '#333',
      confirmButtonText: isAr ? 'نعم، احذف' : 'Yes, delete',
      cancelButtonText: isAr ? 'إلغاء' : 'Cancel'
    });
    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem('sb_token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/users/roles/${role.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || 'Failed to delete role');
      }
      toast.success(isAr ? 'تم حذف الدور بنجاح' : 'Role deleted successfully');
      fetchRoles();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>, isMultiple = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingFile(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/upload`, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      
      if (isMultiple) {
        setter(prev => prev ? `${prev}, ${data.url}` : data.url);
      } else {
        setter(data.url);
      }
      toast.success(isAr ? 'تم رفع الصورة بنجاح' : 'Image uploaded successfully');
    } catch (err: any) {
      toast.error(isAr ? 'فشل رفع الصورة: ' + err.message : 'Upload failed: ' + err.message);
    } finally {
      setIsUploadingFile(false);
    }
  };

  // Logout handle
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
    toast.success(isAr ? 'تم تسجيل الخروج بنجاح' : 'Logged out successfully');
  };

  // Fetch Data
  useEffect(() => {
    fetchData();
    if (isSuperAdmin) {
      fetchAdminUsers();
      fetchRoles();
    }
  }, [isSuperAdmin]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [projectsRes, clientsRes, settingsRes, teamRes, messagesRes] = await Promise.all([
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('clients').select('*').order('created_at', { ascending: false }),
        supabase.from('site_settings').select('*').eq('id', 'global').single(),
        supabase.from('team').select('*').order('order_index', { ascending: true }),
        supabase.from('messages').select('*').order('created_at', { ascending: false })
      ]);

      if (projectsRes.error) throw projectsRes.error;

      setProjects(projectsRes.data || []);
      setClients(clientsRes.data || []);
      setSiteSettings(settingsRes.data || null);
      setTeamMembers(teamRes.data || []);
      setMessages(messagesRes.data || []);
    } catch (error: any) {
      toast.error('Error fetching data: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Action
  const toggleMessageRead = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      setMessages(messages.map(m => m.id === id ? { ...m, is_read: !currentStatus } : m));
      toast.success(isAr 
        ? (currentStatus ? 'تم التحديد كغير مقروء' : 'تم التحديد كمقروء') 
        : (currentStatus ? 'Marked as unread' : 'Marked as read')
      );
    } catch (error: any) {
      toast.error('Error: ' + error.message);
    }
  };

  const handleDelete = async (id: string, type: 'projects' | 'clients' | 'team' | 'messages') => {
    const result = await Swal.fire({
      title: isAr ? 'هل أنت متأكد؟' : 'Are you sure?',
      text: isAr ? 'لن تتمكن من التراجع عن هذا الإجراء!' : "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      background: '#111',
      color: '#fff',
      confirmButtonColor: '#9B8A5E',
      cancelButtonColor: '#333',
      confirmButtonText: isAr ? 'نعم، احذف!' : 'Yes, delete it!',
      cancelButtonText: isAr ? 'إلغاء' : 'Cancel',
      customClass: {
        popup: 'rounded-3xl border border-white/10'
      }
    });

    if (result.isConfirmed) {
      try {
        const { error } = await supabase.from(type).delete().eq('id', id);
        if (error) throw error;
        
        toast.success(isAr ? 'تم الحذف بنجاح' : 'Deleted successfully');
        fetchData();
        
        Swal.fire({
          title: isAr ? 'تم الحذف!' : 'Deleted!',
          text: isAr ? 'تمت إزالة العنصر بنجاح.' : 'The item has been removed.',
          icon: 'success',
          background: '#111',
          color: '#fff',
          confirmButtonColor: '#9B8A5E',
          customClass: {
            popup: 'rounded-3xl border border-white/10'
          }
        });
      } catch (error: any) {
        toast.error(isAr ? 'خطأ في الحذف: ' : 'Error deleting: ' + error.message);
      }
    }
  };

  // Save Action
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      let payload: any = {};
      let table = '';

      if (activeTab === 'projects') {
        table = 'projects';
        const vimeoUrl = formData.get('vimeo_url') as string;
        const vimeoId = extractVimeoIds(vimeoUrl);
        payload = {
          title: formData.get('title'),
          category: formData.get('category'),
          client_id: formData.get('client_id') || null,
          description: formData.get('description'),
          year: formData.get('year'),
          tags: (formData.get('tags') as string).split(',').map(t => t.trim()),
          vimeo_id: vimeoId,
          image_urls: (formData.get('image_urls') as string).split(',').map(u => u.trim()),
        };
      } else if (activeTab === 'clients') {
        table = 'clients';
        payload = {
          name: formData.get('name'),
          logo_url: formData.get('logo_url'),
          manager_name: formData.get('manager_name'),
          testimonial_text: formData.get('testimonial_text'),
          testimonial_role: formData.get('testimonial_role'),
        };
      } else if (activeTab === 'team') {
        table = 'team';
        payload = {
          name: formData.get('name'),
          role: formData.get('role'),
          category: formData.get('category'),
          image_url: formData.get('image_url'),
          order_index: parseInt(formData.get('order_index') as string) || 0,
        };
      }

      const { error } = editingItem 
        ? await supabase.from(table).update(payload).eq('id', editingItem.id)
        : await supabase.from(table).insert([payload]);

      if (error) throw error;

      toast.success(isAr ? 'تم الحفظ بنجاح' : 'Saved successfully');
      setIsModalOpen(false);
      setEditingItem(null);
      fetchData();
    } catch (error: any) {
      toast.error('Error saving: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    const vimeoUrl = formData.get('showreel_vimeo_url') as string;
    const vimeoId = extractVimeoIds(vimeoUrl) || vimeoUrl;
    const manualCount = parseInt(formData.get('manual_clients_count') as string) || 0;

    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ 
          showreel_vimeo_id: vimeoId,
          manual_clients_count: manualCount
        })
        .eq('id', 'global');

      if (error) throw error;
      toast.success(isAr ? 'تم تحديث الإعدادات' : 'Settings updated');
      fetchData();
    } catch (error: any) {
      toast.error('Error: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const extractVimeoIds = (input: string) => {
    if (!input) return null;
    const items = input.split(',').map(item => item.trim()).filter(Boolean);
    const processed = items.map(item => {
      // Vimeo check
      const vimeoMatch = item.match(/(vimeo\.com\/|video\/)(\d+)/);
      if (vimeoMatch) return vimeoMatch[2];
      
      // If it's a URL (Youtube, Drive, etc.), keep it as is
      if (item.includes('http') || item.includes('www.')) return item;
      
      // If it's just digits, assume it's an ID
      if (/^\d+$/.test(item)) return item;
      
      // Otherwise, return as is (could be a custom ID or new platform)
      return item;
    });
    return processed.length > 0 ? processed.join(',') : null;
  };

  return (
    <div className="h-screen w-screen bg-[#050505] text-white flex font-sans overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[140] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative z-[150] h-screen bg-black border-white/5 flex flex-col transition-all duration-500 ease-in-out shrink-0 select-none
        ${isSidebarOpen ? (isAr ? 'right-0' : 'left-0') : (isAr ? '-right-full lg:right-0' : '-left-full lg:left-0')}
        ${isSidebarCollapsed ? 'w-20' : 'w-72'}
        ${isAr ? 'border-l' : 'border-r'}
      `}>
        {/* Collapse Toggle Button (Desktop Only) */}
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className={`
            absolute top-10 hidden lg:flex w-8 h-8 bg-[#9B8A5E] items-center justify-center rounded-full text-black shadow-lg
            transition-all duration-500 z-50
            ${isAr 
              ? (isSidebarCollapsed ? '-left-4' : '-left-4 rotate-180') 
              : (isSidebarCollapsed ? '-right-4' : '-right-4 rotate-180')
            }
          `}
        >
          <ChevronLeft size={20} />
        </button>

        <div className={`flex flex-col h-full overflow-hidden ${isSidebarCollapsed ? 'px-4 py-6' : 'p-6 md:p-8'}`}>
          <div className={`flex items-center gap-4 mb-8 ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} shrink-0`}>
            <div className={`flex flex-col ${isSidebarCollapsed ? 'items-center' : 'items-start'} gap-2 overflow-hidden`}>
              <div className="w-20 h-12 flex items-center justify-center shrink-0">
                <img src={logo} alt="Active Media" className="w-full h-full object-contain" />
              </div>
              {!isSidebarCollapsed && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-1.5 mt-1">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#9B8A5E] font-medium whitespace-nowrap leading-none px-1">
                    {isAr ? 'لوحة التحكم' : 'Admin Control'}
                  </p>
                  <div className="flex items-center gap-1.5 bg-white/10 px-2 py-0.5 rounded-md w-fit border border-white/5">
                    <span className="text-[10px] font-bold text-white">
                      {currentUser?.role === 'SuperAdmin' 
                        ? '👑 SuperAdmin' 
                        : currentUser?.role === 'Editor'
                        ? '🛡️ Editor'
                        : `🛡️ ${currentUser?.role || 'Editor'}`}
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
            
            {!isSidebarCollapsed && (
              <button 
                onClick={toggleLanguage}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white/70 hover:text-white shrink-0"
              >
                <Languages size={18} />
              </button>
            )}
          </div>

          <nav className="space-y-2.5 flex-1 overflow-y-auto custom-scrollbar pr-1 my-2">
            {[
              { id: 'projects', icon: Briefcase, label: isAr ? 'المشاريع' : 'Projects', perm: 'projects_view' },
              { id: 'clients', icon: Users, label: isAr ? 'العملاء' : 'Clients', perm: 'clients_view' },
              { id: 'team', icon: Users, label: isAr ? 'الفريق' : 'Team', perm: 'team_view' },
              { id: 'messages', icon: Mail, label: isAr ? 'الرسائل' : 'Inquiries', perm: 'messages_view' },
              { id: 'roles', icon: Shield, label: isAr ? 'الصلاحيات' : 'Permissions', perm: 'users_manage' },
              { id: 'settings', icon: Settings, label: isAr ? 'الإعدادات' : 'Settings', perm: 'settings_manage' },
            ].filter(item => hasPermission(item.perm)).map((item) => (
              <button 
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`
                  w-full flex items-center rounded-2xl transition-all duration-300 group relative
                  ${activeTab === item.id ? 'bg-white text-black shadow-xl shadow-white/10 font-black' : 'hover:bg-white/5 text-white/60 hover:text-white'}
                  ${isSidebarCollapsed ? 'justify-center p-3.5' : 'gap-4 px-4 py-3.5'}
                `}
                title={isSidebarCollapsed ? item.label : ''}
              >
                <item.icon size={20} className="shrink-0" />
                {!isSidebarCollapsed && (
                  <span className="text-sm tracking-wide whitespace-nowrap">{item.label}</span>
                )}
                {isSidebarCollapsed && activeTab === item.id && (
                  <motion.div layoutId="activeDot" className={`absolute w-1.5 h-6 bg-[#9B8A5E] rounded-full ${isAr ? '-right-1' : '-left-1'}`} />
                )}
              </button>
            ))}
            
            {/* Language toggle for collapsed view */}
            {isSidebarCollapsed && (
              <button 
                onClick={toggleLanguage}
                className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white/70 hover:text-white mt-8 shrink-0"
                title={isAr ? 'English' : 'عربي'}
              >
                <Languages size={20} />
              </button>
            )}
          </nav>

          <div className={`pt-4 border-t border-white/5 shrink-0 ${isSidebarCollapsed ? 'mt-4' : 'mt-2'}`}>
            <button 
              onClick={handleLogout}
              className={`
                w-full flex items-center rounded-2xl text-red-500 hover:bg-red-500/10 transition-all font-bold text-sm tracking-wide
                ${isSidebarCollapsed ? 'justify-center p-3.5' : 'gap-4 px-4 py-3.5'}
              `}
              title={isSidebarCollapsed ? (isAr ? 'تسجيل الخروج' : 'Log Out') : ''}
            >
              <LogOut size={20} className="shrink-0" />
              {!isSidebarCollapsed && <span>{isAr ? 'تسجيل الخروج' : 'Log Out'}</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main ref={mainContentRef} className="flex-1 h-screen overflow-y-auto custom-scrollbar bg-[#050505] flex flex-col relative min-w-0">
        {/* Mobile Header Toggle */}
        <div className={`lg:hidden sticky top-0 z-[130] bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 p-4 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <img src={logo} alt="" className="h-8 w-auto" />
            <span className="font-bold text-lg tracking-tight">Active</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-3 bg-white/5 rounded-xl text-white/70"
          >
            <Menu size={24} />
          </button>
        </div>

        <div className="max-w-6xl mx-auto w-full p-6 md:p-12 lg:p-16">
          <header className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16`}>
            <div>
              <h1 className="text-5xl font-black mb-3 tracking-tighter">
                {activeTab === 'settings' ? (isAr ? 'إضافات الموقع' : 'Site Settings') : 
                 activeTab === 'roles' ? (isAr ? 'الصلاحيات والأدوار' : 'Roles & Permissions') :
                 activeTab === 'messages' ? (isAr ? 'رسائل العملاء' : 'Inquiries') : 
                 activeTab === 'projects' ? (isAr ? 'المشاريع' : 'Projects') :
                 activeTab === 'clients' ? (isAr ? 'العملاء' : 'Clients') :
                 (isAr ? 'فريق العمل' : 'Team Members')}
              </h1>
              <p className="text-white/40 text-lg font-light">
                {activeTab === 'settings' ? (isAr ? 'تعديل الإعدادات الأساسية للموقع' : 'Configure website core elements') : 
                 activeTab === 'roles' ? (isAr ? 'إنشاء وتخصيص الصلاحيات للمستخدمين' : 'Create and customize user permission roles') :
                 activeTab === 'messages' ? (isAr ? 'إدارة طلبات المشاريع الواردة' : 'Manage incoming project requests') : 
                 (isAr ? 'إدارة المحتوى والبيانات' : 'Manage your portfolio and clients')}
              </p>
            </div>
            {activeTab === 'roles' ? (
              hasPermission('users_manage') && (
                <button 
                  onClick={() => { setEditingRole(null); setRoleName(''); setRoleDescription(''); setSelectedPermissions([]); setIsRoleModalOpen(true); }}
                  className="flex items-center gap-3 bg-[#9B8A5E] hover:bg-[#B5A475] px-8 py-4 rounded-2xl text-sm font-black transition-all text-black shadow-lg shadow-[#9B8A5E]/20"
                >
                  <Plus size={20} />
                  {isAr ? 'إنشاء دور جديد' : 'Create New Role'}
                </button>
              )
            ) : ((activeTab === 'projects' && hasPermission('projects_edit')) ||
                 (activeTab === 'clients' && hasPermission('clients_edit')) ||
                 (activeTab === 'team' && hasPermission('team_edit'))) && (
              <button 
                onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
                className="flex items-center gap-3 bg-[#9B8A5E] hover:bg-[#B5A475] px-8 py-4 rounded-2xl text-sm font-black transition-all text-black shadow-lg shadow-[#9B8A5E]/20"
              >
                <Plus size={20} />
                {isAr ? 'إضافة ' : 'Add '}
                {activeTab === 'projects' ? (isAr ? 'مشروع' : 'Project') : 
                 activeTab === 'clients' ? (isAr ? 'عميل' : 'Client') : 
                 (isAr ? 'عضو' : 'Team Member')}
              </button>
            )}
          </header>

          {isLoading || isTabTransitioning ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center min-h-[400px] gap-6 my-12"
            >
              <div className="relative flex items-center justify-center">
                <div className="absolute w-28 h-28 rounded-full bg-[#9B8A5E]/20 animate-ping" />
                <div className="absolute w-20 h-20 rounded-full bg-[#9B8A5E]/10 animate-pulse" />
                <div className="w-20 h-20 rounded-3xl bg-white/5 border border-[#9B8A5E]/30 flex items-center justify-center backdrop-blur-xl shadow-2xl shadow-[#9B8A5E]/10 z-10">
                  <Loader2 className="animate-spin text-[#9B8A5E]" size={36} />
                </div>
              </div>
              <div className="text-center space-y-1 z-10">
                <h3 className="font-bold text-lg tracking-wider text-white">
                  {isAr ? 'جاري تحميل المحتوى...' : 'Loading Content...'}
                </h3>
                <p className="text-xs text-[#9B8A5E] tracking-widest uppercase">
                  {isAr ? 'نظام إدارة أكتيف ميديا' : 'Active Media Management System'}
                </p>
              </div>
            </motion.div>
          ) : activeTab === 'settings' ? (
            !hasPermission('settings_manage') ? (
              <div className="max-w-2xl mx-auto mt-12 bg-red-500/10 border border-red-500/20 rounded-3xl p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users size={32} />
                </div>
                <h2 className="text-2xl font-bold text-red-400">
                  {isAr ? 'صلاحيات غير كافية' : 'Access Denied'}
                </h2>
                <p className="text-white/70 leading-relaxed text-sm">
                  {isAr ? 'هذه الصفحة مخصصة للمشرف العام (SuperAdmin) فقط. لا تملك صلاحية الوصول لإدارة الإعدادات أو حسابات المسؤولين.' : 'This page is restricted to SuperAdmins. You do not have permission to modify settings or manage admin accounts.'}
                </p>
              </div>
            ) : (
              <div className="space-y-12 max-w-4xl pb-24 w-full">
                {/* Website Core Settings */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl"
                >
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#9B8A5E]">
                    <Video size={20} />
                    {isAr ? 'إعدادات الموقع الأساسية' : 'Website Core Settings'}
                  </h2>
                  <form onSubmit={handleSaveSettings} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/40 ml-1">{isAr ? 'رابط الفيديو (Showreel)' : 'Showreel Video URL / ID'}</label>
                        <input 
                          name="showreel_vimeo_url" 
                          defaultValue={siteSettings?.showreel_vimeo_id}
                          placeholder="e.g. https://vimeo.com/... or https://youtube.com/..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#9B8A5E] outline-none transition-all text-white" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/40 ml-1">{isAr ? 'عدد العملاء السعداء' : 'Happy Clients Count'}</label>
                        <input 
                          type="number"
                          name="manual_clients_count" 
                          defaultValue={siteSettings?.manual_clients_count}
                          placeholder="e.g. 50"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#9B8A5E] outline-none transition-all text-white" 
                        />
                      </div>
                    </div>
                    <button 
                      type="submit"
                      disabled={isSaving}
                      className="w-full md:w-auto px-8 bg-[#9B8A5E] hover:bg-[#B5A475] text-[#050505] font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#9B8A5E]/20"
                    >
                      {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                      {isAr ? 'حفظ الإعدادات' : 'Save Settings'}
                    </button>
                  </form>
                </motion.div>

                {/* Admin Accounts Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-8 shadow-xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                    <div>
                      <h2 className="text-xl font-bold text-[#9B8A5E] flex items-center gap-2">
                        <Users size={20} />
                        {isAr ? 'إدارة حسابات المسؤولين' : 'Admin Accounts Management'}
                      </h2>
                      <p className="text-white/40 text-sm mt-1">
                        {isAr ? 'قم بإضافة أو إزالة صلاحيات الدخول للوحة التحكم' : 'Manage dashboard login accounts and role access'}
                      </p>
                    </div>
                  </div>

                  {/* Create Admin Form */}
                  <form onSubmit={handleCreateAdmin} className="bg-black/40 border border-white/10 rounded-2xl p-6 space-y-6">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Plus size={16} className="text-[#9B8A5E]" />
                      {isAr ? 'إضافة مسؤول جديد' : 'Add New Admin Account'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-1">
                          {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                        </label>
                        <input 
                          type="email" 
                          required 
                          placeholder="admin@example.com" 
                          value={newAdminEmail} 
                          onChange={e => setNewAdminEmail(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#9B8A5E] outline-none text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-1">
                          {isAr ? 'كلمة المرور' : 'Password'}
                        </label>
                        <input 
                          type="password" 
                          required 
                          placeholder="••••••••" 
                          value={newAdminPassword} 
                          onChange={e => setNewAdminPassword(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#9B8A5E] outline-none text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-1">
                          {isAr ? 'نوع الصلاحية' : 'Role'}
                        </label>
                        <select 
                          value={newAdminRole} 
                          onChange={e => setNewAdminRole(e.target.value)}
                          className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#9B8A5E] outline-none text-white cursor-pointer h-[46px]"
                        >
                          {roles.map(r => (
                            <option key={r.id} value={r.role_name}>
                              {r.role_name} {r.role_name === 'SuperAdmin' ? '👑' : '🛡️'} - {r.description}
                            </option>
                          ))}
                          {roles.length === 0 && (
                            <>
                              <option value="Editor">{isAr ? 'محرر (Editor 🛡️)' : 'Editor 🛡️'}</option>
                              <option value="SuperAdmin">{isAr ? 'مشرف عام (SuperAdmin 👑)' : 'SuperAdmin 👑'}</option>
                            </>
                          )}
                        </select>
                      </div>
                    </div>
                    <button 
                      type="submit" 
                      disabled={isCreatingUser}
                      className="w-full md:w-auto px-8 py-3 bg-[#9B8A5E] hover:bg-[#B5A475] text-black font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-[#9B8A5E]/20"
                    >
                      {isCreatingUser ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                      {isAr ? 'إنشاء الحساب' : 'Create Account'}
                    </button>
                  </form>

                  {/* Admins List Table */}
                  <div className="overflow-hidden border border-white/10 rounded-2xl bg-black/20">
                    <div className="p-4 bg-white/5 border-b border-white/10 font-bold text-xs uppercase tracking-wider text-white/60 grid grid-cols-12 gap-4">
                      <div className="col-span-6">{isAr ? 'المستخدم' : 'User'}</div>
                      <div className="col-span-4">{isAr ? 'الصلاحية' : 'Role'}</div>
                      <div className="col-span-2 text-end">{isAr ? 'إجراء' : 'Action'}</div>
                    </div>
                    <div className="divide-y divide-white/5">
                      {adminUsers.map((usr: any) => (
                        <div key={usr.id} className="p-4 flex items-center grid grid-cols-12 gap-4 hover:bg-white/5 transition-colors text-sm">
                          <div className="col-span-6 font-medium text-white truncate flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-white/60 text-xs font-bold uppercase">
                              {usr.email[0]}
                            </div>
                            <span className="truncate">{usr.email}</span>
                            {usr.email === currentUser?.email && (
                              <span className="bg-[#9B8A5E]/20 text-[#9B8A5E] text-[10px] font-black px-2 py-0.5 rounded uppercase">
                                {isAr ? 'أنت' : 'You'}
                              </span>
                            )}
                          </div>
                          <div className="col-span-4 flex items-center">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              usr.role === 'SuperAdmin' 
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                                : usr.role === 'Editor'
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                : 'bg-[#9B8A5E]/20 text-[#9B8A5E] border border-[#9B8A5E]/30'
                            }`}>
                              {usr.role === 'SuperAdmin' ? '👑 SuperAdmin' : `🛡️ ${usr.role}`}
                            </span>
                          </div>
                          <div className="col-span-2 flex justify-end">
                            <button 
                              type="button"
                              onClick={() => handleDeleteAdmin(usr.id, usr.email)}
                              disabled={usr.email === currentUser?.email}
                              className="p-2 text-red-500/60 hover:text-red-500 hover:bg-red-500/20 rounded-lg transition-all disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-red-500/60"
                              title={isAr ? 'حذف الحساب' : 'Delete account'}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            )
          ) : activeTab === 'roles' ? (
            !hasPermission('users_manage') ? (
              <div className="max-w-2xl mx-auto mt-12 bg-red-500/10 border border-red-500/20 rounded-3xl p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield size={32} />
                </div>
                <h2 className="text-2xl font-bold text-red-400">
                  {isAr ? 'صلاحيات غير كافية' : 'Access Denied'}
                </h2>
                <p className="text-white/70 leading-relaxed text-sm">
                  {isAr ? 'هذه الصفحة مخصصة للمشرف العام (SuperAdmin) فقط. لا تملك صلاحية الوصول لإدارة الأدوار والصلاحيات.' : 'This page is restricted to SuperAdmins. You do not have permission to manage roles and permissions.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-24 w-full">
                {roles.map((role: any) => (
                  <motion.div 
                    key={role.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group hover:border-white/20 transition-all shadow-xl"
                  >
                    {role.is_system && (
                      <div className={`absolute top-0 w-1.5 h-full bg-[#9B8A5E] ${isAr ? 'right-0' : 'left-0'}`} />
                    )}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#9B8A5E]/10 border border-[#9B8A5E]/20 text-[#9B8A5E] flex items-center justify-center shrink-0">
                            <Shield size={24} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-2xl font-black text-white">{role.role_name}</h3>
                              <span className="text-lg">{role.role_name === 'SuperAdmin' ? '👑' : '🛡️'}</span>
                            </div>
                            {role.is_system && (
                              <span className="bg-[#9B8A5E]/20 text-[#9B8A5E] text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider inline-block mt-1">
                                {isAr ? 'أساسي في النظام' : 'System Role'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <p className="text-white/60 text-sm leading-relaxed min-h-[40px]">
                        {role.description || (isAr ? 'لا يوجد وصف' : 'No description provided')}
                      </p>

                      <div className="pt-4 border-t border-white/5 space-y-2">
                        <span className="text-[10px] uppercase tracking-widest text-white/40 block">
                          {isAr ? 'الصلاحيات الممنوحة:' : 'Granted Permissions:'}
                        </span>
                        <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1 custom-scrollbar">
                          {role.permissions?.includes('all') ? (
                            <span className="bg-[#9B8A5E] text-black text-xs font-black px-3 py-1 rounded-lg">
                              {isAr ? 'صلاحيات المشرف العام الكاملة (All Access)' : 'Full System Access (All)'}
                            </span>
                          ) : (
                            role.permissions?.map((p: string) => {
                              const found = PERMISSION_MODULES.flatMap(m => m.perms).find(x => x.id === p);
                              return (
                                <span key={p} className="bg-white/10 text-white/80 text-xs px-2.5 py-1 rounded-lg border border-white/5">
                                  {found ? found.label : p}
                                </span>
                              );
                            })
                          )}
                          {(!role.permissions || role.permissions.length === 0) && (
                            <span className="text-white/30 text-xs italic">{isAr ? 'لا توجد صلاحيات محددة' : 'No specific permissions'}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-6 mt-6 border-t border-white/5">
                      <button 
                        onClick={() => {
                          setEditingRole(role);
                          setRoleName(role.role_name);
                          setRoleDescription(role.description || '');
                          setSelectedPermissions(role.permissions || []);
                          setIsRoleModalOpen(true);
                        }}
                        className="p-3 hover:bg-white/10 rounded-xl text-white/60 hover:text-white transition-all flex items-center gap-2 text-xs font-bold"
                      >
                        <Edit2 size={16} />
                        {isAr ? 'تعديل' : 'Edit'}
                      </button>
                      {!role.is_system && (
                        <button 
                          onClick={() => handleDeleteRole(role)}
                          className="p-3 hover:bg-red-500/20 rounded-xl text-red-500/60 hover:text-red-500 transition-all flex items-center gap-2 text-xs font-bold"
                        >
                          <Trash2 size={16} />
                          {isAr ? 'حذف' : 'Delete'}
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {activeTab === 'projects' ? (
                projects.map(project => (
                  <motion.div 
                    key={project.id}
                    layoutId={project.id}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center gap-6 w-full md:w-auto">
                      <div className="w-24 h-16 bg-white/10 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                        {project.image_urls?.[0] ? (
                          <img src={project.image_urls[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Video className="text-white/20" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-1">
                          <h3 className="text-xl font-bold truncate">{project.title}</h3>
                          <span className="text-[10px] uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded text-white/60">
                            {project.category}
                          </span>
                        </div>
                        <p className="text-white/40 text-sm truncate">{project.year} • {clients.find(c => c.id === project.client_id)?.name || 'No Client'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto justify-end md:opacity-0 md:group-hover:opacity-100 transition-opacity pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                      {hasPermission('projects_edit') && (
                        <button 
                          onClick={() => { setEditingItem(project); setIsModalOpen(true); }}
                          className="p-3 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-all"
                        >
                          <Edit2 size={18} />
                        </button>
                      )}
                      {hasPermission('projects_delete') && (
                        <button 
                          onClick={() => handleDelete(project.id, 'projects')}
                          className="p-3 hover:bg-red-500/20 rounded-full text-red-500/60 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : activeTab === 'clients' ? (
                clients.map(client => (
                  <motion.div 
                    key={client.id}
                    layoutId={client.id}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center gap-6 w-full md:w-auto">
                      <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center overflow-hidden p-2 shrink-0">
                        {client.logo_url ? (
                          <img src={client.logo_url} alt="" className="w-full h-full object-contain" />
                        ) : (
                          <Users className="text-white/20" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold mb-1 truncate">{client.name}</h3>
                        <p className="text-white/40 text-sm truncate">{isAr ? 'المدير:' : 'Manager:'} {client.manager_name || 'Not specified'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto justify-end md:opacity-0 md:group-hover:opacity-100 transition-opacity pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                      {hasPermission('clients_edit') && (
                        <button 
                          onClick={() => { setEditingItem(client); setIsModalOpen(true); }}
                          className="p-3 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-all"
                        >
                          <Edit2 size={18} />
                        </button>
                      )}
                      {hasPermission('clients_delete') && (
                        <button 
                          onClick={() => handleDelete(client.id, 'clients')}
                          className="p-3 hover:bg-red-500/20 rounded-full text-red-500/60 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : activeTab === 'team' ? (
                teamMembers.map(member => (
                  <motion.div 
                    key={member.id}
                    layoutId={member.id}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center gap-6 w-full md:w-auto">
                      <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                        {member.image_url ? (
                          <img src={member.image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Users className="text-white/20" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-1">
                          <h3 className="text-xl font-bold truncate">{member.name}</h3>
                          <span className="text-[10px] uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded text-white/60">
                            {member.category}
                          </span>
                        </div>
                        <p className="text-white/40 text-sm truncate">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto justify-end md:opacity-0 md:group-hover:opacity-100 transition-opacity pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                      {hasPermission('team_edit') && (
                        <>
                          <button 
                            onClick={() => { setEditingItem(member); setIsModalOpen(true); }}
                            className="p-3 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-all"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(member.id, 'team')}
                            className="p-3 hover:bg-red-500/20 rounded-full text-red-500/60 hover:text-red-500 transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="space-y-6">
                  {/* Message Filters */}
                  <div className="flex bg-white/5 p-1 rounded-xl w-fit mb-8">
                    <button 
                      onClick={() => setMessageFilter('all')}
                      className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${messageFilter === 'all' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
                    >
                      {isAr ? 'الكل' : 'All'} ({messages.length})
                    </button>
                    <button 
                      onClick={() => setMessageFilter('unread')}
                      className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${messageFilter === 'unread' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
                    >
                      {isAr ? 'غير مقروء' : 'Unread'} ({messages.filter(m => !m.is_read).length})
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {messages
                      .filter(m => messageFilter === 'all' || !m.is_read)
                      .map(msg => (
                        <motion.div 
                          key={msg.id}
                          className={`bg-white/5 border rounded-2xl p-8 group transition-all relative overflow-hidden ${!msg.is_read ? 'border-[#9B8A5E]/50 bg-[#9B8A5E]/5' : 'border-white/10 hover:border-white/20'}`}
                        >
                          {!msg.is_read && (
                            <div className={`absolute top-0 w-1 h-full bg-[#9B8A5E] ${isAr ? 'right-0' : 'left-0'}`} />
                          )}
                          
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-6">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${!msg.is_read ? 'bg-[#9B8A5E] text-black shadow-[0_0_20px_rgba(155,138,94,0.4)]' : 'bg-white/10 text-white/40'}`}>
                                <Mail size={24} />
                              </div>
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-3">
                                  <h3 className="text-xl font-bold truncate">{msg.full_name}</h3>
                                  {!msg.is_read && (
                                    <span className="bg-[#9B8A5E] text-black text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter shrink-0">
                                      {isAr ? 'جديد' : 'New'}
                                    </span>
                                  )}
                                </div>
                                <p className="text-white/40 text-sm">{new Date(msg.created_at).toLocaleDateString(isAr ? 'ar-EG' : 'en-US')}</p>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                              <button 
                                onClick={() => toggleMessageRead(msg.id, msg.is_read)}
                                className={`p-3 rounded-full transition-all flex items-center gap-2 text-xs font-bold ${msg.is_read ? 'bg-white/10 text-white/40 hover:bg-white/20 text-white' : 'bg-[#9B8A5E] text-black hover:bg-[#B5A475]'}`}
                                title={msg.is_read ? (isAr ? 'تحديد كـ غير مقروء' : 'Mark as unread') : (isAr ? 'تحديد كـ مقروء' : 'Mark as read')}
                              >
                                <Check size={18} />
                                {msg.is_read ? (isAr ? 'مقروء' : 'Read') : (isAr ? 'تحديد كمقروء' : 'Mark as read')}
                              </button>
                              {hasPermission('messages_delete') && (
                                <button 
                                  onClick={() => handleDelete(msg.id, 'messages')}
                                  className="p-3 hover:bg-red-500/20 rounded-full text-red-500/60 hover:text-red-500 transition-all font-medium"
                                >
                                  <Trash2 size={18} />
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase tracking-widest text-[#9B8A5E]">
                                {isAr ? 'البريد الإلكتروني' : 'Email'}
                              </span>
                              <p className="text-sm font-medium">{msg.email}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase tracking-widest text-[#9B8A5E]">
                                {isAr ? 'رقم الهاتف' : 'Phone'}
                              </span>
                              <p className="text-sm font-medium">{msg.phone || (isAr ? 'غير متوفر' : 'N/A')}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase tracking-widest text-[#9B8A5E]">
                                {isAr ? 'الاهتمام' : 'Interest'}
                              </span>
                              <p className="text-sm font-medium">{msg.interest || (isAr ? 'غير محدد' : 'N/A')}</p>
                            </div>
                          </div>

                          {(msg.company || msg.title) && (
                            <div className="flex gap-4 mb-6 pt-4 border-t border-white/5">
                              {msg.company && (
                                <div className="bg-white/5 px-4 py-2 rounded-lg text-xs border border-white/5">
                                  <span className="text-white/40 mr-2">{isAr ? 'الشركة:' : 'Company:'}</span>
                                  {msg.company}
                                </div>
                              )}
                              {msg.title && (
                                <div className="bg-white/5 px-4 py-2 rounded-lg text-xs border border-white/5">
                                  <span className="text-white/40 mr-2">{isAr ? 'المسمى:' : 'Role:'}</span>
                                  {msg.title}
                                </div>
                              )}
                            </div>
                          )}

                          <div className={`rounded-xl p-4 border ${!msg.is_read ? 'bg-black/40 border-[#9B8A5E]/20' : 'bg-black/20 border-white/5'}`}>
                            <span className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">
                              {isAr ? 'تفاصيل المشروع' : 'Project Details'}
                            </span>
                            <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">{msg.project_details || (isAr ? 'لا توجد تفاصيل' : 'No details specified.')}</p>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              )}

              {((activeTab === 'projects' && projects.length === 0) || 
                (activeTab === 'clients' && clients.length === 0) || 
                (activeTab === 'team' && teamMembers.length === 0) ||
                (activeTab === 'messages' && messages.length === 0)) && (
                <div className="text-center py-24 bg-white/5 rounded-3xl border border-dashed border-white/10">
                  <p className="text-white/20">{isAr ? 'لا توجد بيانات حالياً' : 'No items found.'}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl max-h-[90vh] bg-[#161616] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Header (Fixed at top) */}
              <div className="p-6 md:px-8 md:py-6 border-b border-white/10 flex justify-between items-center shrink-0 bg-[#161616] z-10">
                <h2 className="text-2xl font-bold">
                  {editingItem ? (isAr ? 'تعديل ' : 'Edit ') : (isAr ? 'إضافة ' : 'Add ')}
                  {activeTab === 'projects' ? (isAr ? 'مشروع' : 'Project') : 
                   activeTab === 'clients' ? (isAr ? 'عميل' : 'Client') : 
                   (isAr ? 'عضو فريق' : 'Team Member')}
                </h2>
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex flex-col overflow-hidden flex-1">
                {/* Scrollable Body */}
                <div className="overflow-y-auto p-6 md:p-8 space-y-6 flex-1 custom-scrollbar">
                  {activeTab === 'team' ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-widest text-white/40 ml-1">
                            {isAr ? 'اسم العضو' : 'Member Name'}
                          </label>
                          <input required name="name" defaultValue={editingItem?.name} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#9B8A5E] outline-none transition-all text-white" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-widest text-white/40 ml-1">
                            {isAr ? 'الدور الوظيفي' : 'Official Role'}
                          </label>
                          <input required name="role" defaultValue={editingItem?.role} placeholder="CEO, Producer, Designer..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#9B8A5E] outline-none transition-all text-white" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-widest text-white/40 ml-1">
                            {isAr ? 'التصنيف' : 'Category'}
                          </label>
                          <select name="category" defaultValue={editingItem?.category || 'Creative'} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#9B8A5E] outline-none transition-all appearance-none text-white [&>option]:bg-[#1A1A1A]">
                            <option value="Co-founder">{isAr ? 'مؤسس مشارك' : 'Co-founder'}</option>
                            <option value="Leadership">{isAr ? 'إدارة' : 'Leadership'}</option>
                            <option value="Creative">{isAr ? 'الفريق الإبداعي' : 'Creative Team'}</option>
                            <option value="Production">{isAr ? 'فريق الإنتاج' : 'Production Team'}</option>
                            <option value="Agency">{isAr ? 'فريق الوكالة' : 'Agency Team'}</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-widest text-white/40 ml-1">
                            {isAr ? 'ترتيب الظهور' : 'Order Index'}
                          </label>
                          <input type="number" name="order_index" defaultValue={editingItem?.order_index || 0} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#9B8A5E] outline-none transition-all text-white" />
                        </div>
                      </div>

                      {/* Standalone Full-Width Image Section with Live Preview */}
                      <div className="space-y-3 bg-white/5 p-6 rounded-2xl border border-white/10 shadow-inner">
                        <label className="text-xs uppercase tracking-widest text-[#9B8A5E] font-black block">
                          {isAr ? 'الصورة الشخصية (Profile Image)' : 'Profile Image'}
                        </label>
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                          <div className="w-24 h-24 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
                            {uploadedMemberUrl ? (
                              <img src={uploadedMemberUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                              <Users className="text-white/20" size={32} />
                            )}
                          </div>
                          <div className="space-y-2 flex-1 w-full">
                            <div className="flex flex-col sm:flex-row gap-3">
                              <input 
                                name="image_url" 
                                value={uploadedMemberUrl} 
                                onChange={e => setUploadedMemberUrl(e.target.value)} 
                                placeholder="https://..." 
                                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#9B8A5E] outline-none transition-all text-white font-mono" 
                              />
                              <label className="cursor-pointer bg-[#9B8A5E] text-black px-6 py-3 rounded-xl flex items-center justify-center gap-2 shrink-0 font-black hover:bg-[#B5A475] transition-all shadow-lg shadow-[#9B8A5E]/20">
                                <input type="file" accept="image/*" onChange={e => handleFileUpload(e, setUploadedMemberUrl)} className="hidden" />
                                {isUploadingFile ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                                <span>{isAr ? 'رفع ملف' : 'Upload'}</span>
                              </label>
                            </div>
                            <p className="text-xs text-white/40 italic">
                              {isAr ? 'يمكنك اختيار ملف من جهازك أو كتابة رابط خارجي مباشرة' : 'Upload a file or paste an image link directly'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : activeTab === 'clients' ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-widest text-white/40 ml-1">
                            {isAr ? 'اسم الشركة' : 'Company Name'}
                          </label>
                          <input required name="name" defaultValue={editingItem?.name} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#9B8A5E] outline-none transition-all text-white" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-widest text-white/40 ml-1">
                            {isAr ? 'اسم المدير' : 'Manager Name'}
                          </label>
                          <input name="manager_name" defaultValue={editingItem?.manager_name} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#9B8A5E] outline-none transition-all text-white" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-widest text-white/40 ml-1">
                            {isAr ? 'دور المدير (للتقييم)' : 'Manager Role'}
                          </label>
                          <input name="testimonial_role" defaultValue={editingItem?.testimonial_role} placeholder="CEO, Marketing Manager..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#9B8A5E] outline-none transition-all text-white" />
                        </div>
                      </div>

                      {/* Standalone Full-Width Logo Section with Live Preview */}
                      <div className="space-y-3 bg-white/5 p-6 rounded-2xl border border-white/10 shadow-inner">
                        <label className="text-xs uppercase tracking-widest text-[#9B8A5E] font-black block">
                          {isAr ? 'شعار الشركة (Company Logo)' : 'Company Logo'}
                        </label>
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                          <div className="w-24 h-24 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 p-2 shadow-lg">
                            {uploadedLogoUrl ? (
                              <img src={uploadedLogoUrl} alt="Preview" className="w-full h-full object-contain" />
                            ) : (
                              <Users className="text-white/20" size={32} />
                            )}
                          </div>
                          <div className="space-y-2 flex-1 w-full">
                            <div className="flex flex-col sm:flex-row gap-3">
                              <input 
                                name="logo_url" 
                                value={uploadedLogoUrl} 
                                onChange={e => setUploadedLogoUrl(e.target.value)} 
                                placeholder="https://..." 
                                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#9B8A5E] outline-none transition-all text-white font-mono" 
                              />
                              <label className="cursor-pointer bg-[#9B8A5E] text-black px-6 py-3 rounded-xl flex items-center justify-center gap-2 shrink-0 font-black hover:bg-[#B5A475] transition-all shadow-lg shadow-[#9B8A5E]/20">
                                <input type="file" accept="image/*" onChange={e => handleFileUpload(e, setUploadedLogoUrl)} className="hidden" />
                                {isUploadingFile ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                                <span>{isAr ? 'رفع ملف' : 'Upload'}</span>
                              </label>
                            </div>
                            <p className="text-xs text-white/40 italic">
                              {isAr ? 'يمكنك اختيار ملف من جهازك أو كتابة رابط خارجي مباشرة' : 'Upload a file or paste an image link directly'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/40 ml-1">
                          {isAr ? 'تقييم العميل' : 'Testimonial'}
                        </label>
                        <textarea name="testimonial_text" defaultValue={editingItem?.testimonial_text} rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#9B8A5E] outline-none transition-all resize-none text-white" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-widest text-white/40 ml-1">
                            {isAr ? 'عنوان المشروع' : 'Project Title'}
                          </label>
                          <input required name="title" defaultValue={editingItem?.title} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#9B8A5E] outline-none transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-widest text-white/40 ml-1">
                            {isAr ? 'التصنيف' : 'Category'}
                          </label>
                          <input
                            required
                            name="category"
                            defaultValue={editingItem?.category || ''}
                            placeholder={isAr ? 'مثال: Video, Photography, Branding...' : 'e.g. Video, Photography, Branding...'}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#9B8A5E] outline-none transition-all"
                          />
                          <p className="text-[10px] text-white/20 italic">
                            {isAr ? 'اكتب أي تصنيف وسيظهر تلقائياً في فلتر المعرض' : 'Type any category — appears automatically in portfolio filter'}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-widest text-white/40 ml-1">
                            {isAr ? 'العميل' : 'Client'}
                          </label>
                          <select name="client_id" defaultValue={editingItem?.client_id || ''} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#9B8A5E] outline-none transition-all appearance-none text-white [&>option]:bg-[#1A1A1A]">
                            <option value="">{isAr ? 'بدون عميل' : 'No Client'}</option>
                            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-widest text-white/40 ml-1">
                            {isAr ? 'السنة' : 'Year'}
                          </label>
                          <input name="year" defaultValue={editingItem?.year || new Date().getFullYear().toString()} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#9B8A5E] outline-none transition-all" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/40 ml-1">
                          {isAr ? 'الوصف' : 'Description'}
                        </label>
                        <textarea name="description" defaultValue={editingItem?.description} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#9B8A5E] outline-none transition-all resize-none" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-widest text-[#9B8A5E] font-bold ml-1">
                            {isAr ? 'رابط الفيديو (YouTube, Vimeo, Drive...)' : 'Video URL / ID (YouTube, Vimeo, Drive...)'}
                          </label>
                          <input name="vimeo_url" defaultValue={editingItem?.vimeo_id} placeholder="e.g. https://youtube.com/watch?v=... or 123456789" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#9B8A5E] outline-none transition-all" />
                          <p className="text-[10px] text-white/20 italic">{isAr ? 'يدعم يوتيوب، فينمو، جوجل درايف، فيسبوك، وانستجرام' : 'Supports YouTube, Vimeo, Google Drive, Facebook, and Instagram'}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-widest text-white/40 ml-1">
                            {isAr ? 'كلمات دلالية (Tags)' : 'Tags / Services'}
                          </label>
                          <input name="tags" defaultValue={editingItem?.tags?.join(', ')} placeholder="Video, Editing, 4K..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#9B8A5E] outline-none transition-all" />
                        </div>
                      </div>

                      {/* Standalone Full-Width Project Images Gallery & Upload */}
                      <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10 shadow-inner">
                        <label className="text-xs uppercase tracking-widest text-[#9B8A5E] font-black block">
                          {isAr ? 'صور المشروع (الصورة الأولى هي الغلاف)' : 'Project Images (First is Cover Image)'}
                        </label>

                        {/* Live Preview Thumbnails */}
                        {uploadedProjectUrls && uploadedProjectUrls.trim().length > 0 && (
                          <div className="flex flex-wrap gap-3 py-2 bg-black/40 p-3 rounded-xl border border-white/5">
                            {uploadedProjectUrls.split(',').map(u => u.trim()).filter(Boolean).map((url, i) => (
                              <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden bg-black/60 border border-white/10 group shadow-md shrink-0">
                                <img src={url} alt="" className="w-full h-full object-cover" />
                                <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] text-[#9B8A5E] px-1.5 py-0.5 rounded font-mono font-bold">#{i + 1}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 items-start">
                          <textarea 
                            name="image_urls" 
                            value={uploadedProjectUrls} 
                            onChange={e => setUploadedProjectUrls(e.target.value)}
                            placeholder="https://image1.jpg, https://image2.jpg..." 
                            className="flex-1 w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#9B8A5E] outline-none transition-all h-24 font-mono leading-relaxed text-white resize-none" 
                          />
                          <label className="cursor-pointer bg-[#9B8A5E] text-black px-6 py-4 rounded-xl flex items-center justify-center gap-2 shrink-0 font-black hover:bg-[#B5A475] transition-all shadow-lg shadow-[#9B8A5E]/20 sm:h-24 w-full sm:w-auto">
                            <input type="file" accept="image/*" onChange={e => handleFileUpload(e, setUploadedProjectUrls, true)} className="hidden" />
                            {isUploadingFile ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                            <span>{isAr ? 'رفع صورة' : 'Upload Image'}</span>
                          </label>
                        </div>
                        <p className="text-xs text-white/40 italic">
                          {isAr ? 'يمكنك رفع أكثر من صورة تباعاً، وسيتم إضافتها تلقائياً إلى القائمة مفصولة بفاصلة' : 'Upload multiple images sequentially or paste URLs separated by commas'}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Fixed Footer */}
                <div className="p-6 md:px-8 md:py-6 border-t border-white/10 bg-[#1a1a1a] flex gap-4 shrink-0 items-center justify-end">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="px-8 py-4 bg-white/5 hover:bg-white/10 rounded-xl font-medium transition-all order-1 sm:order-none text-white"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="flex-1 sm:flex-initial sm:min-w-[200px] bg-[#9B8A5E] hover:bg-[#B5A475] text-black font-extrabold py-4 px-8 rounded-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#9B8A5E]/20"
                  >
                    {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    {editingItem ? (isAr ? 'حفظ التعديلات' : 'Save Changes') : (isAr ? 'إنشاء' : 'Create')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Role Modal */}
      <AnimatePresence>
        {isRoleModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0f0f0f] border border-white/10 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
              dir={isAr ? 'rtl' : 'ltr'}
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/40 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#9B8A5E]/10 border border-[#9B8A5E]/20 text-[#9B8A5E] flex items-center justify-center">
                    <Shield size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-[#9B8A5E]">
                    {editingRole ? (isAr ? 'تعديل الدور' : 'Edit Role') : (isAr ? 'إنشاء دور جديد' : 'Create New Role')}
                  </h3>
                </div>
                <button 
                  onClick={() => setIsRoleModalOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-all text-white/60 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <form id="roleForm" onSubmit={handleSaveRole} className="p-8 overflow-y-auto custom-scrollbar space-y-8 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/40 ml-1">{isAr ? 'اسم الدور (Role Name)' : 'Role Name'}</label>
                    <input 
                      required 
                      value={roleName}
                      disabled={editingRole?.is_system && editingRole?.role_name === 'SuperAdmin'}
                      onChange={e => setRoleName(e.target.value)}
                      placeholder={isAr ? 'مثال: مدير المحتوى' : 'e.g. Content Manager'}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#9B8A5E] outline-none text-white disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/40 ml-1">{isAr ? 'وصف الدور (Description)' : 'Description'}</label>
                    <input 
                      value={roleDescription}
                      onChange={e => setRoleDescription(e.target.value)}
                      placeholder={isAr ? 'صلاحيات مخصصة لإدارة المشاريع والعملاء' : 'Custom permissions for managing projects'}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#9B8A5E] outline-none text-white"
                    />
                  </div>
                </div>

                <div className="space-y-6 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-lg text-white">{isAr ? 'تخصيص الصلاحيات' : 'Customize Permissions'}</h4>
                      <p className="text-xs text-white/40">{isAr ? 'حدد الصلاحيات المسموح بها لهذا الدور' : 'Select the allowed permissions for this role'}</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        const allPerms = PERMISSION_MODULES.flatMap(m => m.perms).map(p => p.id);
                        if (selectedPermissions.length === allPerms.length) {
                          setSelectedPermissions([]);
                        } else {
                          setSelectedPermissions(allPerms);
                        }
                      }}
                      className="text-xs font-bold text-[#9B8A5E] hover:underline px-3 py-1.5 rounded-lg bg-[#9B8A5E]/10"
                    >
                      {isAr ? 'تحديد الكل / إلغاء الكل' : 'Select / Deselect All'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {PERMISSION_MODULES.map(mod => (
                      <div key={mod.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                        <h5 className="font-bold text-sm text-[#9B8A5E] border-b border-white/10 pb-2">{mod.label}</h5>
                        <div className="space-y-3">
                          {mod.perms.map(p => {
                            const isChecked = selectedPermissions.includes(p.id) || selectedPermissions.includes('all');
                            return (
                              <label key={p.id} className="flex items-center gap-3 cursor-pointer group text-sm">
                                <div 
                                  onClick={() => {
                                    if (selectedPermissions.includes('all') && p.id !== 'all') return;
                                    if (p.id === 'all') {
                                      setSelectedPermissions(selectedPermissions.includes('all') ? [] : ['all']);
                                    } else {
                                      setSelectedPermissions(
                                        selectedPermissions.includes(p.id)
                                          ? selectedPermissions.filter(x => x !== p.id)
                                          : [...selectedPermissions, p.id]
                                      );
                                    }
                                  }}
                                  className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${isChecked ? 'bg-[#9B8A5E] text-black font-black' : 'bg-white/10 border border-white/20 text-transparent'}`}
                                >
                                  ✓
                                </div>
                                <span className={`transition-colors ${isChecked ? 'text-white font-medium' : 'text-white/60 group-hover:text-white'}`}>{p.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </form>

              {/* Footer */}
              <div className="p-6 border-t border-white/10 bg-black/40 flex justify-end gap-4 shrink-0">
                <button 
                  type="button" 
                  onClick={() => setIsRoleModalOpen(false)}
                  className="px-6 py-3 rounded-xl hover:bg-white/10 font-bold transition-all text-sm text-white"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button 
                  type="submit" 
                  form="roleForm" 
                  disabled={isSavingRole}
                  className="px-8 py-3 bg-[#9B8A5E] hover:bg-[#B5A475] text-black font-extrabold rounded-xl transition-all flex items-center gap-2 text-sm shadow-lg shadow-[#9B8A5E]/20"
                >
                  {isSavingRole ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  {isAr ? 'حفظ الصلاحيات' : 'Save Permissions'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
