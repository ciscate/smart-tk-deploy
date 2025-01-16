import { useEffect, useState } from "react";

export function FileViewer({ fileUrl, onClose }) {
    const [fileType, setFileType] = useState('');

    useEffect(() => {
        if (fileUrl) {
            const extension = fileUrl.split('.').pop();
            setFileType(extension);
        }
    }, [fileUrl]);
    const renderFile = () => {
        if (fileType === 'txt') {
            return <TextFileViewer fileUrl={fileUrl} />;
        } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileType)) {
            return <ImageFileViewer fileUrl={fileUrl} />;
        } else if (fileType === 'pdf') {
            return <PDFFileViewer fileUrl={fileUrl} />;
        } else {
            return (
                <div>
                    <a href={fileUrl} download className="text-blue-500 underline">
                        Descargar Archivo
                    </a>
                </div>
            );
        }
    };
    return (
        <div className="file-viewer bg-gray-900 bg-opacity-75 fixed inset-0 flex items-center justify-center">
            <div className="bg-white p-5 rounded-lg shadow-lg max-w-3xl w-full">
                <button onClick={onClose} className="bg-red-500 p-2 rounded-full text-white mb-4">Cerrar</button>
                {renderFile()}
            </div>
        </div>
    );
}

const TextFileViewer = ({ fileUrl }) => {
    const [content, setContent] = useState('');
    useEffect(() => {
        fetch(fileUrl)
            .then((response) => response.text())
            .then((data) => setContent(data))
            .catch((error) => console.error('Error loading text file:', error));
    }, [fileUrl]);
    return (
        <div className="bg-gray-200 p-3 rounded-lg">
            <h3 className="font-bold mb-2">Contenido txt:</h3>
            <pre className="whitespace-pre-wrap">{content}</pre>
        </div>
    );
};

const ImageFileViewer = ({ fileUrl }) => (
    <div className="bg-gray-200 p-3 rounded-lg">
        <h3 className="font-bold mb-2">Vista Imagen:</h3>
        <img src={fileUrl} alt="File Preview" className="max-w-full h-auto" />
    </div>
);

const PDFFileViewer = ({ fileUrl }) => (
    <div className="bg-gray-200 p-3 rounded-lg">
        <h3 className="font-bold mb-2">Vista PDF:</h3>
        <iframe src={fileUrl} width="100%" height="600px" title="PDF Preview" className="border-2 border-gray-400" />
    </div>
);
