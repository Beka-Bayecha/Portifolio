import jsPDF from 'jspdf';

export const generateResumePDF = () => {
  const pdf = new jsPDF();
  
  // Set font
  pdf.setFont('helvetica');
  
  // Header
  pdf.setFontSize(24);
  pdf.setTextColor(30, 64, 175); // Blue color
  pdf.text('BEKA BAYECHA', 105, 30, { align: 'center' });
  
  pdf.setFontSize(14);
  pdf.setTextColor(100, 116, 139); // Gray color
  pdf.text('Full Stack Developer | IT Student', 105, 40, { align: 'center' });
  
  // Contact Info
  pdf.setFontSize(10);
  pdf.setTextColor(71, 85, 105);
  pdf.text('📧 bekibekinat@gmail.com | 📱 0916020569', 105, 50, { align: 'center' });
  pdf.text('🔗 github.com/beka-bayecha | 💬 @beckya53', 105, 57, { align: 'center' });
  
  let yPosition = 75;
  
  // Education Section
  pdf.setFontSize(16);
  pdf.setTextColor(30, 64, 175);
  pdf.text('EDUCATION', 20, yPosition);
  pdf.line(20, yPosition + 2, 190, yPosition + 2);
  
  yPosition += 12;
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Haramaya University', 20, yPosition);
  yPosition += 7;
  pdf.setFontSize(10);
  pdf.setTextColor(107, 114, 128);
  pdf.text('Bachelor\'s Degree in Information Technology (In Progress)', 20, yPosition);
  yPosition += 5;
  pdf.text('Expected Graduation: 2026', 20, yPosition);
  
  yPosition += 15;
  
  // Technical Skills Section
  pdf.setFontSize(16);
  pdf.setTextColor(30, 64, 175);
  pdf.text('TECHNICAL SKILLS', 20, yPosition);
  pdf.line(20, yPosition + 2, 190, yPosition + 2);
  
  yPosition += 12;
  pdf.setFontSize(11);
  pdf.setTextColor(0, 0, 0);
  
  const skills = [
    'Frontend: React.js, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS',
    'Backend: Node.js, Express.js, PHP, RESTful APIs',
    'Databases: MySQL, MongoDB, Database Design',
    'Mobile: React Native, Cross-platform Development',
    'Tools: Git, GitHub, Vite, Firebase, Vercel'
  ];
  
  skills.forEach(skill => {
    pdf.text(`• ${skill}`, 25, yPosition);
    yPosition += 7;
  });
  
  yPosition += 8;
  
  // Projects Section
  pdf.setFontSize(16);
  pdf.setTextColor(30, 64, 175);
  pdf.text('PROJECTS', 20, yPosition);
  pdf.line(20, yPosition + 2, 190, yPosition + 2);
  
  yPosition += 12;
  
  const projects = [
    {
      title: 'Church Management System',
      tech: 'React, Node.js, MySQL, Express.js',
      description: 'Full-stack system for managing church members, events, and resources.',
      url: 'shinofullgospel-church.vercel.app'
    },
    {
      title: 'School Management System',
      tech: 'React, Node.js, MongoDB, Express.js',
      description: 'Comprehensive platform for student records and administration.',
      url: 'shinohigh-school.vercel.app'
    },
    {
      title: 'Portfolio Website',
      tech: 'React, TypeScript, Tailwind CSS, Framer Motion',
      description: 'Modern responsive portfolio with animations and dark mode.',
      url: ''
    }
  ];
  
  projects.forEach(project => {
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(project.title, 20, yPosition);
    
    yPosition += 6;
    pdf.setFontSize(10);
    pdf.setTextColor(107, 114, 128);
    pdf.text(project.tech, 20, yPosition);
    
    yPosition += 5;
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    const descLines = pdf.splitTextToSize(project.description, 170);
    pdf.text(descLines, 20, yPosition);
    yPosition += descLines.length * 5;
    
    if (project.url) {
      pdf.setTextColor(37, 99, 235);
      pdf.text(`🔗 ${project.url}`, 20, yPosition);
      yPosition += 5;
    }
    
    yPosition += 8;
  });
  
  // Experience Section
  if (yPosition > 250) {
    pdf.addPage();
    yPosition = 30;
  }
  
  pdf.setFontSize(16);
  pdf.setTextColor(30, 64, 175);
  pdf.text('EXPERIENCE', 20, yPosition);
  pdf.line(20, yPosition + 2, 190, yPosition + 2);
  
  yPosition += 12;
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Freelance Full Stack Developer', 20, yPosition);
  
  yPosition += 6;
  pdf.setFontSize(10);
  pdf.setTextColor(107, 114, 128);
  pdf.text('2023 - Present', 20, yPosition);
  
  yPosition += 8;
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  
  const experiences = [
    'Developed and deployed multiple production web applications',
    'Created responsive user interfaces with modern design principles',
    'Built robust backend systems with secure authentication',
    'Collaborated with clients to deliver custom solutions'
  ];
  
  experiences.forEach(exp => {
    pdf.text(`• ${exp}`, 25, yPosition);
    yPosition += 6;
  });
  
  yPosition += 10;
  
  // Achievements
  pdf.setFontSize(16);
  pdf.setTextColor(30, 64, 175);
  pdf.text('ACHIEVEMENTS', 20, yPosition);
  pdf.line(20, yPosition + 2, 190, yPosition + 2);
  
  yPosition += 12;
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  
  const achievements = [
    'Successfully deployed 2+ production web applications',
    'Built 5+ web applications using modern technologies',
    'Developed 1+ mobile application',
    'Created 4+ backend APIs with proper documentation'
  ];
  
  achievements.forEach(achievement => {
    pdf.text(`• ${achievement}`, 25, yPosition);
    yPosition += 6;
  });
  
  // Download the PDF
  pdf.save('Beka_Bayecha_Resume.pdf');
};