const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function syncData() {
  console.log('Synchronizing database with EXACT data from _legacy/index.html...');

  // 1. Admin
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin#Mahabbah2026!';
  const passwordHash = await bcrypt.hash(adminPassword, 12);
  await prisma.user.upsert({
    where: { username: 'admin_mahabbah' },
    update: { passwordHash },
    create: {
      username: 'admin_mahabbah',
      email: 'admin@mahabbah.dev',
      passwordHash,
      role: 'ADMIN',
    },
  });
  console.log('✓ Admin user verified');

  // 2. Profile
  await prisma.profile.upsert({
    where: { id: 'profile_default' },
    update: {
      name: 'Mahabbah Mahabban Romadhon',
      title: 'Machine Learning & Cyber Security Practitioner',
      kicker: 'Machine Learning & Cyber Security Practitioner',
      bio: `Halo, saya Mahabbah Mahabban Romadhon, seorang profesional teknologi multidisiplin yang memadukan keahlian dalam Kecerdasan Buatan (AI), Rekayasa Perangkat Lunak (Web/Mobile), dan Keamanan Siber. Saya memegang sertifikasi HTB Certified Bug Bounty Hunter (CBBH) dan lulusan program prestisius Deep Learning Specialization dari DeepLearning.AI.

Fokus utama saya adalah membangun ekosistem digital secara komprehensif—mulai dari melatih model Machine Learning yang presisi, merancang antarmuka pengguna yang responsif, hingga mengamankan arsitektur sistem dari potensi kerentanan. Dedikasi saya pada keamanan sistem dibuktikan melalui penemuan kerentanan (vulnerability bug) pada infrastruktur digital detikcom, yang telah diverifikasi dan diapresiasi secara resmi.

Latar belakang saya berakar dari Teknik Komputer dan Jaringan, mencakup pengalaman langsung dalam instalasi & splicing fiber optic hingga peran sebagai Visual Designer yang mengelola deployment web lokal. Ditambah pengalaman organisasi di PMR (Palang Merah Remaja) dan English Club, saya terbiasa bekerja presisi, terstruktur, dan adaptif di berbagai lini teknologi. Di sisi kreatif, saya juga menekuni animasi 3D menggunakan Source Filmmaker (SFM) dan Prisma3D, mulai dari character rigging hingga penataan gerak dan pencahayaan adegan.`,
      shortBio: 'Praktisi teknologi bersertifikat dengan fokus pada perancangan arsitektur perangkat lunak yang aman, efisien, dan berbasis kecerdasan buatan.',
      avatarUrl: '/images/profile.jpg',
      heroImageUrl: '/images/avatar-robot.jpg',
      location: 'Yogyakarta, Indonesia',
      email: 'misnosusanto97@gmail.com',
      phone: '+62 878-9730-5696',
      availability: 'AVAILABLE FOR SELECT ENGAGEMENTS',
      resumeUrl: '/CV_Mahabbah_Mahabban_Romadhon.pdf',
      ctaText: 'Unduh CV',
      ctaLink: '/CV_Mahabbah_Mahabban_Romadhon.pdf',
      githubUrl: 'https://github.com/kangguruhdq-ux',
      linkedinUrl: 'https://linkedin.com',
      instagramUrl: 'https://instagram.com',
    },
    create: {
      id: 'profile_default',
      name: 'Mahabbah Mahabban Romadhon',
      title: 'Machine Learning & Cyber Security Practitioner',
      kicker: 'Machine Learning & Cyber Security Practitioner',
      bio: `Halo, saya Mahabbah Mahabban Romadhon, seorang profesional teknologi multidisiplin yang memadukan keahlian dalam Kecerdasan Buatan (AI), Rekayasa Perangkat Lunak (Web/Mobile), dan Keamanan Siber. Saya memegang sertifikasi HTB Certified Bug Bounty Hunter (CBBH) dan lulusan program prestisius Deep Learning Specialization dari DeepLearning.AI.

Fokus utama saya adalah membangun ekosistem digital secara komprehensif—mulai dari melatih model Machine Learning yang presisi, merancang antarmuka pengguna yang responsif, hingga mengamankan arsitektur sistem dari potensi kerentanan. Dedikasi saya pada keamanan sistem dibuktikan melalui penemuan kerentanan (vulnerability bug) pada infrastruktur digital detikcom, yang telah diverifikasi dan diapresiasi secara resmi.

Latar belakang saya berakar dari Teknik Komputer dan Jaringan, mencakup pengalaman langsung dalam instalasi & splicing fiber optic hingga peran sebagai Visual Designer yang mengelola deployment web lokal. Ditambah pengalaman organisasi di PMR (Palang Merah Remaja) dan English Club, saya terbiasa bekerja presisi, terstruktur, dan adaptif di berbagai lini teknologi. Di sisi kreatif, saya juga menekuni animasi 3D menggunakan Source Filmmaker (SFM) dan Prisma3D, mulai dari character rigging hingga penataan gerak dan pencahayaan adegan.`,
      shortBio: 'Praktisi teknologi bersertifikat dengan fokus pada perancangan arsitektur perangkat lunak yang aman, efisien, dan berbasis kecerdasan buatan.',
      avatarUrl: '/images/profile.jpg',
      heroImageUrl: '/images/avatar-robot.jpg',
      location: 'Yogyakarta, Indonesia',
      email: 'misnosusanto97@gmail.com',
      phone: '+62 878-9730-5696',
      availability: 'AVAILABLE FOR SELECT ENGAGEMENTS',
      resumeUrl: '/CV_Mahabbah_Mahabban_Romadhon.pdf',
      ctaText: 'Unduh CV',
      ctaLink: '/CV_Mahabbah_Mahabban_Romadhon.pdf',
      githubUrl: 'https://github.com/kangguruhdq-ux',
      linkedinUrl: 'https://linkedin.com',
      instagramUrl: 'https://instagram.com',
    },
  });
  console.log('✓ Profile updated with exact bio');

  // 3. Education
  await prisma.education.deleteMany({});
  await prisma.education.create({
    data: {
      institution: 'SMKN 3 Yogyakarta',
      program: 'Teknik Komputer dan Jaringan',
      startDate: '2024',
      endDate: '2027',
      logo: '/images/smkn3-logo.png',
      description: `• Pengembangan Web: Kompeten dalam pengembangan aplikasi web full-stack menggunakan ekosistem HTML, CSS, JavaScript, PHP, dan Laravel, disertai keahlian dalam merancang dan mengelola basis data relasional MySQL.
• Infrastruktur Jaringan: Berpengalaman dalam administrasi dan konfigurasi infrastruktur jaringan (LAN/WAN) skala dasar, memanfaatkan perangkat keras MikroTik dan simulasi tingkat lanjut dengan Cisco Packet Tracer.
• Perawatan Sistem: Memiliki keahlian teknis yang solid dalam perakitan, troubleshooting, dan pemeliharaan perangkat keras komputasi guna memastikan reliabilitas operasional sistem secara optimal.
• Organisasi & Ekstrakurikuler: Aktif mengikuti kegiatan ekstrakurikuler PMR (Palang Merah Remaja) dan English Club, yang mengasah kemampuan kerja sama tim, kepedulian sosial, serta komunikasi dalam bahasa Inggris.`,
      sortOrder: 1,
    },
  });
  console.log('✓ Education updated with SMKN 3 Yogyakarta');

  // 4. Experience
  await prisma.experience.deleteMany({});
  await prisma.experience.createMany({
    data: [
      {
        role: 'Visual Designer',
        company: 'PT Imersa Solusi Teknologi',
        startDate: '2026',
        endDate: '2027',
        current: true,
        location: 'Yogyakarta, Indonesia',
        description: `• Mengembangkan arah visual untuk berbagai kebutuhan branding, promosi, dan kampanye kreatif.
• Membimbing tim desain dalam menghasilkan karya yang sesuai dengan identitas dan tujuan merek.
• Mengonfigurasi dan mengelola server lokal (Localhost/Web Server) untuk kebutuhan deployment sistem web dan penayangan iklan digital perusahaan.
• Melakukan pemantauan sistem, pengujian konektivitas, serta troubleshooting dari sisi software untuk memastikan web lokal dapat diakses tanpa kendala.`,
        verified: true,
        sortOrder: 1,
      },
      {
        role: 'Teknisi Instalasi & Splicing Jaringan Fiber Optic',
        company: 'Jaringan & Infrastruktur Internet Pelanggan',
        startDate: '2025',
        endDate: '2026',
        current: false,
        location: 'Indonesia',
        description: `• Melakukan instalasi dan penarikan kabel jaringan (Tembaga dan Fiber Optic) untuk kebutuhan infrastruktur internet pelanggan.
• Melaksanakan penyambungan inti kabel serat optik (splicing) dengan tingkat ketelitian tinggi untuk meminimalisir redaman (loss).
• Menguji dan memastikan kualitas konektivitas jaringan pada seluruh instalasi menggunakan alat ukur seperti OPM dan LAN Tester.`,
        verified: true,
        sortOrder: 2,
      },
    ],
  });
  console.log('✓ Experiences updated');

  // 5. Certificates (All 6 exact certs from HTML)
  await prisma.certificate.deleteMany({});
  await prisma.certificate.createMany({
    data: [
      {
        title: 'CBBH — Certified Bug Bounty Hunter',
        issuer: 'Hack The Box',
        issueDate: 'Valid: Hingga April 2026',
        credentialId: 'HTB-CBBH-7795',
        credentialUrl: 'https://academy.hackthebox.com/',
        image: '/images/cert-cbbh.jpg',
        description:
          'Kredensial profesional tingkat lanjut di bidang keamanan siber praktis, mengesahkan kemampuan dalam melakukan identifikasi, eksploitasi, dan pelaporan celah keamanan sistem informasi. Disahkan oleh Charalampos Pyarinos (CEO).',
        skills: ['Penetration Testing', 'Bug Bounty', 'Web Security', 'Burp Suite'],
        sortOrder: 1,
      },
      {
        title: 'Deep Learning Specialization',
        issuer: 'DeepLearning.AI (Coursera)',
        issueDate: 'Diterbitkan: Juni 2026',
        credentialId: 'COURSERA-DL-SPEC',
        credentialUrl: 'https://coursera.org',
        image: '/images/cert-deeplearning.jpg',
        description:
          'Program spesialisasi intensif di bawah bimbingan Andrew Ng. Menguasai arsitektur Neural Networks, Hyperparameter Tuning, implementasi CNNs (Visual Data), dan Sequence Models (NLP/Audio).',
        skills: ['Deep Learning', 'PyTorch', 'TensorFlow', 'Computer Vision'],
        sortOrder: 2,
      },
      {
        title: 'Penghargaan Pelaporan Kerentanan Sistem',
        issuer: 'detikcom IT Security Division',
        issueDate: 'Diterbitkan: Juni 2026',
        credentialId: 'DETIKCOM-HOF-2026',
        credentialUrl: 'https://detik.com',
        image: '/images/cert-detikcom.jpg',
        description:
          'Sertifikat apresiasi resmi (Hall of Fame) yang diterbitkan oleh Bagus Setiawan (Direktur IT detikcom) atas dedikasi dan tanggung jawab dalam menemukan serta melaporkan celah keamanan krusial pada platform detikcom.',
        skills: ['Responsible Disclosure', 'Vulnerability Assessment', 'Security Hardening'],
        sortOrder: 3,
      },
      {
        title: 'Professional Machine Learning Engineer',
        issuer: 'Google Cloud',
        issueDate: '21 Apr 2026 – 27 Mar 2028',
        credentialId: 'J8M0K',
        credentialUrl: 'https://cloud.google.com/certification',
        image: '/images/cert-gcp-mle.jpg',
        description:
          'Sertifikasi profesional industri yang mengesahkan keahlian tingkat lanjut dalam merancang, membangun, dan memproduksi (production-izing) model Machine Learning di atas infrastruktur Google Cloud. Ditandatangani oleh Thomas Kurian (CEO Google Cloud).',
        skills: ['Google Cloud', 'MLOps', 'Model Deployment', 'BigQuery'],
        sortOrder: 4,
      },
      {
        title: 'Neural Networks and Deep Learning',
        issuer: 'DeepLearning.AI (Coursera)',
        issueDate: 'Diterbitkan: 25 Des 2025',
        credentialId: 'KL349UPMCLWW',
        credentialUrl: 'https://coursera.org/verify/KL349UPMCLWW',
        image: '/images/cert-nn-deeplearning.jpg',
        description:
          'Sertifikat penyelesaian kursus yang berfokus pada konsep dasar jaringan saraf tiruan (neural networks) dan deep learning. Ditandatangani oleh Andrew Ng. Kode Verifikasi Coursera: KL349UPMCLWW.',
        skills: ['Neural Networks', 'Forward/Backprop', 'Vectorization'],
        sortOrder: 5,
      },
      {
        title: 'Thermodynamics of Refrigeration',
        issuer: 'The Training Center (Terakreditasi EPA)',
        issueDate: 'Diterbitkan: 10 Jan 2025',
        credentialId: 'EPA-HVAC-ROY',
        credentialUrl: '',
        image: '/images/cert-hvac-thermo.jpg',
        description:
          'Sertifikat penyelesaian pelatihan teknik yang mengonfirmasi pemahaman tentang teori dasar perpindahan panas dan siklus pendinginan untuk industri HVAC (Heating, Ventilation, and Air Conditioning). Ditandatangani oleh Rob Roy.',
        skills: ['HVAC Systems', 'Thermodynamics', 'Technical Diagnostics'],
        sortOrder: 6,
      },
    ],
  });
  // 6. Skills
  await prisma.skill.deleteMany({});
  await prisma.skill.createMany({
    data: [
      { name: 'Python', category: 'AI & Backend', proficiency: 95, sortOrder: 1 },
      { name: 'PyTorch & Deep Learning', category: 'AI & Backend', proficiency: 92, sortOrder: 2 },
      { name: 'YOLOv8 & Computer Vision', category: 'AI & Backend', proficiency: 90, sortOrder: 3 },
      { name: 'Bug Bounty & Web Security (CBBH)', category: 'Cyber Security', proficiency: 94, sortOrder: 4 },
      { name: 'Burp Suite & Penetration Testing', category: 'Cyber Security', proficiency: 92, sortOrder: 5 },
      { name: 'ReactJS & Next.js 14', category: 'Web Development', proficiency: 95, sortOrder: 6 },
      { name: 'TypeScript', category: 'Web Development', proficiency: 92, sortOrder: 7 },
      { name: 'Tailwind CSS', category: 'Web Development', proficiency: 96, sortOrder: 8 },
      { name: 'Node.js & Express', category: 'Web Development', proficiency: 88, sortOrder: 9 },
      { name: 'HTML5 & Modern CSS', category: 'Web Development', proficiency: 98, sortOrder: 10 },
      { name: 'JavaScript (ES6+)', category: 'Web Development', proficiency: 95, sortOrder: 11 },
      { name: 'Supabase & PostgreSQL', category: 'Backend & Cloud', proficiency: 90, sortOrder: 12 },
      { name: 'Vercel Deployment', category: 'Backend & Cloud', proficiency: 92, sortOrder: 13 },
      { name: 'Figma UI/UX Design', category: 'Design & Creative', proficiency: 90, sortOrder: 14 },
      { name: 'Source Filmmaker (SFM 3D)', category: 'Design & Creative', proficiency: 88, sortOrder: 15 },
      { name: 'Prisma3D Mobile 3D Modeling', category: 'Design & Creative', proficiency: 85, sortOrder: 16 },
      { name: 'MikroTik & Splicing Fiber Optic', category: 'Network Infrastructure', proficiency: 90, sortOrder: 17 },
    ],
  });
  console.log('✓ All Skills synced');

  console.log('All data synchronized successfully!');
}

syncData()
  .catch((err) => {
    console.error('Sync failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
