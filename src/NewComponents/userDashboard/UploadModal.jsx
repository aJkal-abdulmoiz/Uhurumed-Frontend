// import { useState } from 'react';
// import { Upload } from 'lucide-react';
// import { uploadFile } from '@/queries/upload/upload';
// import { useAuthStore } from '@/stores/authStore';
// import { updateProfile } from '@/queries/DoctorQueries/update';

// export function UploadDocumentModal({ isOpen, onClose }) {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [recordType, setRecordType] = useState('');
//   const [fileUrl, setFileUrl] = useState(null);
//   // SEARCH: Add loading state
//   // REPLACE: Add loading state for file upload
//   const [isUploading, setIsUploading] = useState(false);
//   const [selectedFileName, setSelectedFileName] = useState('');
//   const { user } = useAuthStore.getState();

//   if (!isOpen) return null;

//   const handleSubmit = async () => {
//     console.log({ description, recordType, fileUrl });
//     const response = await updateProfile({
//       medicalRecords: {
//         create: [{
//           description,
//           recordType,
//           fileUrl,
//         }]
//       }
//     });
//     console.log(response);
//     onClose();
//   };

//   console.log(fileUrl);

//   const handleFileChange = async (event) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     const userFolder = user.userType === 'DOCTOR' ? 'Doctor' : 'Patient';

//     // SEARCH: Start of file upload logic
//     // REPLACE: Add loading state and file name tracking
//     try {
//       setIsUploading(true);
//       setSelectedFileName(file.name);
//       const uploadedUrl = await uploadFile(file, userFolder);
//       console.log('File URL:', uploadedUrl);
//       setFileUrl(uploadedUrl.data);
//     } catch (err) {
//       console.error(err);
//       setSelectedFileName('');
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//           aria-label="Close"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             className="h-6 w-6"
//           >
//             <path d="M18 6 6 18" />
//             <path d="m6 6 12 12" />
//           </svg>
//         </button>

//         <div className="text-center mb-4">
//           <h2 className="text-2xl font-bold text-gray-900">Upload Documents</h2>
//         </div>

//         <div className="grid gap-4 py-4">
//           <div className="space-y-2">
//             <label htmlFor="description" className="text-sm font-medium text-gray-700">
//               Title
//             </label>
//             <input
//               id="description"
//               placeholder="Title"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors"
//             />
//           </div>
//           <div className="space-y-2">
//             <label htmlFor="record-type" className="text-sm font-medium text-gray-700">
//               Record Type
//             </label>
//             <div className="flex flex-col sm:flex-row sm:items-center gap-3">
//               <select
//                 id="record-type"
//                 value={recordType}
//                 onChange={(e) => setRecordType(e.target.value)}
//                 className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors appearance-none pr-8"
//               >
//                 <option value="">Select Record Type</option>
//                 <option value="medical-report">Medical Report</option>
//                 <option value="lab-results">Lab Results</option>
//                 <option value="prescription">Prescription</option>
//                 <option value="other">Other</option>
//               </select>
//               <label
//                 htmlFor="file-upload"
//                 className="whitespace-nowrap bg-[#00AAEE] text-white px-4 py-2.5 rounded-full font-medium cursor-pointer hover:bg-[#0099DD] transition-colors flex items-center space-x-2"
//               >
//                 <Upload className="h-4 w-4 shrink-0" />
//                 {/* SEARCH: Upload button text */}
//                 {/* REPLACE: Show loading state or upload text */}
//                 <span className="truncate">{isUploading ? 'Uploading...' : 'Upload Files'}</span>
//                 <input
//                   id="file-upload"
//                   type="file"
//                   className="hidden"
//                   accept="application/pdf"
//                   onChange={handleFileChange}
//                 />
//               </label>
//             </div>
//             {/* SEARCH: File selection feedback */}
//             {/* REPLACE: Enhanced file selection feedback */}
//             {isUploading && (
//               <p className="text-sm text-gray-500 mt-1">
//                 Uploading {selectedFileName}...
//               </p>
//             )}
//             {fileUrl && !isUploading && (
//               <p className="text-sm text-green-600 mt-1">
//                 Selected: {selectedFileName}
//               </p>
//             )}
//           </div>
//         </div>
//         <div className="mt-6">
//           <button
//             type="submit"
//             onClick={handleSubmit}
//             // SEARCH: Submit button
//             // REPLACE: Disable submit button during upload
//             disabled={isUploading}
//             className={`w-full px-6 py-3 bg-[#00AAEE] text-white rounded-full font-medium hover:bg-[#0099DD] transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''} `}
//           >
//             Submit
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState } from 'react';
import { Upload } from 'lucide-react';
import { uploadFile } from '@/queries/upload/upload';
import { useAuthStore } from '@/stores/authStore';
import { updateProfile } from '@/queries/DoctorQueries/update';

export function UploadDocumentModal({ isOpen, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [recordType, setRecordType] = useState('');
  const [fileUrl, setFileUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  // SEARCH: Add loading state
  // REPLACE: Add loading states for file upload and submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthStore.getState();

  if (!isOpen) return null;

  const handleSubmit = async () => {
    console.log({ description, recordType, fileUrl });
    // SEARCH: Start of submit logic
    // REPLACE: Add submitting state
    try {
      setIsSubmitting(true);
      const response = await updateProfile({
        medicalRecords: {
          create: [{
            description,
            recordType,
            fileUrl,
          }]
        }
      });
      console.log(response);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log(fileUrl);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const userFolder = user.userType === 'DOCTOR' ? 'Doctor' : 'Patient';

    try {
      setIsUploading(true);
      setSelectedFileName(file.name);
      const uploadedUrl = await uploadFile(file, userFolder);
      console.log('File URL:', uploadedUrl);
      setFileUrl(uploadedUrl.data);
    } catch (err) {
      console.error(err);
      setSelectedFileName('');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Upload Documents</h2>
        </div>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              id="description"
              placeholder="Title"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="record-type" className="text-sm font-medium text-gray-700">
              Record Type
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <select
                id="record-type"
                value={recordType}
                onChange={(e) => setRecordType(e.target.value)}
                className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors appearance-none pr-8"
              >
                <option value="">Select Record Type</option>
                <option value="Medical Report">Medical Report</option>
                <option value="Lab Results">Lab Results</option>
                <option value="Prescription">Prescription</option>
                <option value="Other">Other</option>
              </select>
              <label
                htmlFor="file-upload"
                className="whitespace-nowrap bg-[#00AAEE] text-white px-4 py-2.5 rounded-full font-medium cursor-pointer hover:bg-[#0099DD] transition-colors flex items-center space-x-2"
              >
                {/* SEARCH: Upload button text */}
                {/* REPLACE: Show loading spinner or upload text */}
                {isUploading ? (
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                ) : (
                  <Upload className="h-4 w-4 shrink-0" />
                )}
                <span className="truncate">{isUploading ? 'Uploading...' : 'Upload Files'}</span>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            {isUploading && (
              <p className="text-sm text-gray-500 mt-1">
                Uploading {selectedFileName}...
              </p>
            )}
            {fileUrl && !isUploading && (
              <p className="text-sm text-green-600 mt-1">
                Selected: {selectedFileName}
              </p>
            )}
          </div>
        </div>
        <div className="mt-6">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isUploading || isSubmitting}
            className={`w-full px-6 py-3 bg-[#00AAEE] text-white rounded-full font-medium hover:bg-[#0099DD] transition-colors ${isUploading || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {/* SEARCH: Submit button */}
            {/* REPLACE: Add loading spinner for submit button */}
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                <span>Submitting...</span>
              </div>
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}