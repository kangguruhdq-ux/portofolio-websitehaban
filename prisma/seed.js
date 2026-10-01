const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding portfolio database...');

  // 1. Admin User
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin#Mahabbah2026!';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { username: 'admin_mahabbah' },
    update: {
      passwordHash,
    },
    create: {
      username: 'admin_mahabbah',
      email: 'admin@mahabbah.dev',
      passwordHash,
      role: 'ADMIN',
    },
  });
  console.log('Admin user initialized:', admin.username);

  // 2. Profile
  await prisma.profile.upsert({
    where: { id: 'profile_default' },
    update: {},
    create: {
      id: 'profile_default',
      name: 'Mahabbah Mahabban Romadhon',
      title: 'Machine Learning & Cyber Security Practitioner',
      kicker: 'Certified Technology Practitioner',
      bio: "Hi, I am Mahabbah Mahabban Romadhon, a multidisciplinary technology professional combining expertise in Artificial Intelligence (AI), Software Engineering (Web/Mobile), and Cyber Security. I hold the HTB Certified Bug Bounty Hunter (CBBH) certification and graduated from the prestigious Deep Learning Specialization program by DeepLearning.AI. My main focus is building digital ecosystems end-to-end — from training precise Machine Learning models, to designing responsive user interfaces, to securing system architecture against potential vulnerabilities. My dedication to system security is proven through the discovery of a vulnerability bug in detikcom's digital infrastructure, which was officially verified and appreciated.",
      shortBio: 'Certified technology practitioner focused on designing software architecture that is secure, efficient, and AI-driven.',
      avatarUrl: '/images/profile.jpg',
      heroImageUrl: '/images/avatar-robot.jpg',
      location: 'Indonesia',
      email: 'mahabbah@example.com',
      phone: '+62 812-3456-7890',
      availability: 'AVAILABLE FOR SELECT ENGAGEMENTS',
      resumeUrl: '/CV_Mahabbah_Mahabban_Romadhon.pdf',
      ctaText: "Let's Collaborate",
      ctaLink: '/contact',
      githubUrl: 'https://github.com/kangguruhdq-ux',
      linkedinUrl: 'https://linkedin.com',
      instagramUrl: 'https://instagram.com',
    },
  });
  console.log('Profile initialized.');

  // 3. Projects
  const projects = [
    {
      title: 'Real-Time APD Safety Detection System',
      slug: 'apd-safety-detection',
      kicker: 'FEATURED // 01 · ARTIFICIAL INTELLIGENCE · COMPUTER VISION',
      description: 'Sistem pemantauan keselamatan kerja otomatis berbasis kecerdasan buatan (Computer Vision) yang terhubung langsung ke CCTV proyek, mendeteksi kelengkapan APD secara real-time dan memberi peringatan dini pelanggaran protokol K3.',
      longDescription: 'Arsitektur inferensi berbasis deep learning yang dilatih dengan arsitektur YOLOv8 untuk mendeteksi helm pengaman, rompi visibilitas tinggi, dan sepatu pelindung di area konstruksi. Dilengkapi pipeline decoding RTSP terakselerasi hardware NVIDIA TensorRT untuk memproses multi-stream kamera secara simultan pada latency di bawah 25ms.',
      thumbnail: '/images/project-apd.jpg',
      gallery: ['/images/project-apd.jpg'],
      category: 'AI & ML',
      technologies: ['YOLOv8', 'PyTorch', 'Python', 'NVIDIA CUDA', 'TensorRT', 'RTSP & FFmpeg', 'C++'],
      simulatorKey: 'apd',
      specifications: {
        'MODEL': 'YOLO & PyTorch',
        'ACCEL': 'NVIDIA CUDA / TensorRT',
        'STREAM': 'RTSP & FFmpeg',
        'INFERENCE': 'Python, C++'
      },
      featured: true,
      published: true,
      projectDate: '2026',
      sortOrder: 1,
    },
    {
      title: 'OSINT Cyber Threat Intelligence Dashboard',
      slug: 'osint-threat-intelligence',
      kicker: 'FEATURED // 02 · CYBER SECURITY · THREAT RECON',
      description: 'Platform intelijen siber dan pemindaian permukaan serangan (attack surface reconnaissance) otomatis yang mengumpulkan telemetry aset digital, mendeteksi port terbuka, serta memetakan potensi celah keamanan secara presisi.',
      longDescription: 'Dikembangkan berdasarkan pengalaman hands-on mitigasi bug bounty detikcom dan metodologi CBBH. Engine ini memadukan passive DNS harvesting, reverse IP telemetry, cert transparency correlation, dan shodan intelligence query ke dalam satu visual dashboard.',
      thumbnail: '/images/project-osint.jpg',
      gallery: ['/images/project-osint.jpg'],
      category: 'Keamanan',
      technologies: ['Python', 'OSINT Framework', 'Shodan API', 'Nmap Engine', 'Web Security', 'DNS Telemetry'],
      simulatorKey: 'osint',
      specifications: {
        'ENGINE': 'Automated Recon',
        'SECURITY': 'CBBH Certified',
        'SCANNER': 'Passive OSINT',
        'TELEMETRY': 'Shodan & DNS'
      },
      featured: true,
      published: true,
      projectDate: '2025 - 2026',
      sortOrder: 2,
    },
    {
      title: 'Earth 3D Simulation & Atmospheric Telemetry',
      slug: 'edolus-3d-earth',
      kicker: 'FEATURED // 03 · 3D SIMULATION · WEBGL',
      description: 'Simulasi 3D orbital planet Bumi dengan atmosferik glow berbasis custom GLSL shaders, visualisasi rotasi geosinkron, dan layer telemetry stasiun pengamatan global interaktif.',
      longDescription: 'Mengeksplorasi batas performa WebGL pada browser menggunakan Three.js procedural texture shaders, bump normal mapping medan topografi, dan particle-based cloud circulation. Dirancang fluid 60 FPS pada perangkat mobile dan desktop.',
      thumbnail: '/images/project-web3d.jpg',
      gallery: ['/images/project-web3d.jpg'],
      category: 'Kreatif',
      technologies: ['Three.js', 'WebGL', 'GLSL Shaders', 'JavaScript', '3D Mathematics'],
      simulatorKey: 'globe3d',
      specifications: {
        'RENDERER': 'Three.js WebGL',
        'SHADERS': 'Custom GLSL',
        'FRAME RATE': '60 FPS Adaptive',
        'TELEMETRY': 'Geosynchronous'
      },
      featured: true,
      published: true,
      projectDate: '2025',
      sortOrder: 3,
    },
    {
      title: '3D Character Rigging & Animation Inspector',
      slug: 'sfm-3d-character-animation',
      kicker: 'FEATURED // 04 · CREATIVE 3D · ANIMATION',
      description: 'Showcase hasil rekayasa animasi 3D, weight painting, dan character rigging menggunakan Source Filmmaker (SFM) dan Prisma3D dengan pencahayaan sinematik dan timing gerakan realistis.',
      longDescription: 'Karya visual dan simulasi gerak karakter yang mengombinasikan pemahaman pencahayaan three-point cinematic, inverse kinematics (IK) rigging, dan ekspresi mikro. Menampilkan portfolio aset 3D yang dapat diinspeksi secara interaktif.',
      thumbnail: '/images/project-anim3d.jpg',
      gallery: ['/images/project-anim3d.jpg'],
      category: 'Kreatif',
      technologies: ['Source Filmmaker', 'Prisma3D', 'Rigging', 'Keyframe Animation', 'Cinematography'],
      simulatorKey: 'mesh3d',
      specifications: {
        'TOOLSET': 'SFM & Prisma3D',
        'RIG TYPE': 'IK / FK Dual',
        'LIGHTING': '3-Point Cinematic',
        'ASPECT': 'Viewport Inspector'
      },
      featured: true,
      published: true,
      projectDate: '2025',
      sortOrder: 4,
    },
    {
      title: 'Web-Based Pacman Engine',
      slug: 'pacman-canvas-engine',
      kicker: 'ENGINEERING // 05 · GAME LOOP · ALGORITHMS',
      description: 'Implementasi game klasik Pacman berbasis HTML5 Canvas murni dengan logika pergerakan grid 2D, state machine perilaku Ghost AI, dan collision matrix presisi.',
      longDescription: 'Eksplorasi arsitektur Game Loop pada browser tanpa dependency luar. Membangun finite state machine (FSM) untuk strategi pathfinding ghost, score keeping, dan audio synthesis.',
      thumbnail: '/images/project-pacman.jpg',
      gallery: ['/images/project-pacman.jpg'],
      category: 'Web',
      technologies: ['HTML5 Canvas', 'JavaScript', 'FSM Game AI', 'Audio API'],
      featured: false,
      published: true,
      projectDate: '2024',
      sortOrder: 5,
    },
    {
      title: 'Virtual Photo Booth Web App',
      slug: 'virtual-photo-booth',
      kicker: 'ENGINEERING // 06 · MEDIA STREAM · INTERACTIVE',
      description: 'Aplikasi photo booth digital interaktif dengan integrasi kamera real-time, overlay filter kustom, countdown timer, dan ekspor instan strip foto resolusi tinggi.',
      longDescription: 'Pemanfaatan WebRTC getUserMedia API untuk capture frame kamera langsung dari browser, pemrosesan efek warna canvas secara real-time, dan export composite strip ke format PNG siap cetak.',
      thumbnail: '/images/project-photobooth.jpg',
      gallery: ['/images/project-photobooth.jpg'],
      category: 'Web',
      technologies: ['WebRTC', 'Canvas API', 'JavaScript', 'Tailwind CSS'],
      featured: false,
      published: true,
      projectDate: '2024',
      sortOrder: 6,
    },
    {
      title: 'Interactive 3D Health & BMI Calculator',
      slug: 'bmi-3d-calculator',
      kicker: 'ENGINEERING // 07 · HEALTH TECH · 3D VISUALIZATION',
      description: 'Kalkulator Indeks Massa Tubuh (BMI) interaktif yang dipadukan dengan representasi model antropometri 3D dinamis dan rekomendasi kesehatan personal.',
      longDescription: 'Aplikasi edukasi kesehatan yang mengubah data metrik tubuh menjadi feedback visual seketika, membantu pengguna memahami status berat badan dengan representasi spasial yang intuitif.',
      thumbnail: '/images/project-bmi3d.jpg',
      gallery: ['/images/project-bmi3d.jpg'],
      category: 'Web',
      technologies: ['Three.js', 'JavaScript', 'CSS 3D', 'Health Metrics'],
      featured: false,
      published: true,
      projectDate: '2024',
      sortOrder: 7,
    },
  ];

  for (const p of projects) {
    const existing = await prisma.project.findUnique({ where: { slug: p.slug } });
    if (existing) {
      await prisma.project.update({
        where: { id: existing.id },
        data: p,
      });
    } else {
      await prisma.project.create({ data: p });
    }
  }
  console.log(`Seeded ${projects.length} projects.`);

  // 4. Skills
  const skills = [
    // AI & Machine Learning
    { name: 'Python & PyTorch', category: 'AI & Machine Learning', proficiency: 94, sortOrder: 1 },
    { name: 'YOLOv8 Computer Vision', category: 'AI & Machine Learning', proficiency: 92, sortOrder: 2 },
    { name: 'Deep Learning & Neural Networks', category: 'AI & Machine Learning', proficiency: 90, sortOrder: 3 },
    { name: 'NVIDIA CUDA & TensorRT', category: 'AI & Machine Learning', proficiency: 85, sortOrder: 4 },
    { name: 'OpenCV & Video Analytics', category: 'AI & Machine Learning', proficiency: 88, sortOrder: 5 },

    // Cyber Security
    { name: 'Bug Bounty Hunting (CBBH)', category: 'Cyber Security', proficiency: 95, sortOrder: 6 },
    { name: 'Web Application Pentesting', category: 'Cyber Security', proficiency: 92, sortOrder: 7 },
    { name: 'OSINT & Threat Intelligence', category: 'Cyber Security', proficiency: 90, sortOrder: 8 },
    { name: 'Burp Suite & Network Recon', category: 'Cyber Security', proficiency: 94, sortOrder: 9 },
    { name: 'Vulnerability Disclosure', category: 'Cyber Security', proficiency: 96, sortOrder: 10 },

    // Full-Stack Web
    { name: 'Next.js & React 18', category: 'Full-Stack Web', proficiency: 92, sortOrder: 11 },
    { name: 'TypeScript & JavaScript', category: 'Full-Stack Web', proficiency: 94, sortOrder: 12 },
    { name: 'Prisma ORM & PostgreSQL', category: 'Full-Stack Web', proficiency: 90, sortOrder: 13 },
    { name: 'Tailwind CSS & Responsive UI', category: 'Full-Stack Web', proficiency: 95, sortOrder: 14 },
    { name: 'Node.js & REST / GraphQL APIs', category: 'Full-Stack Web', proficiency: 89, sortOrder: 15 },

    // 3D & Creative
    { name: 'Three.js & WebGL', category: '3D & Creative', proficiency: 88, sortOrder: 16 },
    { name: 'Source Filmmaker (SFM)', category: '3D & Creative', proficiency: 92, sortOrder: 17 },
    { name: 'Prisma3D Character Rigging', category: '3D & Creative', proficiency: 87, sortOrder: 18 },
    { name: 'Custom GLSL Shaders', category: '3D & Creative', proficiency: 82, sortOrder: 19 },
  ];

  await prisma.skill.deleteMany({});
  for (const s of skills) {
    await prisma.skill.create({ data: s });
  }
  console.log(`Seeded ${skills.length} skills.`);

  // 5. Certificates
  const certificates = [
    {
      title: 'HTB Certified Bug Bounty Hunter (CBBH)',
      issuer: 'Hack The Box',
      issueDate: '2025',
      credentialId: 'HTB-CBBH-CERT-VERIFIED',
      credentialUrl: 'https://academy.hackthebox.com',
      image: '/images/cert-cbbh.jpg',
      description: 'Kredensial profesional pengujian penetrasi aplikasi web tingkat lanjut, mencakup eksploitasi celah server-side, client-side, dan analisis kode sumber mendalam.',
      skills: ['Web Pentesting', 'Bug Bounty', 'OWASP Top 10', 'Exploitation'],
      sortOrder: 1,
    },
    {
      title: 'Deep Learning Specialization',
      issuer: 'DeepLearning.AI',
      issueDate: '2025',
      credentialId: 'COURSERA-DEEPLEARNING-AI',
      credentialUrl: 'https://coursera.org',
      image: '/images/cert-deeplearning.jpg',
      description: 'Spesialisasi 5-kursus mendalam yang dipimpin Dr. Andrew Ng, mencakup Convolutional Networks, Sequence Models, Optimasi Hyperparameter, dan Transformer Architectures.',
      skills: ['Neural Networks', 'CNN', 'RNN/LSTM', 'Transformers', 'PyTorch'],
      sortOrder: 2,
    },
    {
      title: 'Vulnerability Bug Finding Appreciation',
      issuer: 'detikcom IT Security',
      issueDate: '2025',
      credentialId: 'DETIKCOM-BUG-DISCLOSURE-2025',
      credentialUrl: 'https://detik.com',
      image: '/images/cert-detikcom.jpg',
      description: 'Apresiasi resmi dari tim keamanan IT detikcom atas pelaporan bertanggung jawab (responsible disclosure) terhadap celah kerentanan infrastruktur digital.',
      skills: ['Responsible Disclosure', 'Vulnerability Finding', 'Infrastructure Security'],
      sortOrder: 3,
    },
    {
      title: 'Google Cloud Machine Learning Engineer Track',
      issuer: 'Google Cloud Platform',
      issueDate: '2025',
      credentialId: 'GCP-MLE-BADGE',
      credentialUrl: 'https://cloud.google.com',
      image: '/images/cert-gcp-mle.jpg',
      description: 'Pelatihan perancangan pipeline end-to-end Machine Learning, dari feature engineering, model training pada Vertex AI, hingga deployment scalable.',
      skills: ['MLOps', 'Vertex AI', 'Cloud Pipeline', 'Model Serving'],
      sortOrder: 4,
    },
    {
      title: 'Neural Networks and Deep Learning',
      issuer: 'DeepLearning.AI',
      issueDate: '2024',
      credentialId: 'COURSERA-NN-DL-FOUNDATION',
      credentialUrl: 'https://coursera.org',
      image: '/images/cert-nn-deeplearning.jpg',
      description: 'Sertifikasi fondasi matematika dan implementasi neural network dari dasar menggunakan Python & vectorization NumPy.',
      skills: ['Forward/Backprop', 'Vectorization', 'Cost Optimization', 'Python'],
      sortOrder: 5,
    },
    {
      title: 'HVAC & Thermodynamics Control System',
      issuer: 'Vocational Engineering',
      issueDate: '2024',
      credentialId: 'HVAC-THERMO-SYSTEMS',
      credentialUrl: '',
      image: '/images/cert-hvac-thermo.jpg',
      description: 'Pemahaman prinsip perpindahan panas, siklus termodinamika, dan sistem kontrol instrumen industri.',
      skills: ['Thermodynamics', 'Control Loops', 'Industrial Instrumentation'],
      sortOrder: 6,
    },
  ];

  await prisma.certificate.deleteMany({});
  for (const c of certificates) {
    await prisma.certificate.create({ data: c });
  }
  console.log(`Seeded ${certificates.length} certificates.`);

  // 6. Experience
  const experiences = [
    {
      company: 'detikcom (Responsible Disclosure)',
      role: 'Security Researcher (Bug Hunter)',
      description: 'Menemukan dan melaporkan celah kerentanan keamanan pada infrastruktur digital detikcom secara etis. Laporan divalidasi dan ditutup oleh tim IT Security detikcom dengan apresiasi resmi.',
      startDate: '2025',
      endDate: '2025',
      current: false,
      location: 'Jakarta (Remote)',
      verified: true,
      sortOrder: 1,
    },
    {
      company: 'SMKN 3 Boyolangu',
      role: 'Visual Designer & Local Web Deployer',
      description: 'Merancang arsitektur visual interface, mengelola deployment web lokal, dan memimpin standarisasi visual sistem informasi jaringan internal.',
      startDate: '2024',
      endDate: '2025',
      current: false,
      location: 'Tulungagung',
      verified: true,
      sortOrder: 2,
    },
    {
      company: 'Infrastruktur Fiber Optik & Jaringan IT',
      role: 'Field Technician & Splicer',
      description: 'Operasi lapangan penarikan kabel fiber optik, fusion splicing presisi, pengujian sinyal dengan OTDR, serta instalasi perangkat jaringan access-layer.',
      startDate: '2024',
      endDate: '2024',
      current: false,
      location: 'Jawa Timur',
      verified: true,
      sortOrder: 3,
    },
  ];

  await prisma.experience.deleteMany({});
  for (const e of experiences) {
    await prisma.experience.create({ data: e });
  }
  console.log(`Seeded ${experiences.length} experiences.`);

  // 7. Education
  const educations = [
    {
      institution: 'SMKN 3 Boyolangu',
      program: 'Teknik Komputer dan Jaringan (TKJ)',
      description: 'Fokus intensif pada arsitektur jaringan komputer, administrasi server Linux/Windows, routing switching, fiber optik, dan dasar pengujian keamanan sistem.',
      startDate: '2023',
      endDate: '2026',
      logo: '/images/smkn3-logo.png',
      sortOrder: 1,
    },
  ];

  await prisma.education.deleteMany({});
  for (const ed of educations) {
    await prisma.education.create({ data: ed });
  }
  console.log(`Seeded ${educations.length} educations.`);

  // 8. Social Links
  const socialLinks = [
    { platform: 'GitHub', username: 'kangguruhdq-ux', url: 'https://github.com/kangguruhdq-ux', icon: 'github', sortOrder: 1 },
    { platform: 'LinkedIn', username: 'Mahabbah Mahabban Romadhon', url: 'https://linkedin.com', icon: 'linkedin', sortOrder: 2 },
    { platform: 'Instagram', username: '@mahabbah', url: 'https://instagram.com', icon: 'instagram', sortOrder: 3 },
  ];

  await prisma.socialLink.deleteMany({});
  for (const s of socialLinks) {
    await prisma.socialLink.create({ data: s });
  }
  console.log(`Seeded ${socialLinks.length} social links.`);

  // 9. Navigation Links
  const navigations = [
    { label: 'Profile', url: '/about', sortOrder: 1, isExternal: false, visible: true },
    { label: 'Portfolio', url: '/projects', sortOrder: 2, isExternal: false, visible: true },
    { label: 'Skills', url: '/skills', sortOrder: 3, isExternal: false, visible: true },
    { label: 'Experience', url: '/experience', sortOrder: 4, isExternal: false, visible: true },
    { label: 'Education', url: '/education', sortOrder: 5, isExternal: false, visible: true },
    { label: 'Certifications', url: '/certificates', sortOrder: 6, isExternal: false, visible: true },
    { label: 'Resume', url: '/resume', sortOrder: 7, isExternal: false, visible: true },
    { label: 'Contact', url: '/contact', sortOrder: 8, isExternal: false, visible: true },
  ];

  await prisma.navigation.deleteMany({});
  for (const n of navigations) {
    await prisma.navigation.create({ data: n });
  }
  console.log(`Seeded ${navigations.length} navigation items.`);

  // 10. SEO Settings
  await prisma.seoSetting.upsert({
    where: { id: 'seo_default' },
    update: {},
    create: {
      id: 'seo_default',
      siteTitle: 'Mahabbah Mahabban Romadhon — Machine Learning & Cyber Security Portfolio',
      metaDescription: 'Portofolio profesional Mahabbah Mahabban Romadhon. Spesialis Machine Learning (Computer Vision YOLOv8), Bug Bounty Hunter (CBBH), dan Full-Stack Developer.',
      keywords: 'Mahabbah Mahabban Romadhon, Machine Learning, Cyber Security, Bug Bounty, CBBH, YOLOv8, PyTorch, DeepLearning.AI, Next.js, Portfolio',
      ogTitle: 'Mahabbah Mahabban Romadhon — AI & Cyber Security Practitioner',
      ogDescription: 'Production-ready full-stack portfolio & research showcase in Machine Learning, Computer Vision, and Web Security.',
      ogImage: '/images/og-cover.jpg',
      favicon: '/images/tech/vercel.svg',
    },
  });
  console.log('SEO Settings initialized.');

  // 11. Initial Visitor Logs
  const visitorLogs = [
    {
      author: 'Bagus Kurniawan',
      role: 'SECURITY',
      message: 'Vulnerability bug finding di detikcom infra sudah diverifikasi dan mitigasi sukses di-deploy. Salut atas etika disclosure dan ketelitian analitisnya! Mantap bro.',
    },
    {
      author: 'Dr. Andrew Ng DeepLearning.AI Cohort',
      role: 'DEVELOPER',
      message: 'Solid execution on neural network architectures and mathematical reasoning. Excellent portfolio presentation and attention to detail!',
    },
    {
      author: 'Raditya Pratama',
      role: 'RECRUITER',
      message: 'Arsitektur web dan visualisasi 3D kosmiknya sangat memukau dan responsif. Penguasaan tech stack full-stack, AI, dan security-nya sangat relevan untuk tech industry.',
    },
    {
      author: 'Farhan Syahputra',
      role: 'CLIENT',
      message: 'Integrasi UI/UX dan animasi 3D Three.js terasa smooth banget di mobile dan desktop. Portofolio berstandar engineer kelas dunia!',
    },
  ];

  const existingLogsCount = await prisma.visitorLog.count();
  if (existingLogsCount === 0) {
    for (const v of visitorLogs) {
      await prisma.visitorLog.create({ data: v });
    }
    console.log(`Seeded ${visitorLogs.length} visitor logs.`);
  }

  console.log('Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
