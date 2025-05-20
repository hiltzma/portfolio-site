import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { AdminPanelProps } from "./lib/types";
import { Id } from "../convex/_generated/dataModel";

interface FileUploadInputProps {
  onChange: (file: File) => void;
  accept?: string;
  label?: string;
}

export function AdminPanel({ profile, certificates, achievements, education }: AdminPanelProps) {
  // Existing mutations
  const saveProfile = useMutation(api.profile.save);
  const addCertificate = useMutation(api.certificates.add);
  const removeCertificate = useMutation(api.certificates.remove);
  const addAchievement = useMutation(api.achievements.add);
  const removeAchievement = useMutation(api.achievements.remove);
  const addEducation = useMutation(api.education.add);
  const removeEducation = useMutation(api.education.remove);
  
  // Upload URL generators
  const generateProfileUploadUrl = useMutation(api.profile.generateUploadUrl);
  const generateEducationUploadUrl = useMutation(api.education.generateUploadUrl);
  const generateCertificateUploadUrl = useMutation(api.certificates.generateUploadUrl);
  const generateAchievementUploadUrl = useMutation(api.achievements.generateUploadUrl);

  // Existing state
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState(profile || {
    name: "",
    title: "",
    bio: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    links: [],
    profileImageId: undefined as Id<"_storage"> | undefined,
    bannerImageId: undefined as Id<"_storage"> | undefined
  });

  const [newEducation, setNewEducation] = useState({
    school: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    description: "",
    location: "",
    attachmentId: undefined as Id<"_storage"> | undefined
  });

  const [newCertificate, setNewCertificate] = useState({
    name: "",
    issuer: "",
    date: "",
    description: "",
    url: "",
    attachmentId: undefined as Id<"_storage"> | undefined
  });

  const [newAchievement, setNewAchievement] = useState({
    title: "",
    date: "",
    description: "",
    attachmentId: undefined as Id<"_storage"> | undefined
  });

  // Generic file upload handler
  const handleFileUpload = async (
    file: File,
    generateUrl: () => Promise<string>,
    onSuccess: (storageId: Id<"_storage">) => void
  ) => {
    try {
      const postUrl = await generateUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      
      if (!result.ok) {
        throw new Error(`Upload failed: ${await result.text()}`);
      }
      
      const { storageId } = await result.json();
      onSuccess(storageId);
      toast.success("File uploaded successfully");
    } catch (err) {
      toast.error("Failed to upload file");
    }
  };

  // Existing handlers with file upload support
  const handleEducationFileUpload = async (file: File) => {
    await handleFileUpload(
      file,
      () => generateEducationUploadUrl(),
      (storageId) => setNewEducation(prev => ({ ...prev, attachmentId: storageId }))
    );
  };

  const handleCertificateFileUpload = async (file: File) => {
    await handleFileUpload(
      file,
      () => generateCertificateUploadUrl(),
      (storageId) => setNewCertificate(prev => ({ ...prev, attachmentId: storageId }))
    );
  };

  const handleAchievementFileUpload = async (file: File) => {
    await handleFileUpload(
      file,
      () => generateAchievementUploadUrl(),
      (storageId) => setNewAchievement(prev => ({ ...prev, attachmentId: storageId }))
    );
  };

  // Existing handlers
  const handleImageUpload = async (file: File, type: 'profile' | 'banner') => {
    try {
      const postUrl = await generateProfileUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      
      if (!result.ok) {
        throw new Error(`Upload failed: ${await result.text()}`);
      }
      
      const { storageId } = await result.json();
      setProfileData(prev => ({
        ...prev,
        [type === 'profile' ? 'profileImageId' : 'bannerImageId']: storageId as Id<"_storage">
      }));
      
      toast.success(`${type === 'profile' ? 'Profile' : 'Banner'} image uploaded`);
    } catch (err) {
      toast.error(`Failed to upload ${type} image`);
    }
  };

  const handleProfileSave = async () => {
    try {
      await saveProfile(profileData);
      setEditingProfile(false);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error("Failed to save profile");
    }
  };

  const handleAddEducation = async () => {
    try {
      await addEducation(newEducation);
      setNewEducation({
        school: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        description: "",
        location: "",
        attachmentId: undefined
      });
      toast.success("Education added!");
    } catch (err) {
      toast.error("Failed to add education");
    }
  };

  const handleAddCertificate = async () => {
    try {
      await addCertificate(newCertificate);
      setNewCertificate({
        name: "",
        issuer: "",
        date: "",
        description: "",
        url: "",
        attachmentId: undefined
      });
      toast.success("Certificate added!");
    } catch (err) {
      toast.error("Failed to add certificate");
    }
  };

  const handleAddAchievement = async () => {
    try {
      await addAchievement(newAchievement);
      setNewAchievement({
        title: "",
        date: "",
        description: "",
        attachmentId: undefined
      });
      toast.success("Achievement added!");
    } catch (err) {
      toast.error("Failed to add achievement");
    }
  };

  // File upload input component
  const FileUploadInput = ({ onChange, accept = "*/*", label = "Attachment" }: FileUploadInputProps) => (
    <div className="space-y-2">
      <label className="block text-gray-400">{label}</label>
      <input
        type="file"
        accept={accept}
        onChange={(e) => e.target.files?.[0] && onChange(e.target.files[0])}
        className="block w-full text-sm text-gray-400
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-red-500 file:text-white
          hover:file:bg-red-600"
      />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-8">
      {/* Profile Section */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-red-500">Profile</h2>
        {editingProfile ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-gray-400">Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'profile')}
                  className="block w-full text-sm text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-red-500 file:text-white
                    hover:file:bg-red-600"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-gray-400">Banner Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'banner')}
                  className="block w-full text-sm text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-red-500 file:text-white
                    hover:file:bg-red-600"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-gray-200"
                value={profileData.name}
                onChange={e => setProfileData({...profileData, name: e.target.value})}
              />
              <input
                type="text"
                placeholder="Title"
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-gray-200"
                value={profileData.title}
                onChange={e => setProfileData({...profileData, title: e.target.value})}
              />
            </div>
            <textarea
              placeholder="Bio"
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-gray-200"
              value={profileData.bio}
              onChange={e => setProfileData({...profileData, bio: e.target.value})}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-gray-200"
                value={profileData.email}
                onChange={e => setProfileData({...profileData, email: e.target.value})}
              />
              <input
                type="tel"
                placeholder="Phone"
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-gray-200"
                value={profileData.phone || ""}
                onChange={e => setProfileData({...profileData, phone: e.target.value})}
              />
              <input
                type="text"
                placeholder="Location"
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-gray-200"
                value={profileData.location || ""}
                onChange={e => setProfileData({...profileData, location: e.target.value})}
              />
              <input
                type="url"
                placeholder="Website"
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-gray-200"
                value={profileData.website || ""}
                onChange={e => setProfileData({...profileData, website: e.target.value})}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleProfileSave}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Save
              </button>
              <button
                onClick={() => setEditingProfile(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-gray-300">
            <p><strong className="text-gray-200">Name:</strong> {profile?.name}</p>
            <p><strong className="text-gray-200">Title:</strong> {profile?.title}</p>
            <p><strong className="text-gray-200">Bio:</strong> {profile?.bio}</p>
            <p><strong className="text-gray-200">Email:</strong> {profile?.email}</p>
            <p><strong className="text-gray-200">Phone:</strong> {profile?.phone || 'Not set'}</p>
            <p><strong className="text-gray-200">Location:</strong> {profile?.location || 'Not set'}</p>
            <p><strong className="text-gray-200">Website:</strong> {profile?.website || 'Not set'}</p>
            <button
              onClick={() => setEditingProfile(true)}
              className="px-4 py-2 mt-4 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Edit
            </button>
          </div>
        )}
      </div>

      {/* Education Section */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-red-500">Education</h2>
        <div className="space-y-4 mb-8">
          {education?.map(edu => (
            <div key={edu._id} className="flex justify-between items-start p-4 border border-gray-700 rounded bg-gray-800">
              <div className="text-gray-300">
                <h3 className="font-semibold text-gray-200">{edu.school}</h3>
                <p className="text-red-400">{edu.degree} in {edu.field}</p>
                <p className="text-sm text-gray-400">
                  {edu.startDate} - {edu.endDate || 'Present'} • {edu.location}
                </p>
                <p className="mt-2">{edu.description}</p>
                {edu.attachmentUrl && (
                  <a
                    href={edu.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-400 hover:text-red-300 mt-2 inline-flex items-center gap-1"
                  >
                    View Attachment
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
              <button
                onClick={() => removeEducation({ id: edu._id })}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="School"
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-gray-200"
              value={newEducation.school}
              onChange={e => setNewEducation({...newEducation, school: e.target.value})}
            />
            <input
              type="text"
              placeholder="Location"
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-gray-200"
              value={newEducation.location}
              onChange={e => setNewEducation({...newEducation, location: e.target.value})}
            />
            <input
              type="text"
              placeholder="Degree"
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-gray-200"
              value={newEducation.degree}
              onChange={e => setNewEducation({...newEducation, degree: e.target.value})}
            />
            <input
              type="text"
              placeholder="Field of Study"
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-gray-200"
              value={newEducation.field}
              onChange={e => setNewEducation({...newEducation, field: e.target.value})}
            />
            <input
              type="date"
              placeholder="Start Date"
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-gray-200"
              value={newEducation.startDate}
              onChange={e => setNewEducation({...newEducation, startDate: e.target.value})}
            />
            <input
              type="date"
              placeholder="End Date (leave empty if current)"
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-gray-200"
              value={newEducation.endDate}
              onChange={e => setNewEducation({...newEducation, endDate: e.target.value})}
            />
          </div>
          <textarea
            placeholder="Description"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-gray-200"
            value={newEducation.description}
            onChange={e => setNewEducation({...newEducation, description: e.target.value})}
          />
          <FileUploadInput
            onChange={handleEducationFileUpload}
            accept=".pdf,.doc,.docx"
            label="Education Document"
          />
          <button
            onClick={handleAddEducation}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Add Education
          </button>
        </div>
      </div>

      {/* Certificates Section */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-red-500">Certificates</h2>
        <div className="space-y-4 mb-8">
          {certificates?.map(cert => (
            <div key={cert._id} className="flex justify-between items-start p-4 border border-gray-700 rounded bg-gray-800">
              <div className="text-gray-300">
                <h3 className="font-semibold text-gray-200">{cert.name}</h3>
                <p className="text-sm text-gray-400">{cert.issuer} - {cert.date}</p>
                <p>{cert.description}</p>
                {cert.url && <a href={cert.url} className="text-red-400 hover:text-red-300 block mt-1">View Certificate URL</a>}
                {cert.attachmentUrl && (
                  <a
                    href={cert.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-400 hover:text-red-300 mt-1 inline-flex items-center gap-1"
                  >
                    View Certificate File
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
              <button
                onClick={() => removeCertificate({ id: cert._id })}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Certificate Name"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-gray-200"
            value={newCertificate.name}
            onChange={e => setNewCertificate({...newCertificate, name: e.target.value})}
          />
          <input
            type="text"
            placeholder="Issuer"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-gray-200"
            value={newCertificate.issuer}
            onChange={e => setNewCertificate({...newCertificate, issuer: e.target.value})}
          />
          <input
            type="date"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-gray-200"
            value={newCertificate.date}
            onChange={e => setNewCertificate({...newCertificate, date: e.target.value})}
          />
          <textarea
            placeholder="Description"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-gray-200"
            value={newCertificate.description}
            onChange={e => setNewCertificate({...newCertificate, description: e.target.value})}
          />
          <input
            type="url"
            placeholder="Certificate URL (optional)"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-gray-200"
            value={newCertificate.url}
            onChange={e => setNewCertificate({...newCertificate, url: e.target.value})}
          />
          <FileUploadInput
            onChange={handleCertificateFileUpload}
            accept=".pdf,.jpg,.jpeg,.png"
            label="Certificate File"
          />
          <button
            onClick={handleAddCertificate}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Add Certificate
          </button>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-red-500">Achievements</h2>
        <div className="space-y-4 mb-8">
          {achievements?.map(achievement => (
            <div key={achievement._id} className="flex justify-between items-start p-4 border border-gray-700 rounded bg-gray-800">
              <div className="text-gray-300">
                <h3 className="font-semibold text-gray-200">{achievement.title}</h3>
                <p className="text-sm text-gray-400">{achievement.date}</p>
                <p>{achievement.description}</p>
                {achievement.attachmentUrl && (
                  <a
                    href={achievement.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-400 hover:text-red-300 mt-2 inline-flex items-center gap-1"
                  >
                    View Attachment
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
              <button
                onClick={() => removeAchievement({ id: achievement._id })}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Achievement Title"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-gray-200"
            value={newAchievement.title}
            onChange={e => setNewAchievement({...newAchievement, title: e.target.value})}
          />
          <input
            type="date"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-gray-200"
            value={newAchievement.date}
            onChange={e => setNewAchievement({...newAchievement, date: e.target.value})}
          />
          <textarea
            placeholder="Description"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-gray-200"
            value={newAchievement.description}
            onChange={e => setNewAchievement({...newAchievement, description: e.target.value})}
          />
          <FileUploadInput
            onChange={handleAchievementFileUpload}
            accept=".pdf,.jpg,.jpeg,.png"
            label="Achievement Document"
          />
          <button
            onClick={handleAddAchievement}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Add Achievement
          </button>
        </div>
      </div>
    </div>
  );
}
