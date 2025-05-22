import { PublicViewProps } from "./lib/types";

export function PublicView({ profile, certificates, achievements, education }: PublicViewProps) {
  return (
    <div>
      <div 
        className="h-64 bg-gradient-to-r from-gray-900 to-black relative"
        style={profile.bannerImageUrl ? {
          backgroundImage: `url(${profile.bannerImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : undefined}
      >
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0">
          <div className="w-40 h-40 rounded-full border-4 border-black overflow-hidden bg-gray-800">
            {profile.profileImageUrl ? (
              <img src={profile.profileImageUrl} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl text-gray-600">
                {profile.name.charAt(0)}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-24 md:mt-8 mb-12 md:ml-48">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-red-500">{profile.name}</h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-4">{profile.title}</p>
          <p className="max-w-2xl text-gray-300 text-lg leading-relaxed">{profile.bio}</p>
          
          <div className="mt-6 flex flex-wrap gap-4">
            <a href={`mailto:${profile.email}`} className="flex items-center gap-2 text-red-400 hover:text-red-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {profile.email}
            </a>
            {profile.phone && (
              <a href={`tel:${profile.phone}`} className="flex items-center gap-2 text-red-400 hover:text-red-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {profile.phone}
              </a>
            )}
            {profile.location && (
              <span className="flex items-center gap-2 text-gray-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {profile.location}
              </span>
            )}
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-red-400 hover:text-red-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Website
              </a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-200 flex items-center gap-2">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
                Education
              </h2>
              <div className="space-y-6">
                {education?.map(edu => (
                  <div key={edu._id} className="p-6 border border-gray-800 rounded-lg bg-gray-900/50 backdrop-blur">
                    <h3 className="font-semibold text-xl text-gray-200 mb-1">{edu.school}</h3>
                    <p className="text-red-400 font-medium">{edu.degree} in {edu.field}</p>
                    <p className="text-sm text-gray-400 mb-3">
                      {edu.startDate} - {edu.endDate || 'Present'} • {edu.location}
                    </p>
                    <p className="text-gray-300 leading-relaxed">{edu.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 text-gray-200 flex items-center gap-2">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                Achievements
              </h2>
              <div className="space-y-6">
                {achievements?.map(achievement => (
                  <div key={achievement._id} className="p-6 border border-gray-800 rounded-lg bg-gray-900/50 backdrop-blur">
                    <h3 className="font-semibold text-xl text-gray-200 mb-1">{achievement.title}</h3>
                    <p className="text-sm text-gray-400 mb-3">{achievement.date}</p>
                    <p className="text-gray-300 leading-relaxed">{achievement.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div>
            <section>
              <h2 className="text-2xl font-bold mb-6 text-gray-200 flex items-center gap-2">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Certificates
              </h2>
              <div className="space-y-4">
                {certificates?.map(cert => (
                  <div key={cert._id} className="p-4 border border-gray-800 rounded-lg bg-gray-900/50 backdrop-blur">
                    <h3 className="font-semibold text-gray-200 mb-1">{cert.name}</h3>
                    <p className="text-sm text-gray-400">{cert.issuer} - {cert.date}</p>
                    <p className="mt-2 text-gray-300 text-sm">{cert.description}</p>
                    {cert.url && (
                      <a 
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="text-red-400 hover:text-red-300 mt-2 inline-flex items-center gap-1 text-sm"
                      >
                        View Certificate
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
