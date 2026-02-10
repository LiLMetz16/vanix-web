"use client";

import Image from "next/image";

type Shareholder = {
  id: number;
  name: string;
  role: string;
  photo: string; // Path to photo - you can update this
  bio: string; // PLACEHOLDER - ADD YOUR TEXT HERE
  skills: string[];
};

export default function AboutPage() {
  // SHAREHOLDERS DATA - UPDATE THE TEXT HERE
  const shareholders: Shareholder[] = [
    {
      id: 1,
      name: "Anton Kabakov",
      role: "Co-Founder & Developer",
      photo: "/team/anton.jpg", // UPDATE: Add photo to /public/team/anton.jpg
      bio: "ADD YOUR TEXT HERE - Write Anton's biography, experience, and background. This is where you describe his role in the company and what he brings to Vanix.",
      skills: ["Full-Stack Development", "UI/UX Design", "Project Management"],
    },
    {
      id: 2,
      name: "Viktor Kanev",
      role: "Co-Founder & Developer",
      photo: "/team/viktor.jpg", // UPDATE: Add photo to /public/team/viktor.jpg
      bio: "ADD YOUR TEXT HERE - Write Viktor's biography, experience, and background. This is where you describe his role in the company and what he brings to Vanix.",
      skills: ["Backend Development", "Database Design", "System Architecture"],
    },
    // ADD MORE SHAREHOLDERS HERE IF NEEDED:
    // {
    //   id: 3,
    //   name: "Third Shareholder Name",
    //   role: "Position/Role",
    //   photo: "/team/person3.jpg",
    //   bio: "ADD YOUR TEXT HERE - Biography and description",
    //   skills: ["Skill 1", "Skill 2", "Skill 3"],
    // },
  ];

  return (
    <div className="min-h-screen py-10 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-md">
            About Vanix
          </h1>
          <p className="mt-4 text-lg text-white/90 max-w-3xl mx-auto">
            {/* UPDATE THIS TEXT */}
            ADD YOUR COMPANY DESCRIPTION HERE - Write about Vanix, your mission, 
            your vision, and what makes your company special. Describe your values 
            and what you aim to achieve.
          </p>
        </div>

        {/* Mission/Vision Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700">
              {/* UPDATE THIS TEXT */}
              ADD YOUR MISSION STATEMENT HERE - Describe what Vanix aims to do, 
              who you serve, and how you make a difference. Explain your core purpose.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-700">
              {/* UPDATE THIS TEXT */}
              ADD YOUR VISION STATEMENT HERE - Describe where you see Vanix going, 
              your long-term goals, and the future you're building towards.
            </p>
          </div>
        </div>

        {/* Shareholders Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Meet Our Team
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {shareholders.map((shareholder) => (
              <div
                key={shareholder.id}
                className="bg-white/90 backdrop-blur rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                {/* Photo Placeholder */}
                <div className="relative h-64 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  {/* 
                    TO ADD PHOTO: 
                    1. Create /public/team/ folder
                    2. Add photos: anton.jpg, viktor.jpg, etc.
                    3. Uncomment the Image component below and remove the placeholder div
                  */}
                  
                  {/* PLACEHOLDER - Remove this div when you add real photos */}
                  <div className="text-center">
                    <div className="w-32 h-32 bg-indigo-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-6xl">📷</span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Add photo to:<br />
                      <code className="bg-gray-200 px-2 py-1 rounded text-xs">
                        /public/team/{shareholder.name.toLowerCase().replace(' ', '-')}.jpg
                      </code>
                    </p>
                  </div>

                  {/* UNCOMMENT THIS WHEN YOU ADD PHOTOS:
                  <Image
                    src={shareholder.photo}
                    alt={shareholder.name}
                    fill
                    className="object-cover"
                  />
                  */}
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {shareholder.name}
                  </h3>
                  <p className="text-indigo-600 font-semibold mb-4">
                    {shareholder.role}
                  </p>

                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {shareholder.bio}
                  </p>

                  {/* Skills */}
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-900 mb-2">
                      Expertise:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {shareholder.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Our Values
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* VALUE 1 - UPDATE TEXT */}
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💎</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Quality First</h3>
              <p className="text-gray-700 text-sm">
                ADD YOUR TEXT HERE - Describe your commitment to quality
              </p>
            </div>

            {/* VALUE 2 - UPDATE TEXT */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-700 text-sm">
                ADD YOUR TEXT HERE - Describe your innovative approach
              </p>
            </div>

            {/* VALUE 3 - UPDATE TEXT */}
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Partnership</h3>
              <p className="text-gray-700 text-sm">
                ADD YOUR TEXT HERE - Describe how you work with clients
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to work with us?
          </h2>
          <div className="flex gap-4 justify-center">
            <a
              href="/contact"
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
            >
              Contact Us
            </a>
            <a
              href="/shop"
              className="px-6 py-3 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition border border-white/40"
            >
              View Services
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
