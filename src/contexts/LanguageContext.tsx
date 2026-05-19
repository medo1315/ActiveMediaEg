import { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<'ar' | 'en', Record<string, string>> = {
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.philosophy': 'الفلسفة',
    'nav.clients': 'العملاء',
    'nav.portfolio': 'الأعمال',
    'nav.services': 'الخدمات',
    'nav.team': 'الفريق',
    'nav.contact': 'اتصل بنا',

    // Hero Section
    'hero.title1': '',
    'hero.title2': 'Since 2018',
    'hero.description': '',
    'hero.cta': '',

    // Showreel Section
    'showreel.label': 'Showreel',
    'showreel.title': 'رحلتنا المرئية',
    'showreel.description': 'استمتع بمشاهدة أبرز أعمالنا في دقائق معدودة',
    'showreel.stat1': 'مشروع مكتمل',
    'showreel.stat2': 'عميل سعيد',
    'showreel.stat3': 'سنوات خبرة',
    'showreel.stat4': 'جائزة دولية',

    // Services Section
    'services.label': 'خدماتنا',
    'services.title': 'الخدمات',
    'services.subtitle': 'خدمات إعلانية شاملة',
    'services.description': 'نقدم مجموعة متكاملة من خدمات الإنتاج المرئي بأعلى معايير الجودة',

    // Service Category Descriptions (AR)
    'services.cat1.desc': 'نقدم إنتاجاً إبداعياً احترافياً من الفكرة حتى التسليم — فيديوهات إعلانية، تصوير منتجات، محتوى سوشيال ميديا، تغطية فعاليات، ومونتاج احترافي يحكي قصتك بأفضل شكل.',
    'services.cat2.desc': 'نبني هويات بصرية متكاملة تعكس روح علامتك التجارية — من تصميم الشعار والهوية الكاملة إلى بروفايل الشركة والتصاميم التسويقية على جميع المنصات.',
    'services.cat3.desc': 'ندير حضورك الرقمي بالكامل — إدارة سوشيال ميديا، إنشاء محتوى وكوبي رايتنج، تحسين محركات البحث SEO، واستراتيجية تسويقية متكاملة لتحقيق أهدافك.',
    'services.cat4.desc': 'نحقق لك أقصى عائد على إنفاقك الإعلاني — إعلانات ميتا وجوجل وتيك توك، مع تحسين مستمر للحملات وتقارير تفصيلية شفافة.',

    // Service Category Items (AR)
    'services.cat1.title': 'الإنتاج الإبداعي والفيديو',
    'services.cat1.items': 'فيديوهات إعلانية وتجارية|تصوير المنتجات والفيديو|محتوى السوشيال ميديا (ريلز / قصير)|تغطية الفعاليات|مونتاج وما بعد الإنتاج',
    'services.cat2.title': 'الهوية البصرية والتصميم الجرافيكي',
    'services.cat2.items': 'تصميم الهوية التجارية|تصميم الشعار|تصميم بروفايل الشركة|تصاميم التسويق والسوشيال ميديا',
    'services.cat3.title': 'التسويق الرقمي',
    'services.cat3.items': 'إدارة السوشيال ميديا|إنشاء المحتوى والكوبي رايتنج|تحسين محركات البحث (SEO)|استراتيجية التسويق',
    'services.cat4.title': 'شراء الميديا والتسويق الأدائي',
    'services.cat4.items': 'إعلانات ميتا (فيسبوك وإنستغرام)|إعلانات جوجل|إعلانات تيك توك|تحسين الحملات وإعداد التقارير',

    // Legacy service keys (kept for other references)
    'services.branding': 'الهوية البصرية',
    'services.catalogs': 'الكتالوجات وبروفايلات الشركات',
    'services.animation': 'الرسوم المتحركة والموشن جرافيك',
    'services.webapp': 'تطبيقات الويب والجوال',
    'services.social': 'وسائل التواصل الاجتماعي',
    'services.photography': 'التصوير الفوتوغرافي والفيديو',
    'services.booths': 'أجنحة المعارض والمنصات',
    'services.giveaways': 'الهدايا الدعائية والإنتاج',
    'services.food': 'إنتاج فيديوهات الأطعمة والمشروبات',
    'services.industrial': 'الوثائقيات الصناعية',
    'services.packaging': 'خدمات تصميم التغليف',
    'services.events': 'تغطية الفعاليات وإنتاج الفيديو',

    'services.detail.premium': 'الخدمة المميزة',
    'services.detail.whatWeOffer': 'ماذا نقدم:',
    'services.detail.requestNow': 'اطلب الخدمة الآن',

    // Branding Features
    'services.branding.f1': 'تصميم الشعار',
    'services.branding.f2': 'استراتيجية العلامة التجارية',
    'services.branding.f3': 'الخطوط ولوحة الألوان',
    'services.branding.f4': 'أنظمة الهوية البصرية',
    'services.branding.f5': 'دليل الهوية التجارية',

    // Catalogs Features
    'services.catalogs.f1': 'بروفايلات الشركات',
    'services.catalogs.f2': 'كتالوجات المنتجات',
    'services.catalogs.f3': 'التقارير السنوية',
    'services.catalogs.f4': 'عروض المبيعات',
    'services.catalogs.f5': 'المجلات الرقمية',

    // Animation Features
    'services.animation.f1': 'رسوم متحركة 2D/3D',
    'services.animation.f2': 'موشن جرافيك',
    'services.animation.f3': 'فيديوهات توضيحية',
    'services.animation.f4': 'تحريك الشعارات',
    'services.animation.f5': 'تصميم الشخصيات',

    'services.items.video.title': 'إنتاج الفيديو',
    'services.items.video.description': 'إنتاج فيديو احترافي من البداية للنهاية مع تركيز على الجودة والإبداع',
    'services.items.photography.title': 'التصوير الفوتوغرافي',
    'services.items.photography.description': 'تصوير احترافي يبرز جمال منتجاتك وعلامتك التجارية',
    'services.motion': 'الهوية البصرية والتصمم',


    'services.editing': 'المونتاج',
    'services.editingDesc': 'مونتاج احترافي يحكي قصتك بأفضل شكل',
    'services.items.design.title': 'التصميم الجرافيكي',
    'services.items.design.description': 'تصميمات إبداعية تعكس هوية علامتك التجارية بشكل مميز',
    'services.items.creative.title': 'التوجيه الإبداعي',
    'services.items.creative.description': 'إدارة إبداعية شاملة لمشاريعك من الفكرة إلى التنفيذ',
    'services.process.subtitle': 'عمليتنا',
    'services.process.title': 'كيف نعمل',
    'services.process.discovery': 'الاستكشاف الاستراتيجي',
    'services.process.discoveryDesc': 'فهم رؤيتك وأهدافك وجمهورك المستهدف لرسم الاستراتيجية المثالية للنجاح.',
    'services.process.planning': 'التخطيط والابتكار',
    'services.process.planningDesc': 'تطوير خطة شاملة تتضمن الجداول الزمنية، والمخرجات، والمفاهيم الإبداعية المبتكرة.',
    'services.process.execution': 'التنفيذ الاحترافي',
    'services.process.executionDesc': 'تحويل رؤيتك إلى واقع ملموس من خلال فريقنا الخبير وأحدث التقنيات العالمية.',
    'services.process.delivery': 'التسليم والتميز',
    'services.process.deliveryDesc': 'اللمسات النهائية، المراجعات، وتقديم نتائج استثنائية تفوق توقعاتك.',
    'services.cta.title': 'هل أنت مستعد لبدء مشروعك؟',
    'services.cta.description': 'دعنا نحول رؤيتك إلى واقع مذهل',
    'services.cta.button': 'تواصل معنا',

    // Portfolio Section
    'portfolio.label': 'أعمالنا',
    'portfolio.title': 'المشاريع',
    'portfolio.subtitle': 'الجودة والتنوع',
    'portfolio.description': 'مجموعة مختارة من أفضل أعمالنا التي حققت نجاحاً باهراً',
    'portfolio.all': 'الكل',
    'portfolio.video': 'فيديو',
    'portfolio.photography': 'تصوير',
    'portfolio.motion': 'تصميم',
    'portfolio.viewProject': 'عرض المشروع',
    'portfolio.readMore': 'اقرأ المزيد',
    'portfolio.categories.all': 'الكل',
    'portfolio.categories.video': 'فيديو',
    'portfolio.categories.photography': 'تصوير',
    'portfolio.categories.design': 'تصميم',
    'portfolio.stats.projects': 'مشروع ناجح',
    'portfolio.stats.clients': 'عميل مستمر',
    'portfolio.stats.awards': 'جائزة',
    'portfolio.stats.years': 'سنوات خبرة',

    // About Section
    'about.label': 'من نحن',
    'about.title': 'Active Media',
    'about.description': 'تأسست في عام 2018، Active Media هي وكالة إنتاج متخصصة في صناعة تجارب بصرية راقية تجذب الجمهور وتحتفظ به.',
    'about.description2': 'مثل المغناطيس، نجذب انتباه جمهورك من خلال محتوى استثنائي يجمع بين الإنتاج السينمائي والتصميم الاحترافي.',
    'about.description3': 'نركز على جمهورك المستهدف مع الانفتاح على فرص أوسع، ونبني علاقات مستدامة من خلال التفاعل المستمر والجودة التي تتحدث عن نفسها.',
    'about.vision': 'قوة الجذب',
    'about.visionText': 'مثل المغناطيس، نجذب الجمهور من خلال محتوى مميز لا يُقاوم',
    'about.mission': 'جمهور مستهدف',
    'about.missionText': 'نركز على جمهورك المثالي مع الانفتاح على فرص أوسع',
    'about.values': 'تفاعل اجتماعي',
    'about.valuesText': 'نبني علاقات مستدامة من خلال التواصل المستمر',
    'about.stat1': 'مشروع منجز',
    'about.stat2': 'عميل راضٍ',
    'about.stat3': 'سنوات خبرة',

    // Philosophy Section
    'philosophy.label': 'فلسفتنا',
    'philosophy.title': 'قوة الجذب',
    'philosophy.description': 'شعارنا ليس مجرد رمز، بل قصة كاملة عن كيفية جذب الجمهور وبناء علاقات مستدامة',
    'philosophy.heroTitle': 'فلسفة Active Media',
    'philosophy.intro': 'في Active Media، نؤمن بأن المحتوى المرئي الاستثنائي هو أكثر من مجرد صور وفيديوهات - إنه تجربة تجذب الجمهور وتبني علاقات مستدامة.',
    'philosophy.approach': 'مثل المغناطيس، نحن نجذب انتباه جمهورك من خلال محتوى استثنائي يجمع بين الإبداع والاحترافية. نركز على جمهورك المستهدف مع الانفتاح على فرص أوسع، ونبني علاقات قوية من خلال التفاعل المستمر والجودة العالية.',
    'philosophy.missionTitle': 'مهمتنا',
    'philosophy.missionIntro': 'مهمتنا هي الوصول إلى كل عميل في لحظة مناسبة من إبداعه، رسالة واضحة وصادقة ومليئة بالإبداع.',
    'philosophy.missionDescription': 'تتمثل مهمتنا في الوصول إلى كل عميل بطريقة تعبر عن التفكير في ثقافتهم، وهدفهم. نحن نجلبهم لنا مع الفن الأصلي والثقافة، وهذا ما نفعله بطريقة بسيطة تحقق الإبداع المطلق لما يمثلونه.',
    'philosophy.missionGoal': 'نسعى لتحقيق التميز في كل مشروع، ونجعل علامتك التجارية تبرز وسط المنافسة من خلال محتوى بصري استثنائي يحكي قصتك بأفضل شكل ممكن.',

    // Clients Section
    'clients.label': 'عملائنا',
    'clients.title': 'العملاء',
    'clients.subtitle': 'شركاء النجاح',
    'clients.description': 'نتعاون مع علامات تجارية رائدة لتقديم محتوى بصري استثنائي',
    'clients.more': 'وأكثر من 200+ علامة تجارية أخرى',

    // Testimonials Section
    'testimonials.label': 'آراء العملاء',
    'testimonials.title': 'آراء العملاء',
    'testimonials.subtitle': 'تغريدات التوصية',
    'testimonials.description': 'ماذا يقول عملاؤنا عن تجربتهم معنا',

    // Team Section
    'team.label': 'OUR CREATIVE',
    'team.title': 'الفريق',
    'team.description': 'فريق مبدع من المتخصصين في الإنتاج البصري والتسويق',
    'team.member1.name': 'Mohamed Ashraf',
    'team.member1.role': 'Creative Team',
    'team.member2.name': 'Rawan Mosad',
    'team.member2.role': 'Moderator',
    'team.member3.name': 'Abdullah Nabil',
    'team.member3.role': 'Media Buyer',
    'team.member4.name': 'Ali Omar',
    'team.member4.role': 'Development Team',
    'team.member5.name': 'Sarah Ahmed',
    'team.member5.role': 'UI/UX Designer',
    'team.member6.name': 'Youssef Ali',
    'team.member6.role': 'Video Editor',
    'team.member7.name': 'Mona Kamel',
    'team.member7.role': 'Content Creator',
    'team.member8.name': 'Omar Reda',
    'team.member8.role': 'Project Manager',

    // CTA Section
    'cta.subtitle': 'LET\'S TALK',
    'cta.titlePrefix': 'ABOUT YOUR',
    'cta.titleHighlight': 'NEXT PROJECT',
    'cta.button': 'Get In Touch',
    'cta.viewWork': 'استعرض أعمالنا',

    // Stats Section
    'stats.clients': 'عميل مستمر',
    'stats.clientsCount': '118',
    'stats.projects': 'مشروع ناجح',
    'stats.projectsCount': '216',
    'stats.years': 'سنوات خبرة',
    'stats.yearsCount': '10',
    'stats.services': 'خدمة متخصصة',
    'stats.servicesCount': '13',

    // Blog Section
    'blog.label': 'المدونة',
    'blog.title': 'رؤى ومقالات',
    'blog.description': 'نصائح وأفكار من خبراء Active Media في عالم الإنتاج والتصميم',
    'blog.readMore': 'اقرأ المزيد',
    'blog.viewAll': 'عرض جميع المقالات',
    'blog.minutes': 'دقائق',

    // Contact Section
    'contact.label': 'تواصل معنا',
    'contact.breadcrumbHome': 'الرئيسية',
    'contact.breadcrumbCurrent': 'لنتحدث عن مشروعك',
    'contact.title': 'لنتحدث عن مشروعك',
    'contact.description': 'يسعدنا تواصلك معنا لمناقشة أفكارك وتحويلها إلى واقع استثنائي.',
    'contact.formTitle': 'تواصل معنا',
    'contact.infoTitle': 'بيانات الاتصال',
    'contact.letsTalk': 'لنتحدث',
    'contact.visitUs': 'زورنا',
    'contact.getDirections': 'احصل على الاتجاهات',
    'contact.name': 'الاسم',
    'contact.phone': 'رقم الهاتف / الموبايل',
    'contact.mobile': 'الموبايل',
    'contact.email': 'البريد الإلكتروني',
    'contact.company': 'الشركة',
    'contact.titleJob': 'المسمى الوظيفي',
    'contact.interest': 'مهتم بـ:',
    'contact.message': 'الرسالة',
    'contact.send': 'إرسال الرسالة',
    'contact.namePlaceholder': 'الاسم الكامل',
    'contact.phonePlaceholder': 'رقم الموبايل',
    'contact.mobilePlaceholder': 'الموبايل',
    'contact.emailPlaceholder': 'البريد الإلكتروني',
    'contact.companyPlaceholder': 'الشركة',
    'contact.titlePlaceholder': 'المسمى الوظيفي',
    'contact.interestPlaceholder': 'مهتم بـ:',
    'contact.messagePlaceholder': 'أخبرنا عن تفاصيل مشروعك...',
    'contact.success': 'تم إرسال رسالتك بنجاح!',
    'contact.error': 'حدث خطأ. يرجى المحاولة مرة أخرى.',

    // Footer
    'footer.tagline': 'قوة الجذب',
    'footer.description': 'مثل المغناطيس، نجذب الجمهور من خلال محتوى استثنائي ونبني علاقات مستدامة من خلال التفاعل المستمر',
    'footer.quickLinks': 'روابط سريعة',
    'footer.services': 'خدماتنا',
    'footer.contact': 'تواصل معنا',
    'footer.rights': 'جميع الحقوق محفوظة',
    'footer.address': 'القاهرة، مصر',

    'portfolio.back': 'العودة للأعمال',
    'portfolio.aboutProject': 'عن المشروع',
    'portfolio.workShowcase': 'معرض الأعمال',
    'portfolio.client': 'العميل',
    'portfolio.date': 'التاريخ',
    'portfolio.category': 'التصنيف',
    'portfolio.tasks': 'المهام',
    'portfolio.startProject': 'ابدأ مشروعك الآن',

    'projects.stone.title': 'فيديو تغطية معرض Stone Africa - ميجا تريد',
    'projects.stone.desc': 'تغطية فيديو شاملة لمعرض Stone Africa الصناعي. قمنا بتوثيق ضخامة الحدث، وعرض الآلات بالتفصيل، ولحظات التواصل رفيعة المستوى لإنشاء فيلم ترويجي قوي.',
    'projects.stone.tag1': 'صناعي',
    'projects.stone.tag2': 'معارض',
    'projects.stone.tag3': 'تصوير سينمائي',
    'projects.stone.tag4': 'مونتاج',
  },
  en: {
    // Navigation
    'nav.home': 'Active Media',
    'nav.philosophy': 'Philosophy',
    'nav.clients': 'Clients',
    'nav.portfolio': 'Portfolio',
    'nav.services': 'Services',
    'nav.team': 'Team',
    'nav.contact': 'Contact Us',

    // Hero Section
    'hero.title1': '',
    'hero.title2': 'Since 2018',
    'hero.description': '',
    'hero.cta': '',

    // Showreel Section
    'showreel.label': 'Showreel',
    'showreel.title': 'Our Visual Journey',
    'showreel.description': 'Enjoy watching our best work in a few minutes',
    'showreel.stat1': 'Completed Projects',
    'showreel.stat2': 'Happy Clients',
    'showreel.stat3': 'Years of Experience',
    'showreel.stat4': 'International Awards',

    // Services Section
    'services.label': 'Our Services',
    'services.title': 'SERVICES',
    'services.subtitle': 'ALL INCLUSIVE ADVERTISING SERVICES',
    'services.description': 'We offer a comprehensive range of visual production services with the highest quality standards',

    // Service Category Descriptions (EN)
    'services.cat1.desc': 'We deliver professional creative production from concept to delivery — commercial videos, product photography, social media content, event coverage, and expert editing that tells your story at its best.',
    'services.cat2.desc': 'We build comprehensive visual identities that reflect the soul of your brand — from logo and full identity design to company profiles and marketing designs across all platforms.',
    'services.cat3.desc': 'We manage your entire digital presence — social media management, content creation & copywriting, SEO, and an integrated marketing strategy to help you hit your goals.',
    'services.cat4.desc': 'We maximize your return on ad spend — Meta, Google, and TikTok ads with continuous campaign optimization and transparent detailed reporting.',

    // Service Category Items (EN)
    'services.cat1.title': 'Creative & Video Production',
    'services.cat1.items': 'Commercial & Advertising Videos|Product Photography & Videography|Social Media Content (Reels / Short-form Video)|Event Coverage|Video Editing & Post Production',
    'services.cat2.title': 'Branding & Graphic Design',
    'services.cat2.items': 'Brand Identity Design|Logo Design|Company Profile Design|Marketing & Social Media Designs',
    'services.cat3.title': 'Digital Marketing',
    'services.cat3.items': 'Social Media Management|Content Creation & Copywriting|Search Engine Optimization (SEO)|Marketing Strategy',
    'services.cat4.title': 'Media Buying & Performance Marketing',
    'services.cat4.items': 'Meta Ads (Facebook & Instagram)|Google Ads|TikTok Ads|Campaign Optimization & Reporting',

    // Legacy service keys (kept for other references)
    'services.branding': 'Branding & Logo Design',
    'services.catalogs': 'Catalogs & Profiles',
    'services.animation': 'Animation & Motion Graphics',
    'services.webapp': 'Web & Mobile Application',
    'services.social': 'Social Media',
    'services.photography': 'Photography & Video Shooting',
    'services.booths': 'Booths & Exhibitions',
    'services.giveaways': 'Giveaways & Production',
    'services.food': 'Food & Beverage Reel Production',
    'services.industrial': 'Industrial Documentaries',
    'services.packaging': 'Packaging Design Services',
    'services.events': 'Events Covering Video Production',

    'services.detail.premium': 'PREMIUM SERVICE',
    'services.detail.whatWeOffer': 'What We Offer:',
    'services.detail.requestNow': 'Request Service Now',

    // Branding Features
    'services.branding.f1': 'Logo Design',
    'services.branding.f2': 'Brand Strategy',
    'services.branding.f3': 'Typography & Color Palette',
    'services.branding.f4': 'Visual Identity Systems',
    'services.branding.f5': 'Brand Guidelines',

    // Catalogs Features
    'services.catalogs.f1': 'Company Profiles',
    'services.catalogs.f2': 'Product Catalogs',
    'services.catalogs.f3': 'Annual Reports',
    'services.catalogs.f4': 'Sales Pitch Decks',
    'services.catalogs.f5': 'Digital Magazines',

    // Animation Features
    'services.animation.f1': '2D/3D Animation',
    'services.animation.f2': 'Motion Graphics',
    'services.animation.f3': 'Explainer Videos',
    'services.animation.f4': 'Logo Animation',
    'services.animation.f5': 'Character Design',

    'services.items.video.title': 'Media Production',
    'services.items.video.description': 'Complete video production from start to finish for commercials, corporate films, and promotional content with a focus on storytelling and visual quality',
    'services.items.photography.title': 'Professional Photography',
    'services.items.photography.description': 'Professional product and lifestyle photography designed to elevate your brand image across all platforms',
    'services.editing': 'Editing',
    'services.editingDesc': 'Professional editing that tells your story perfectly',
    'services.items.design.title': 'Graphic Design',
    'services.items.design.description': 'Creative designs that highlight your brand identity in a unique way',
    'services.items.creative.title': 'Creative Direction',
    'services.items.creative.description': 'Comprehensive creative management for your projects from concept to execution',
    'services.process.subtitle': 'Our Process',
    'services.process.title': 'How We Work',
    'services.process.discovery': 'Strategic Discovery',
    'services.process.discoveryDesc': 'Understanding your vision, goals, and target audience to create the perfect strategy.',
    'services.process.planning': 'Creative Planning',
    'services.process.planningDesc': 'Developing a comprehensive plan with timelines, deliverables, and creative concepts.',
    'services.process.execution': 'Expert Execution',
    'services.process.executionDesc': 'Bringing your vision to life with our expert team and cutting-edge technology.',
    'services.process.delivery': 'Quality Delivery',
    'services.process.deliveryDesc': 'Final touches, revisions, and delivering exceptional results that exceed expectations.',
    'services.cta.title': 'Are You Ready to Start Your Project?',
    'services.cta.description': 'Let\'s turn your vision into a stunning reality',
    'services.cta.button': 'Contact Us',

    // Portfolio Section
    'portfolio.label': 'Our Work',
    'portfolio.title': 'PROJECTS',
    'portfolio.subtitle': 'QUALITY & VARIETY',
    'portfolio.description': 'A curated selection of our best work that achieved remarkable success',
    'portfolio.all': 'All',
    'portfolio.video': 'Video',
    'portfolio.photography': 'Photography',
    'portfolio.motion': 'Design',
    'portfolio.viewProject': 'View Project',
    'portfolio.readMore': 'READ MORE',
    'portfolio.categories.all': 'All',
    'portfolio.categories.video': 'Video',
    'portfolio.categories.photography': 'Photography',
    'portfolio.back': 'Back to Portfolio',
    'portfolio.aboutProject': 'About the Project',
    'portfolio.workShowcase': 'Work showcase',
    'portfolio.client': 'CLIENT',
    'portfolio.date': 'DATE',
    'portfolio.category': 'CATEGORY',
    'portfolio.tasks': 'TASKS',
    'portfolio.startProject': 'Start Your Project',
    'portfolio.stats.projects': 'Successful Projects',
    'portfolio.stats.clients': 'Continued Clients',
    'portfolio.stats.awards': 'International Awards',
    'portfolio.stats.years': 'Years of Experience',

    'projects.stone.title': 'Mega Trade Industrial Event Video Stone Africa',
    'projects.stone.desc': 'Comprehensive video coverage for the Stone Africa industrial exhibition. We captured the scale of the event, detailed machinery displays, and high-level networking moments to create a powerful promotional film.',
    'projects.stone.tag1': 'Industrial',
    'projects.stone.tag2': 'Exhibition',
    'projects.stone.tag3': 'Cinematography',
    'projects.stone.tag4': 'Editing',

    // About Section
    'about.label': 'About Us',
    'about.title': 'Active Media',
    'about.description': 'Founded in 2018, Active Media is a production agency specialized in creating premium visual experiences that attract and retain audiences.',
    'about.description2': 'Like a magnet, we attract your audience\'s attention through exceptional content that combines cinematic production and professional design.',
    'about.description3': 'We focus on your target audience while remaining open to broader opportunities, building sustainable relationships through continuous engagement and quality that speaks for itself.',
    'about.vision': 'Power of Attraction',
    'about.visionText': 'Like a magnet, we attract the audience through exceptional content and build sustainable relationships through continuous interaction',
    'about.mission': 'Targeted Audience',
    'about.missionText': 'We focus on your ideal audience while remaining open to broader opportunities',
    'about.values': 'Social Engagement',
    'about.valuesText': 'We build sustainable relationships through continuous communication',
    'about.stat1': 'Completed Projects',
    'about.stat2': 'Satisfied Clients',
    'about.stat3': 'Years of Experience',

    // Philosophy Section
    'philosophy.label': 'Our Philosophy',
    'philosophy.title': 'Power of Attraction',
    'philosophy.description': 'Our logo is not just a symbol, but a complete story about how to attract audiences and build sustainable relationships',
    'philosophy.heroTitle': 'Active Media Philosophy',
    'philosophy.intro': 'At Active Media, we believe that exceptional visual content is more than just images and videos - it\'s an experience that attracts audiences and builds sustainable relationships.',
    'philosophy.approach': 'Like a magnet, we attract your audience\'s attention through exceptional content that combines creativity and professionalism. We focus on your target audience while remaining open to broader opportunities, building strong relationships through continuous engagement and high-quality.',
    'philosophy.missionTitle': 'Our Mission',
    'philosophy.missionIntro': 'Our mission is to reach every client at the right moment of their creativity, with a clear, honest, and creative message.',
    'philosophy.missionDescription': 'Our mission is to reach every client in a way that reflects their culture and goals. We bring them to us with original art and culture, and we do it in a simple way that achieves absolute creativity for what they represent.',
    'philosophy.missionGoal': 'We strive to achieve excellence in every project, and make your brand stand out in the competition through exceptional visual content that tells your story in the best possible way.',

    // Clients Section
    'clients.label': 'Our Partners',
    'clients.title': 'CLIENTS',
    'clients.subtitle': 'OUR HAPPY & SATISFIED',
    'clients.description': 'We collaborate with leading brands to deliver exceptional visual content',
    'clients.more': 'And more than 200+ other brands',

    // Testimonials Section
    'testimonials.label': 'Client Testimonials',
    'testimonials.title': 'TESTIMONIALS',
    'testimonials.subtitle': 'ENDORSEMENT TWEETS',
    'testimonials.description': 'What our clients say about their experience with us',

    // Team Section
    'team.label': 'OUR CREATIVE',
    'team.title': 'TEAM',
    'team.description': 'A creative team of professionals in visual production and marketing',
    'team.member1.name': 'Mohamed Ashraf',
    'team.member1.role': 'Creative Team',
    'team.member2.name': 'Rawan Mosad',
    'team.member2.role': 'Moderator',
    'team.member3.name': 'Abdullah Nabil',
    'team.member3.role': 'Media Buyer',
    'team.member4.name': 'Ali Omar',
    'team.member4.role': 'Development Team',
    'team.member5.name': 'Sarah Ahmed',
    'team.member5.role': 'UI/UX Designer',
    'team.member6.name': 'Youssef Ali',
    'team.member6.role': 'Video Editor',
    'team.member7.name': 'Mona Kamel',
    'team.member7.role': 'Content Creator',
    'team.member8.name': 'Omar Reda',
    'team.member8.role': 'Project Manager',

    // CTA Section
    'cta.subtitle': 'LET\'S TALK',
    'cta.titlePrefix': 'ABOUT YOUR',
    'cta.titleHighlight': 'NEXT PROJECT',
    'cta.button': 'Get In Touch',
    'cta.viewWork': 'View Our Work',

    // Stats Section
    'stats.clients': 'Continued Clients',
    'stats.clientsCount': '118',
    'stats.projects': 'Successful Projects',
    'stats.projectsCount': '216',
    'stats.years': 'Years of Experience',
    'stats.yearsCount': '10',
    'stats.services': 'Specialized Services',
    'stats.servicesCount': '13',

    // Blog Section
    'blog.label': 'Blog',
    'blog.title': 'Latest Articles',
    'blog.description': 'Tips and ideas about visual production and content creation',
    'blog.readMore': 'Read More',
    'blog.viewAll': 'View All Articles',
    'blog.minutes': 'minutes',

    // Contact Section
    'contact.label': 'Contact Us',
    'contact.breadcrumbHome': 'Home',
    'contact.breadcrumbCurrent': 'Talk About Your Project.',
    'contact.title': 'Talk About Your Project.',
    'contact.description': "We'd love to hear from you. Share your project details and let's create something extraordinary.",
    'contact.formTitle': 'Get In Touch.',
    'contact.infoTitle': 'Contact Info.',
    'contact.letsTalk': "Let's Talk.",
    'contact.visitUs': 'Visit Us.',
    'contact.getDirections': 'Get Directions',
    'contact.name': 'Name',
    'contact.phone': 'Phone Number',
    'contact.mobile': 'Mobile',
    'contact.email': 'Email',
    'contact.company': 'Company',
    'contact.titleJob': 'Title',
    'contact.interest': 'Interest with:',
    'contact.message': 'Message',
    'contact.send': 'Send Message',
    'contact.namePlaceholder': 'Full Name',
    'contact.phonePlaceholder': 'Phone Number',
    'contact.mobilePlaceholder': 'Mobile',
    'contact.emailPlaceholder': 'Email',
    'contact.companyPlaceholder': 'Company',
    'contact.titlePlaceholder': 'Title',
    'contact.interestPlaceholder': 'Interest with:',
    'contact.messagePlaceholder': 'Tell us about your project...',
    'contact.success': 'Your message has been sent successfully!',
    'contact.error': 'An error occurred. Please try again.',

    // Footer
    'footer.tagline': 'Power of Attraction',
    'footer.description': 'Like a magnet, we attract the audience through exceptional content and build sustainable relationships through continuous interaction',
    'footer.quickLinks': 'Quick Links',
    'footer.services': 'Our Services',
    'footer.contact': 'Contact Us',
    'footer.rights': 'All Rights Reserved.',
    'footer.address': 'Cairo, Egypt',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage(prev => {
      const next = prev === 'ar' ? 'en' : 'ar';
      toast.success(next === 'ar' ? 'تم تغيير اللغة إلى العربية' : 'Language changed to English');
      return next;
    });
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
