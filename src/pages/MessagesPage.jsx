import React from 'react';
import { MessageSquare, Construction } from 'lucide-react';

const MessagesPage = ({ user }) => {
    return (
        <div className="min-h-screen bg-gray-50 pt-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="bg-blue-100 p-4 rounded-full">
                            <MessageSquare className="h-12 w-12 text-blue-600" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Messages</h1>
                    <div className="flex items-center justify-center mb-4">
                        <Construction className="h-6 w-6 text-yellow-600 mr-2" />
                        <p className="text-lg text-gray-600">Messaging system coming soon!</p>
                    </div>
                    <p className="text-gray-500 mb-6">
                        We're building an amazing messaging experience for buyers and sellers.
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        className="btn-primary"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MessagesPage;