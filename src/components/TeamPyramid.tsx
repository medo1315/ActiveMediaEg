import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { supabase } from '../lib/supabase';

export function TeamPyramid() {
  const { language } = useLanguage();
  const [dynamicMembers, setDynamicMembers] = useState<any[]>([]);
  const isAr = language === 'ar';
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('team')
          .select('*')
          .order('order_index', { ascending: true });
        if (error) throw error;
        setDynamicMembers(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeam();
  }, []);

  // Helper to translate categories based on active language
  const getCategoryTitle = (catName: string, isArabic: boolean) => {
    const key = catName.toLowerCase().trim();
    if (key === 'co-founder') return isArabic ? 'مؤسس مشارك' : 'Co-founder';
    if (key === 'leadership') return isArabic ? 'الإدارة' : 'Leadership';
    if (key === 'creative' || key === 'creative team') return isArabic ? 'الفريق الإبداعي' : 'Creative Team';
    if (key === 'production' || key === 'production team') return isArabic ? 'فريق الإنتاج' : 'Production Team';
    if (key === 'agency' || key === 'agency team') return isArabic ? 'فريق الوكالة' : 'Agency Team';
    return catName;
  };

  // Dynamic categorization based on the 'category' field from the database
  const getCategorizedData = (members: any[]) => {
    // 1. Top Tier: Co-founders
    const leader = members.filter(m => m.category === 'Co-founder');

    // 2. Middle Tier: Leadership
    const board = members.filter(m => m.category === 'Leadership');

    // 3. Sectioned Teams: Creative, Production, Agency, etc.
    const remaining = members.filter(m => m.category !== 'Co-founder' && m.category !== 'Leadership');
    
    const groups: { [key: string]: any[] } = {};
    remaining.forEach(member => {
      let cat = member.category?.trim() || "";
      let catKey = "";
      
      if (cat.toLowerCase() === 'creative') catKey = 'Creative Team';
      else if (cat.toLowerCase() === 'production') catKey = 'Production Team';
      else if (cat.toLowerCase() === 'agency') catKey = 'Agency Team';
      else if (cat) catKey = cat;
      else catKey = isAr ? 'أعضاء الفريق' : 'Team Members';
      
      if (!groups[catKey]) groups[catKey] = [];
      groups[catKey].push(member);
    });

    // Sort categories to maintain order: Creative -> Production -> Agency -> Others
    const order = ['Creative Team', 'Production Team', 'Agency Team'];
    const sortedGroups = Object.entries(groups).sort(([a], [b]) => {
      const indexA = order.indexOf(a);
      const indexB = order.indexOf(b);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.localeCompare(b);
    });

    return { 
      leader, 
      board, 
      categoryGroups: sortedGroups 
    };
  };

  const { leader, board, categoryGroups } = getCategorizedData(dynamicMembers);

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="w-full flex flex-col items-center mb-16 mt-28">
      <h3 className="text-xl md:text-3xl font-bold text-white mb-6 uppercase tracking-[0.3em] text-center px-4">
        {getCategoryTitle(title, isAr)}
      </h3>
      <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#9B8A5E]/60 to-transparent" />
    </div>
  );

  const MemberCard = ({
    member,
    index,
    isLeader = false,
    isBoard = false,
  }: {
    member: any;
    index: number;
    isLeader?: boolean;
    isBoard?: boolean;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: (index % 4) * 0.1 }}
      className="flex flex-col items-center group w-full"
    >
      <div
        className={`relative overflow-hidden bg-[#0A0A0A] shadow-2xl mb-6 transition-all duration-700 hover:shadow-[#9B8A5E]/20 ${
          isLeader
            ? 'w-44 h-44 md:w-64 md:h-64 rounded-full border-2 border-[#9B8A5E]/40 p-2'
            : isBoard 
            ? 'w-32 h-32 md:w-44 md:h-44 rounded-full border border-white/10 p-1.5'
            : 'w-24 h-24 md:w-36 md:h-36 rounded-full border border-white/5 p-1'
        }`}
      >
        <div className="w-full h-full rounded-full overflow-hidden relative">
          <ImageWithFallback
            src={member.image_url}
            alt={member.name}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </div>

      <div className="text-center px-2 space-y-2">
        <h3 className={`text-white font-bold leading-tight tracking-wide transition-colors duration-300 group-hover:text-[#9B8A5E] ${
          isLeader ? 'text-xl md:text-2xl' : 'text-sm md:text-base'
        }`}>
          {member.name}
        </h3>
        <p className={`text-[#9B8A5E]/80 font-bold uppercase tracking-[0.15em] ${
          isLeader ? 'text-[10px] md:text-xs' : 'text-[8px] md:text-[9px]'
        }`}>
          {member.role}
        </p>
      </div>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#9B8A5E]" size={48} />
      </div>
    );
  }

  if (dynamicMembers.length === 0) {
    return (
      <div className="container mx-auto px-6 py-32 text-center">
        <div className="inline-block px-12 py-16 border border-white/5 bg-white/[0.02] rounded-[40px] backdrop-blur-sm">
          <p className="text-white/30 font-bold tracking-[0.3em] uppercase text-sm">
            {isAr ? 'لا يوجد أعضاء في الفريق حالياً' : 'No team members added yet'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 pb-40">
      <div className="flex flex-col items-center">
        {/* Tier 1: Co-founder (The Top Boss) */}
        {leader.length > 0 && (
          <div className="mb-32 flex flex-col items-center">
            {leader.map((m, i) => (
              <MemberCard key={m.id} member={m} index={i} isLeader />
            ))}
          </div>
        )}

        {/* Tier 2: Leadership / Board */}
        {board.length > 0 && (
          <div className="w-full mb-32">
            <SectionHeader title={isAr ? 'الإدارة' : 'Leadership'} />
            <div className="flex flex-wrap justify-center gap-10 md:gap-20 lg:gap-32 px-4">
              {board.map((m, i) => (
                <div key={m.id} className="w-40 md:w-56 flex justify-center">
                  <MemberCard member={m} index={i + 1} isBoard />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Category Sections: Creative Team, Production Team, etc. */}
        {categoryGroups.map(([categoryName, members], groupIndex) => (
          <div key={categoryName} className="w-full mb-32">
            <SectionHeader title={categoryName} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 md:gap-x-12 gap-y-20 lg:gap-y-24 max-w-7xl mx-auto px-4">
              {members.map((m, i) => (
                <MemberCard 
                  key={m.id} 
                  member={m} 
                  index={i + groupIndex * 10} 
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
