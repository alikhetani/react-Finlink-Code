import React, { useState, useRef } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { api } from '../services/api';
import { ArrowUpTrayIcon, CameraIcon } from '../components/icons';
import { ProgressBar } from '../components/ProgressBar';

export const KycPage: React.FC = () => {
    const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
    const [panFile, setPanFile] = useState<File | null>(null);
    const [selfie, setSelfie] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
    const [currentStep, setCurrentStep] = useState(0);

    const steps = ['Document Upload', 'Facial Verification', 'Submission'];
    
    const aadhaarRef = useRef<HTMLInputElement>(null);
    const panRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
            if(aadhaarFile || panFile) setCurrentStep(1);
        }
    };

    const handleSelfieCapture = () => {
        // In a real app, this would open the camera.
        // For this demo, we'll use a placeholder image.
        setSelfie('https://picsum.photos/seed/selfie/400/300');
        setStatusMessage('');
        setCurrentStep(2);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!aadhaarFile || !panFile) {
            setStatusMessage('Please upload both Aadhaar and PAN documents.');
            setMessageType('error');
            return;
        }
        if (!selfie) {
            setStatusMessage('Please complete the facial verification step.');
            setMessageType('error');
            return;
        }

        setIsUploading(true);
        setStatusMessage('');
        try {
            const fileList = new DataTransfer();
            fileList.items.add(aadhaarFile);
            fileList.items.add(panFile);

            const response = await api.uploadKycDocuments(fileList.files);
            setStatusMessage(response.message);
            setMessageType('success');
            setAadhaarFile(null);
            setPanFile(null);
            setSelfie(null);
            setCurrentStep(0);
        } catch (error) {
            setStatusMessage('An error occurred during upload. Please try again.');
            setMessageType('error');
        } finally {
            setIsUploading(false);
        }
    };

    const FileInput: React.FC<{label: string, file: File | null, inputRef: React.RefObject<HTMLInputElement>, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}> = ({label, file, inputRef, onChange}) => (
         <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>
            <button type="button" onClick={() => inputRef.current?.click()} className="w-full flex items-center justify-center px-4 py-6 border-2 border-slate-300 border-dashed rounded-md dark:border-slate-600 hover:border-blue-500 transition-colors">
                <div className="text-center">
                    <ArrowUpTrayIcon className="mx-auto h-10 w-10 text-slate-400" />
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                        {file ? file.name : 'Click to select a file'}
                    </p>
                </div>
            </button>
            <input type="file" ref={inputRef} onChange={onChange} className="hidden" accept="image/*,.pdf" />
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">KYC Verification</h1>
            <Card>
                <div className="mb-8">
                    <ProgressBar steps={steps} currentStep={currentStep} />
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Please upload your documents and complete facial verification to unlock all features.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FileInput label="Aadhaar Card / Passport" file={aadhaarFile} inputRef={aadhaarRef} onChange={(e) => handleFileChange(e, setAadhaarFile)} />
                        <FileInput label="PAN Card" file={panFile} inputRef={panRef} onChange={(e) => handleFileChange(e, setPanFile)} />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Facial Verification</label>
                        <div className="w-full p-4 border-2 border-slate-300 border-dashed rounded-md dark:border-slate-600 text-center">
                            {selfie ? (
                                <img src={selfie} alt="User selfie" className="rounded-md mx-auto" />
                            ) : (
                                <div className="py-4">
                                    <CameraIcon className="mx-auto h-12 w-12 text-slate-400" />
                                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Click below to capture your selfie.</p>
                                </div>
                            )}
                            <Button type="button" variant="secondary" onClick={handleSelfieCapture} className="mt-4">
                                {selfie ? 'Retake Selfie' : 'Open Camera'}
                            </Button>
                        </div>
                    </div>
                    
                    {statusMessage && (
                        <div className={`p-3 rounded-md text-sm ${messageType === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'}`}>
                            {statusMessage}
                        </div>
                    )}
                    
                    <Button type="submit" fullWidth disabled={isUploading || !aadhaarFile || !panFile || !selfie}>
                        {isUploading ? 'Submitting...' : 'Submit for Verification'}
                    </Button>
                </form>
            </Card>
        </div>
    );
};