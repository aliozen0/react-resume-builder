export const initialResumeState = {
  personalInfo: {
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 8900",
    location: "New York, USA",
    linkedin: "linkedin.com/in/johndoe",
    linkedinUrl: "https://linkedin.com/in/johndoe",
    github: "github.com/johndoe",
    githubUrl: "https://github.com/johndoe"
  },
  sections: [
    {
      id: "summary",
      title: "Professional Summary",
      type: "text",
      content: "Experienced Software Engineer with a strong background in developing scalable web applications and working with modern technologies. Proven track record of delivering high-quality code and collaborating effectively in cross-functional teams. Passionate about problem-solving and continuous learning."
    },
    {
      id: "experience",
      title: "Experience",
      type: "entries",
      entries: [
        {
          id: 1,
          title: "Tech Solutions Inc.",
          subtitle: "Senior Software Engineer",
          date: "Jan 2020 - Present",
          description: [
            "Led the development of a flagship e-commerce platform, increasing user engagement by 30%.",
            "Mentored junior developers and conducted code reviews to ensure code quality."
          ]
        },
        {
          id: 2,
          title: "WebCorp",
          subtitle: "Software Developer",
          date: "Jun 2017 - Dec 2019",
          description: [
            "Developed and maintained various client websites using React and Node.js.",
            "Collaborated with designers to implement responsive user interfaces."
          ]
        }
      ]
    },
    {
      id: "education",
      title: "Education",
      type: "entries",
      entries: [
        {
          id: 1,
          title: "University of Technology",
          subtitle: "B.Sc. in Computer Science",
          date: "Sep 2013 - May 2017"
        }
      ]
    },
    {
      id: "skills",
      title: "Skills",
      type: "skills",
      list: [
        { label: "Programming Languages", value: "JavaScript, Python, Java, C++" },
        { label: "Web Technologies", value: "React, Node.js, HTML, CSS, TypeScript" },
        { label: "Tools & Platforms", value: "Git, Docker, AWS, Linux" }
      ]
    },
    {
      id: "languages",
      title: "Languages",
      type: "skills",
      list: [
        { label: "English", value: "Native" },
        { label: "Spanish", value: "Intermediate" }
      ]
    },
    {
      id: "achievements",
      title: "Achievements",
      type: "list",
      items: [
        "Employee of the Month (Tech Solutions Inc., 2021)",
        "Winner of the 2019 Internal Hackathon"
      ]
    }
  ]
};
