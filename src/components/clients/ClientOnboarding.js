




'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { toast } from "@/components/ui/use-toast"; // ✅ Call the toast method
import {
  ArrowLeft,
  User,
Briefcase,
  Mail,
  Phone,
  Users,
  Calendar,
  Globe,
  MapPin,
  File,
  X,
} from 'lucide-react';
import { addClient, updateFormData, addFile, removeFile, resetForm } from '@/store/features/clientSlice';
import DOMPurify from 'dompurify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AddClient() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { formData, addLoading: loading, addError: error, addSuccess: success } = useSelector((state) => state.client);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState({});

  const inputRefs = {
    clientName: useRef(null),
    industryType: useRef(null),
    contactEmail: useRef(null),
    contactNo: useRef(null),
    contactPersonName: useRef(null),
    address: useRef(null),
    website: useRef(null),
    onboardingDate: useRef(null),
  };

  useEffect(() => {
    const preventPaste = (e) => {
      e.preventDefault();
      setErrors((prev) => ({ ...prev, [e.target.name]: 'Pasting is not allowed' }));
    };
    Object.values(inputRefs).forEach((ref) => {
      if (ref.current) {
        ref.current.addEventListener('paste', preventPaste);
      }
    });

    return () => {
      Object.values(inputRefs).forEach((ref) => {
        if (ref.current) {
          ref.current.removeEventListener('paste', preventPaste);
        }
      });
    };
  }, []);

  const validateInput = (name, value) => {
    const cleanValue = DOMPurify.sanitize(value, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    switch (name) {
      case 'website':
        if (!value) return '';
        const urlPattern = /^(https?:\/\/)?([-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))$/;
        if (!urlPattern.test(cleanValue)) {
          return 'Invalid URL format';
        }
        return '';
      case 'contactEmail':
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(cleanValue)) {
          return 'Invalid email format';
        }
        return '';
      case 'contactNo':
        const phonePattern = /^[\d\s+-]{7,15}$/;
        if (!phonePattern.test(cleanValue)) {
          return 'Invalid phone number (7-15 digits, spaces, +, - allowed)';
        }
        return '';
      case 'onboardingDate':
        const date = new Date(cleanValue);
        if (isNaN(date.getTime())) {
          return 'Invalid date';
        }
        return '';
      case 'address':
        if (cleanValue.length < 5) {
          return 'Address must be at least 5 characters';
        }
        return '';
      case 'clientName':
      case 'industryType':
      case 'contactPersonName':
        if (cleanValue.length < 2) {
          return `${name === 'clientName' ? 'Client name' : name === 'industryType' ? 'Industry type' : 'Contact person'} must be at least 2 characters`;
        }
        const blockedChars = /[<>{}\[\]|\\^~`@#$%*=+]/;
        if (blockedChars.test(cleanValue)) {
          return 'Invalid characters detected';
        }
        return '';
      default:
        return '';
    }
  };

  const handleFileSelection = (files) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ];
    Array.from(files).forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({ ...prev, fileData: 'Only PDF, Word, Excel, or PowerPoint files are allowed' }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, fileData: 'File size must be less than 5MB' }));
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileData = {
          name: file.name,
          size: file.size,
          type: file.type,
          data: file,
          dataUrl: event.target.result,
          isNew: true,
        };
        dispatch(addFile(fileData));
        setErrors((prev) => ({ ...prev, fileData: '' }));
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'fileData' && files && files[0]) {
      handleFileSelection(files);
    } else {
      dispatch(updateFormData({ [name]: value }));
      const error = validateInput(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelection(files);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateInput(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));

    if (name === 'website' || name === 'contactNo') {
      let sanitizedValue = value;
      if (name === 'website' && value) {
        const cleanValue = DOMPurify.sanitize(value, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).trim();
        const urlPattern = /^(https?:\/\/)?([-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))$/;
        sanitizedValue = urlPattern.test(cleanValue) ? (cleanValue.startsWith('http://') || cleanValue.startsWith('https://') ? cleanValue : 'https://' + cleanValue) : '';
      } else if (name === 'contactNo') {
        sanitizedValue = DOMPurify.sanitize(value, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).replace(/[^\d\s+-]/g, '');
      }
      dispatch(updateFormData({ [name]: sanitizedValue }));
    }
  };

  const handleKeyDown = (e) => {
    const fieldName = e.target.name;
    if (fieldName !== 'website' && fieldName !== 'contactEmail' && fieldName !== 'contactNo' && fieldName !== 'address') {
      const blockedChars = ['<', '>', '{', '}', '[', ']', '|', '\\', '^', '~', '`', '@', '#', '$', '%', '*', '=', '+'];
      if (blockedChars.includes(e.key)) {
        e.preventDefault();
        setErrors((prev) => ({ ...prev, [fieldName]: 'Invalid character entered' }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (key !== 'fileData' && key !== 'website') {
        const error = validateInput(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'fileData' && Array.isArray(value) && value.length > 0) {
        value.forEach((file) => {
          if (file.data) {
            formDataToSend.append('fileData', file.data);
          }
        });
      } else if (value !== null && value !== '') {
        formDataToSend.append(key, value);
      }
    });

    try {
      await dispatch(addClient(formDataToSend)).unwrap();
      dispatch(resetForm());
      toast.success('Client Added!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
      });
      router.push('/client');
      setErrors({});
    } catch (error) {
      toast.error('Error while onboarding client!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  const handleReset = () => {
    dispatch(resetForm());
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  // Call on page load
  useEffect(() => {
    handleReset();
  }, []); // Empty dependency array ensures it runs once on mount
  const handleRemoveFile = (index) => {
    dispatch(removeFile(index));
  };

  return (

   <Card className="border border-green-200 shadow-xl ">
    <CardHeader className=" border-b border-green-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="back"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          <CardTitle className="text-2xl font-bold text-green-900">
            Client Onboarding Form
          </CardTitle>
        </div>
      </div>
    </CardHeader>
    <CardContent className="pt-8">
      {success && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 text-green-700 border border-green-300">
          Client added successfully!
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700 border border-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {[
          { name: 'clientName', label: 'Client Name', type: 'text', icon: <User className="h-5 w-5 text-green-600" />, ref: inputRefs.clientName, required: true, onKeyDown: handleKeyDown },
          { name: 'industryType', label: 'Industry Type', type: 'text', icon: <Briefcase className="h-5 w-5 text-green-600" />, ref: inputRefs.industryType, required: true, onKeyDown: handleKeyDown },
          { name: 'contactEmail', label: 'Email', type: 'email', icon: <Mail className="h-5 w-5 text-green-600" />, ref: inputRefs.contactEmail, required: true },
          { name: 'contactNo', label: 'Contact Number', type: 'tel', icon: <Phone className="h-5 w-5 text-green-600" />, ref: inputRefs.contactNo, required: true },
          { name: 'contactPersonName', label: 'Contact Person', type: 'text', icon: <Users className="h-5 w-5 text-green-600" />, ref: inputRefs.contactPersonName, required: true, onKeyDown: handleKeyDown },
          { name: 'onboardingDate', label: 'Onboarding Date', type: 'date', icon: <Calendar className="h-5 w-5 text-green-600" />, ref: inputRefs.onboardingDate, required: true },
          { name: 'website', label: 'Website (Optional)', type: 'url', icon: <Globe className="h-5 w-5 text-green-600" />, ref: inputRefs.website, required: false, colSpan: 2 },
          { name: 'address', label: 'Address', type: 'textarea', icon: <MapPin className="h-5 w-5 text-green-600" />, ref: inputRefs.address, required: true, colSpan: 2 },
        ].map((field) => (
          <div key={field.name} className={`flex flex-col ${field.colSpan ? 'sm:col-span-2' : ''}`}>
            <Label htmlFor={field.name} className="text-base font-semibold text-gray-800 mb-2 flex items-center gap-2">
              {field.icon}
              {field.label}
            </Label>
            {field.type === 'textarea' ? (
              <Textarea
                id={field.name}
                ref={field.ref}
                name={field.name}
                placeholder={field.label}
                value={formData[field.name] || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={field.onKeyDown}
                className="border-gray-300 focus:border-green-500 focus:ring-green-500 bg-white text-gray-900 placeholder-gray-400 rounded-lg"
                required={field.required}
              />
            ) : (
              <Input
                id={field.name}
                type={field.type}
                ref={field.ref}
                name={field.name}
                placeholder={field.label}
                value={formData[field.name] || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={field.onKeyDown}
                className="border-gray-300 focus:border-green-500 focus:ring-green-500 bg-white text-gray-900 placeholder-gray-400 rounded-lg"
                required={field.required}
              />
            )}
            {errors[field.name] && (
              <span className="text-red-600 text-sm mt-1 font-medium">{errors[field.name]}</span>
            )}
          </div>
        ))}

        <div className="flex flex-col sm:col-span-2">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <File className="h-5 w-5 text-green-600" />
            Documents
          </h2>
          <div
            ref={dropZoneRef}
            className={`border-2 border-dashed border-gray-300 p-6 rounded-lg bg-white ${isDragging ? 'border-green-500 bg-green-50' : ''}`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              name="fileData"
              id="fileData"
              onChange={handleChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.xlsx,.xls,.ppt,.pptx"
              ref={fileInputRef}
              multiple
            />
            <Label
              htmlFor="fileData"
              className="cursor-pointer flex items-center justify-center w-full p-4 text-gray-600 font-medium"
            >
              <File className="h-5 w-5 text-green-600 mr-2" />
              Drag & drop your files here or click to browse
            </Label>
            {errors.fileData && (
              <span className="text-red-600 text-sm mt-2 block">{errors.fileData}</span>
            )}
            {formData?.fileData?.length > 0 && (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formData.fileData.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <File className="h-5 w-5 text-green-600" />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-gray-700 truncate block">{file.name}</span>
                        <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="sm:col-span-2 flex justify-center mt-8">
          <Button
            type="submit"
            disabled={loading}
            className="bg-green-700 text-white hover:bg-green-800 text-base font-semibold px-8 py-3 rounded-lg"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-2"></div>
                Saving...
              </div>
            ) : (
              'Onboard Client'
            )}
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>

  );
}