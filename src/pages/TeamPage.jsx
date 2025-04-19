import { Github, Linkedin, Mail } from 'lucide-react';

export default function TeamPage() {
  const teamMembers = [
    {
      name: "Gökhan Özdemir",
      role: "Project Manager",
      image: "https://media.licdn.com/dms/image/C4D03AQFj_3YnPrVqfw/profile-displayphoto-shrink_800_800/0/1653412308656?e=1716422400&v=beta&t=bWL-Ug_B9qWR1pLfp3TQnXGJG4Yw_CKT9FNzGQXNRwY",
      linkedin: "https://www.linkedin.com/in/gokhan-ozdemir/",
      github: "https://github.com/gokhanozdemir",
      email: "mailto:gokhan@workintech.com.tr"
    },
    {
      name: "John Doe",
      role: "Full Stack Developer",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      linkedin: "#",
      github: "#",
      email: "mailto:john@lotus.com"
    },
    {
      name: "Jane Doe",
      role: "UI/UX Designer",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      linkedin: "#",
      github: "#",
      email: "mailto:jane@lotus.com"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The passionate individuals behind LOTUS, working together to bring you the best in fashion.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-48 h-48 rounded-full mx-auto object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
              <p className="text-gray-600 mb-4">{member.role}</p>
              <div className="flex justify-center space-x-4">
                <a href={member.linkedin} className="text-gray-600 hover:text-blue-600" target="_blank" rel="noopener noreferrer">
                  <Linkedin size={20} />
                </a>
                <a href={member.github} className="text-gray-600 hover:text-gray-900" target="_blank" rel="noopener noreferrer">
                  <Github size={20} />
                </a>
                <a href={member.email} className="text-gray-600 hover:text-red-600">
                  <Mail size={20} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h1>
          <p className="text-gray-600">
            The passionate individuals behind LOTUS, working together to bring you the best in fashion.
          </p>
        </div>

        <div className="space-y-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center">
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
              <p className="text-gray-600 mb-3">{member.role}</p>
              <div className="flex justify-center space-x-4">
                <a href={member.linkedin} className="text-gray-600 hover:text-blue-600" target="_blank" rel="noopener noreferrer">
                  <Linkedin size={20} />
                </a>
                <a href={member.github} className="text-gray-600 hover:text-gray-900" target="_blank" rel="noopener noreferrer">
                  <Github size={20} />
                </a>
                <a href={member.email} className="text-gray-600 hover:text-red-600">
                  <Mail size={20} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}