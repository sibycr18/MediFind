import React from 'react';
import { Tablets, AlertCircle, Info, Pill } from 'lucide-react';
import MedicineImages from './MedicineImages';

interface AnalysisResultProps {
    data: {
        name?: string;
        useAndWorking?: string;
        sideEffects?: string[];
        alternatives?: string[];
        confidence?: number;
        howToUse?: string;
        warnings?: string[];
    } | null;
    error?: string;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ data, error }) => {
    if (error) {
        return (
            <div className="w-full max-w-2xl px-4 sm:px-0">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-red-600">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <p className="font-medium text-sm sm:text-base">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="w-full max-w-2xl space-y-4 px-4 sm:px-0">
            {data.name && (
                <div className="bg-white shadow rounded-lg p-4 sm:p-6">
                    <div className="flex items-center space-x-2 mb-3">
                        <Pill className="h-5 w-5 text-[#E5446D] flex-shrink-0" />
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 leading-none">
                            {data.name}
                        </h2>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600">{data.useAndWorking}</p>
                </div>
            )}

            {(data.confidence ?? 0) >= 0.6 && data.name && <MedicineImages medicineName={data.name} />}

            {data.howToUse && (
                <div className="bg-white shadow rounded-lg p-4 sm:p-6">
                    <div className="flex items-center space-x-2 mb-3">
                        <Info className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Usage</h3>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600">{data.howToUse}</p>
                </div>
            )}

            {data.sideEffects && data.sideEffects.length > 0 && (
                <div className="bg-white shadow rounded-lg p-4 sm:p-6">
                    <div className="flex items-center space-x-2 mb-3">
                        <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Side Effects</h3>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-gray-600">
                        {data.sideEffects.map((effect, index) => (
                            <li key={index}>{effect}</li>
                        ))}
                    </ul>
                </div>
            )}

            {data.alternatives && data.alternatives.length > 0 && (
                <div className="bg-white shadow rounded-lg p-4 sm:p-6 mt-6">
                    <div className="flex items-center space-x-2 mb-3">
                        <Tablets className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Alternatives</h3>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-gray-600">
                        {data.alternatives.map((medicine, index) => (
                            <li key={index}>{medicine}</li>
                        ))}
                    </ul>
                </div>
            )}


            {data.warnings && data.warnings.length > 0 && (
                <div className="bg-white shadow rounded-lg p-4 sm:p-6">
                    <div className="flex items-center space-x-2 mb-3">
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Warnings</h3>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-gray-600">
                        {data.warnings.map((warning, index) => (
                            <li key={index}>{warning}</li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="mt-4 pt-4 text-sm text-gray-600 flex justify-center items-center text-center">
                <span>
                    <strong>Important Note:</strong> The information provided is gathered using AI. It is intended for general guidance only and should not be considered as professional medical advice. Always consult a healthcare professional before making medical decisions.
                </span>
            </div>
        </div>
    );
};
