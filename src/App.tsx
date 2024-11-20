import { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SearchForm } from './components/SearchForm';
import { AnalysisResult } from './components/AnalysisResult';
import { analyzeMedicine } from './services/api';
import { Loader2 } from 'lucide-react';

function App() {
    const [analysisData, setAnalysisData] = useState(null);
    const [error, setError] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState(false);

    const handleAnalyze = async (query: string) => {
        setIsLoading(true);
        setError(undefined);
        try {
            const data = await analyzeMedicine(query);
            setAnalysisData(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
            setAnalysisData(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow max-w-7xl mx-auto py-6 sm:py-8">
                <div className="flex flex-col items-center space-y-6 sm:space-y-8">
                    <div className="text-center max-w-2xl px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                            Analyze Your Medicine
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600">
                            Enter the medicine name or content to get the information and side effects.
                        </p>
                    </div>

                    <SearchForm onAnalyze={handleAnalyze} isLoading={isLoading} />

                    {isLoading && (
                        <div className="flex items-center space-x-2 text-blue-600">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span className="text-sm sm:text-base">Analyzing medicine...</span>
                        </div>
                    )}

                    <AnalysisResult data={analysisData} error={error} />
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default App;
