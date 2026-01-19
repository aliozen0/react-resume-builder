export const initialResumeState = {
  personalInfo: {
    fullName: "Ali Özen",
    email: "aliozen210@gmail.com",
    phone: "+90 505 052 10 60",
    location: "Ankara, Turkey",
    linkedin: "linkedin.com/in/ozenali",
    linkedinUrl: "https://linkedin.com/in/ozenali",
    github: "github.com/aliozen0",
    githubUrl: "https://github.com/aliozen0"
  },
  sections: [
    {
      id: "summary",
      title: "Professional Summary",
      type: "text",
      content: "Computer Engineering student with hands-on experience in AI and autonomous systems, seeking a Part-Time LLM Researcher or Engineer role. Specialized in LLMs, deep learning, computer vision, and simulation, leading award-winning teams and delivering impactful AI-powered solutions. Proficient in Python, Java, and experienced with TensorFlow, ROS, and Computer Vision technologies. Eager to contribute to software coding and design while learning the codebase and improving skills."
    },
    {
      id: "experience",
      title: "Experience",
      type: "entries",
      entries: [
        {
          id: 1,
          title: "ProudSec",
          subtitle: "AI Developer",
          date: "Mar 2025 - Jan 2026",
          description: [
            "Designed and implemented RAG-based LLM chatbots to provide intelligent user assistance.",
            "Optimized AI agents for specific tasks, ensuring high accuracy and efficient performance."
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
          title: "Gazi University",
          subtitle: "BSc in Computer Engineering(4th Year Student) - Ankara, Türkiye",
          date: "Sep 2021 - Present"
        }
      ]
    },
    {
      id: "courses",
      title: "Courses",
      type: "entries",
      entries: [
        {
          id: 1,
          title: "Digital Transformation Office of the Presidency of Türkiye",
          subtitle: "AI Talent Program (140 Hours)",
          date: "Jul 2024 - Sep 2024"
        },
        {
          id: 2,
          title: "Coursera",
          subtitle: "Neural Networks and Deep Learning",
          date: "Jan 2023 - Jan 2023"
        }
      ]
    },
    {
      id: "skills",
      title: "Skills",
      type: "skills",
      list: [
        { label: "Programming Languages", value: "Python, Java, Basic Programming" },
        { label: "Computer Vision & Image Processing", value: "YOLO, OpenCV, Computer Vision, Image Recognition" },
        { label: "AI and Machine Learning", value: "LLM, RAG, Deep Learning, TensorFlow, PyTorch, Neural Networks, Natural Language Processing, LangChain, Federated Learning, Reinforcement Learning" },
        { label: "Robotics and Simulation", value: "ROS (Robot Operating System), Gazebo Simulation, Autonomous Systems" },
        { label: "Development Tools", value: "Git, Linux, Docker" },
        { label: "Leadership and Management", value: "Team Leadership, Project Management, Cross-functional Collaboration, Agile Methodologies" },
        { label: "Soft Skills", value: "Problem-solving, Detail-oriented, Enthusiastic, Self-motivated, Able to follow instructions" }
      ]
    },
    {
      id: "languages",
      title: "Languages",
      type: "skills",
      list: [
        { label: "Turkish", value: "Native speaker" },
        { label: "English", value: "Advanced" }
      ]
    },
    {
      id: "achievements",
      title: "Achievements",
      type: "list",
      items: [
        "Finalist, TEKNOFEST Robotaxi (2024 & 2025)",
        "Winner, University4Society (2024) – Led AI-based innovation project(ODTÜ)",
        "Top 5 in Turkey, Top 900 Globally – IEEE Xtreme 17.0 & 18.0 Algorithm Competitions, solving 20+ complex problems in 24 hours",
        "2nd Place, Turkey AI Awards (2024) – Most Innovative AI Application",
        "3rd Place, Y³ KANGAL Challenge (2023) – AI for Autonomous Systems (SSB & HAVELSAN)"
      ]
    },
    {
      id: "leadership",
      title: "Leadership & Community Involvement",
      type: "list",
      items: [
        "Team Captain, HÜMA Rover – TEKNOFEST (2024–2025) – Managed team of 15+ members, coordinated project timelines and technical implementation",
        "Vice President & Executive Board Member, IEEE Gazi Student Branch (2023–2025) – Organized 10+ technical workshops with 700+ attendees",
        "Project Coordinator, IEEE Computer Society Turkey Student Section (2024)",
        "Mentor, Global AI Hub – Artificial Intelligence & Python (2024)"
      ]
    }
  ]
};
