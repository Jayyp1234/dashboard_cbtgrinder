'use client';

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import 'katex/dist/katex.min.css';
import { useEffect, useMemo, useState } from 'react';

declare global {
  interface Window {
    katex?: typeof import('katex');
  }
}

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  editorKey: number;
}

export default function QuillEditor({ value, onChange, editorKey }: QuillEditorProps) {
  const [katexLoaded, setKatexLoaded] = useState(false);

  useEffect(() => {
    const loadKatex = async () => {
      if (typeof window !== 'undefined' && !window.katex) {
        const katexModule = await import('katex');
        window.katex = katexModule;
        setKatexLoaded(true);
      }
    };
    loadKatex();
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ script: 'sub' }, { script: 'super' }],
          [{ indent: '-1' }, { indent: '+1' }],
          [{ direction: 'rtl' }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ align: [] }],
          ['link', 'image', 'code-block', 'formula'],
          ['clean'],
        ],
      },
    }),
    []
  );

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'script',
    'list',
    'align',
    'link',
    'image',
    'code-block',
    'formula',
  ];

  return (
    <div className="quill-wrapper">
      {!katexLoaded && (
        <p className="text-sm text-gray-500 mb-2">Loading math support...</p>
      )}
      <ReactQuill
        key={editorKey}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder="Type a question here with math..."
        style={{ height: '200px' }}
      />
    </div>
  );
}
